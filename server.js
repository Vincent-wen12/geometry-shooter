const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // 修复目录遍历漏洞
    let filePath = path.join(__dirname, req.url);
    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    }
    
    // 确保路径在当前目录内
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const wss = new WebSocket.Server({ server });

const rooms = new Map();

wss.on('connection', (ws) => {
    console.log('新用户连接');
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            handleMessage(ws, message);
        } catch (error) {
            console.error('消息解析错误:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('用户断开连接');
        handleDisconnect(ws);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });
});

function handleMessage(ws, message) {
    switch (message.type) {
        case 'join':
            handleJoin(ws, message);
            break;
            
        case 'update':
            handleUpdate(ws, message);
            break;
            
        case 'shoot':
            handleShoot(ws, message);
            break;
            
        case 'chat':
            handleChat(ws, message);
            break;
            
        case 'ping':
            // 忽略心跳消息
            break;
    }
}

function handleJoin(ws, message) {
    const roomId = message.roomId;
    const userId = message.userId;
    
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
    }
    
    const room = rooms.get(roomId);
    room.set(userId, {
        id: userId,
        name: message.name,
        color: message.color,
        ws: ws,
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 150,
        angle: 0,
        health: 100,
        kills: 0
    });
    
    ws.roomId = roomId;
    ws.userId = userId;
    
    broadcastToRoom(roomId, {
        type: 'playerJoin',
        userId: userId,
        name: message.name
    });
    
    sendPlayersList(roomId);
    
    console.log(`${message.name} 加入了房间 ${roomId}`);
}

function handleUpdate(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    
    if (player) {
        player.x = message.x;
        player.y = message.y;
        player.angle = message.angle;
        player.health = message.health;
        player.kills = message.kills;
    }
    
    sendPlayersList(ws.roomId);
}

function handleShoot(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    broadcastToRoom(ws.roomId, {
        type: 'shoot',
        userId: ws.userId,
        x: message.x,
        y: message.y,
        vx: message.vx,
        vy: message.vy,
        color: message.color
    }, ws);
}

function handleChat(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    
    if (player) {
        broadcastToRoom(ws.roomId, {
            type: 'chat',
            userId: ws.userId,
            name: player.name,
            message: message.message
        });
    }
}

function sendPlayersList(roomId) {
    if (!rooms.has(roomId)) return;
    
    const room = rooms.get(roomId);
    const players = {};
    
    room.forEach((p, id) => {
        players[id] = {
            name: p.name,
            color: p.color,
            x: p.x,
            y: p.y,
            angle: p.angle,
            health: p.health,
            kills: p.kills
        };
    });
    
    broadcastToRoom(roomId, {
        type: 'players',
        players: players
    });
}

function handleDisconnect(ws) {
    if (ws.roomId && rooms.has(ws.roomId)) {
        const room = rooms.get(ws.roomId);
        const player = room.get(ws.userId);
        
        if (player) {
            broadcastToRoom(ws.roomId, {
                type: 'playerLeave',
                userId: ws.userId,
                name: player.name
            });
            
            room.delete(ws.userId);
            
            if (room.size === 0) {
                rooms.delete(ws.roomId);
                console.log(`房间 ${ws.roomId} 已关闭`);
            } else {
                sendPlayersList(ws.roomId);
            }
        }
    }
}

function broadcastToRoom(roomId, message, excludeWs = null) {
    if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.forEach((p, id) => {
            if (p.ws !== excludeWs && p.ws.readyState === WebSocket.OPEN) {
                try {
                    p.ws.send(JSON.stringify(message));
                } catch (e) {
                    console.error('发送消息失败:', e);
                }
            }
        });
    }
}

// 添加全局异常捕获
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('未处理的Promise拒绝:', error);
});

server.listen(PORT, () => {
    console.log('\n🎮 几何枪战服务器已启动！');
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log('\n📋 游戏说明:');
    console.log('• WASD/方向键 - 移动');
    console.log('• 鼠标 - 瞄准');
    console.log('• 左键 - 射击');
    console.log('• 输入房间ID与朋友联机！\n');
});
