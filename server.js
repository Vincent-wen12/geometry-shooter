const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MAP_WIDTH = 3000;
const MAP_HEIGHT = 2000;

const OFFICIAL_ROOM_COUNT = 5;
const MAX_PLAYERS_PER_ROOM = 8;

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url);
    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    }
    
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
            res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
            res.end(content, 'utf-8');
        }
    });
});

const wss = new WebSocket.Server({ server });

const rooms = new Map();
const gameStates = new Map();

const VEHICLE_TYPES = [
    { type: 'tank', name: '坦克', color: '#e74c3c', radius: 30, speed: 3, health: 200, fireRate: 800, damage: 25 },
    { type: 'armored', name: '装甲车', color: '#f39c12', radius: 28, speed: 4, health: 150, fireRate: 600, damage: 20 },
    { type: 'helicopter', name: '直升机', color: '#27ae60', radius: 26, speed: 5, health: 100, fireRate: 400, damage: 15 }
];

const POWERUP_TYPES = [
    { type: 'health', name: '生命', color: '#2ecc71', effect: 30, icon: '+' },
    { type: 'shield', name: '护盾', color: '#3498db', effect: 50, icon: 'O' },
    { type: 'speed', name: '速度', color: '#f1c40f', effect: 3, icon: '>' },
    { type: 'damage', name: '攻击', color: '#e74c3c', effect: 1.5, icon: '*' }
];

const LOOT_TYPES = [
    { type: 'health', color: '#2ecc71', effect: 25 },
    { type: 'ammo', color: '#e67e22', effect: 30 },
    { type: 'speed', color: '#f1c40f', effect: 3 }
];

function ensureGameState(roomId) {
    if (!gameStates.has(roomId)) {
        const gs = {
            enemies: [],
            loots: [],
            powerups: [],
            vehicles: [],
            tickCount: 0,
            enemySpawnCounter: 0,
            enemyIdCounter: 0,
            lootIdCounter: 0,
            powerupIdCounter: 0,
            vehicleIdCounter: 0,
            tickInterval: null
        };
        gameStates.set(roomId, gs);
        return gs;
    }
    return gameStates.get(roomId);
}

function startGameLoop(roomId) {
    const gs = ensureGameState(roomId);
    if (gs.tickInterval) return;
    gs.tickInterval = setInterval(() => gameTick(roomId), 50);
}

function stopGameLoop(roomId) {
    if (gameStates.has(roomId)) {
        const gs = gameStates.get(roomId);
        if (gs.tickInterval) {
            clearInterval(gs.tickInterval);
            gs.tickInterval = null;
        }
        gameStates.delete(roomId);
    }
}

function gameTick(roomId) {
    if (!rooms.has(roomId)) {
        stopGameLoop(roomId);
        return;
    }
    
    const room = rooms.get(roomId);
    if (room.size === 0) {
        stopGameLoop(roomId);
        return;
    }
    
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    gs.tickCount++;
    
    // 1. Spawn enemies
    gs.enemySpawnCounter++;
    if (gs.enemySpawnCounter >= 50 && gs.enemies.length < 8) {
        gs.enemySpawnCounter = 0;
        spawnEnemy(roomId);
    }
    
    // 2. Update enemies AI
    updateEnemiesAI(roomId);
    
    // 3. Spawn powerups
    if (gs.powerups.length < 5 && Math.random() < 0.01) {
        spawnPowerup(roomId);
    }
    
    // 4. Update vehicles
    updateVehiclesAI(roomId);
    if (gs.vehicles.length < 3 && Math.random() < 0.002) {
        spawnVehicle(roomId);
    }
    
    // 5. Vehicles auto-shoot at enemies
    updateVehicleShooting(roomId);
    
    // 6. Broadcast game state
    broadcastGameState(roomId);
}

function spawnEnemy(roomId) {
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch(side) {
        case 0: x = -30; y = Math.random() * MAP_HEIGHT; break;
        case 1: x = MAP_WIDTH + 30; y = Math.random() * MAP_HEIGHT; break;
        case 2: x = Math.random() * MAP_WIDTH; y = -30; break;
        case 3: x = Math.random() * MAP_WIDTH; y = MAP_HEIGHT + 30; break;
    }
    
    const id = 'enemy_' + (gs.enemyIdCounter++);
    gs.enemies.push({
        id: id,
        x: x,
        y: y,
        radius: 15 + Math.random() * 15,
        speed: 1.5 + Math.random() * 2,
        health: 30 + Math.random() * 30,
        maxHealth: 0,
        color: '#ff4757',
        angle: 0,
        hitFlash: 0
    });
    const enemy = gs.enemies[gs.enemies.length - 1];
    enemy.maxHealth = enemy.health;
}

function spawnPowerup(roomId) {
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    const id = 'powerup_' + (gs.powerupIdCounter++);
    gs.powerups.push({
        id: id,
        x: Math.random() * (MAP_WIDTH - 200) + 100,
        y: Math.random() * (MAP_HEIGHT - 200) + 100,
        type: type.type,
        name: type.name,
        color: type.color,
        effect: type.effect,
        icon: type.icon,
        radius: 15
    });
}

function spawnVehicle(roomId) {
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const type = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
    const id = 'vehicle_' + (gs.vehicleIdCounter++);
    gs.vehicles.push({
        id: id,
        x: Math.random() * (MAP_WIDTH - 400) + 200,
        y: Math.random() * (MAP_HEIGHT - 400) + 200,
        type: type.type,
        name: type.name,
        color: type.color,
        radius: type.radius,
        speed: type.speed,
        health: type.health,
        maxHealth: type.health,
        fireRate: type.fireRate,
        damage: type.damage,
        angle: Math.random() * Math.PI * 2,
        lastFire: 0,
        occupied: false,
        occupantId: null
    });
}

function spawnLoot(roomId, x, y, type, value) {
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const lootInfo = LOOT_TYPES.find(t => t.type === type) || LOOT_TYPES[0];
    const id = 'loot_' + (gs.lootIdCounter++);
    gs.loots.push({
        id: id,
        x: x,
        y: y,
        type: type,
        value: value,
        color: lootInfo.color,
        radius: 12
    });
}

function updateEnemiesAI(roomId) {
    const room = rooms.get(roomId);
    const gs = gameStates.get(roomId);
    if (!room || !gs) return;
    
    for (let i = gs.enemies.length - 1; i >= 0; i--) {
        const enemy = gs.enemies[i];
        if (enemy.hitFlash > 0) enemy.hitFlash -= 1;
        
        let nearestPlayer = null;
        let nearestDist = Infinity;
        
        room.forEach((player, id) => {
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestPlayer = player;
            }
        });
        
        if (nearestPlayer) {
            const angle = Math.atan2(nearestPlayer.y - enemy.y, nearestPlayer.x - enemy.x);
            enemy.angle = angle;
            enemy.x += Math.cos(angle) * enemy.speed;
            enemy.y += Math.sin(angle) * enemy.speed;
            
            enemy.x = Math.max(-50, Math.min(MAP_WIDTH + 50, enemy.x));
            enemy.y = Math.max(-50, Math.min(MAP_HEIGHT + 50, enemy.y));
            
            const dist = Math.hypot(nearestPlayer.x - enemy.x, nearestPlayer.y - enemy.y);
            if (dist < enemy.radius + 20) {
                nearestPlayer.health -= 0.5;
                if (nearestPlayer.health < 0) nearestPlayer.health = 0;
            }
        }
        
        if (enemy.health <= 0) {
            spawnLoot(roomId, enemy.x, enemy.y, 'exp', 25);
            if (Math.random() < 0.3) {
                const lootType = LOOT_TYPES[Math.floor(Math.random() * LOOT_TYPES.length)];
                spawnLoot(roomId,
                    enemy.x + (Math.random() - 0.5) * 30,
                    enemy.y + (Math.random() - 0.5) * 30,
                    lootType.type,
                    lootType.effect
                );
            }
            gs.enemies.splice(i, 1);
        }
    }
}

function updateVehiclesAI(roomId) {
    const room = rooms.get(roomId);
    const gs = gameStates.get(roomId);
    if (!room || !gs) return;
    
    for (let i = gs.vehicles.length - 1; i >= 0; i--) {
        const vehicle = gs.vehicles[i];
        if (vehicle.occupied) continue;
        
        let nearestEnemy = null;
        let nearestDist = 300;
        
        for (const enemy of gs.enemies) {
            const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        }
        
        if (nearestEnemy && nearestDist < 300) {
            vehicle.angle = Math.atan2(nearestEnemy.y - vehicle.y, nearestEnemy.x - vehicle.x);
            
            if (nearestDist > 200) {
                vehicle.x += Math.cos(vehicle.angle) * vehicle.speed * 0.3;
                vehicle.y += Math.sin(vehicle.angle) * vehicle.speed * 0.3;
            } else if (nearestDist < 100) {
                const awayAngle = vehicle.angle + Math.PI;
                vehicle.x += Math.cos(awayAngle) * vehicle.speed * 0.3;
                vehicle.y += Math.sin(awayAngle) * vehicle.speed * 0.3;
            }
        }
        
        for (const enemy of gs.enemies) {
            const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
            if (dist < vehicle.radius + enemy.radius) {
                vehicle.health -= 0.2;
                if (vehicle.health <= 0) {
                    gs.vehicles.splice(i, 1);
                    break;
                }
            }
        }
        
        vehicle.x = Math.max(vehicle.radius, Math.min(MAP_WIDTH - vehicle.radius, vehicle.x));
        vehicle.y = Math.max(vehicle.radius, Math.min(MAP_HEIGHT - vehicle.radius, vehicle.y));
        
        if (vehicle.health <= 0) {
            gs.vehicles.splice(i, 1);
        }
    }
}

function updateVehicleShooting(roomId) {
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const now = Date.now();
    for (const vehicle of gs.vehicles) {
        if (vehicle.occupied) continue;
        if (now - vehicle.lastFire < vehicle.fireRate) continue;
        
        let nearestEnemy = null;
        let nearestDist = 400;
        
        for (const enemy of gs.enemies) {
            const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        }
        
        if (nearestEnemy && nearestDist < 400) {
            vehicle.lastFire = now;
            
            for (const enemy of gs.enemies) {
                const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
                if (dist < 400) {
                    const angle = Math.atan2(enemy.y - vehicle.y, enemy.x - vehicle.x);
                    const dx = Math.cos(angle) * 12;
                    const dy = Math.sin(angle) * 12;
                    
                    for (let step = 0; step < 10; step++) {
                        const bx = vehicle.x + dx * step / 10;
                        const by = vehicle.y + dy * step / 10;
                        const hitDist = Math.hypot(enemy.x - bx, enemy.y - by);
                        if (hitDist < 8 + enemy.radius) {
                            enemy.health -= vehicle.damage * 0.5;
                            enemy.hitFlash = 3;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
}

function checkBulletHit(roomId, bx, by, bvx, bvy, damage, radius) {
    const gs = gameStates.get(roomId);
    if (!gs) return { hit: false };
    
    const steps = Math.max(1, Math.ceil(Math.hypot(bvx, bvy) / 5));
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = bx + bvx * t;
        const cy = by + bvy * t;
        
        for (const enemy of gs.enemies) {
            const dist = Math.hypot(cx - enemy.x, cy - enemy.y);
            if (dist < radius + enemy.radius) {
                enemy.health -= damage;
                enemy.hitFlash = 3;
                return { hit: true, enemy: enemy };
            }
        }
    }
    
    return { hit: false };
}

function broadcastGameState(roomId) {
    if (!rooms.has(roomId)) return;
    const gs = gameStates.get(roomId);
    if (!gs) return;
    
    const state = {
        type: 'gameState',
        enemies: gs.enemies.map(e => ({
            id: e.id,
            x: Math.round(e.x),
            y: Math.round(e.y),
            radius: e.radius,
            health: Math.round(e.health),
            maxHealth: e.maxHealth,
            color: e.color,
            angle: e.angle,
            hitFlash: e.hitFlash
        })),
        loots: gs.loots.map(l => ({
            id: l.id,
            x: Math.round(l.x),
            y: Math.round(l.y),
            type: l.type,
            value: l.value,
            color: l.color
        })),
        powerups: gs.powerups.map(p => ({
            id: p.id,
            x: Math.round(p.x),
            y: Math.round(p.y),
            type: p.type,
            color: p.color,
            icon: p.icon,
            name: p.name
        })),
        vehicles: gs.vehicles.map(v => ({
            id: v.id,
            x: Math.round(v.x),
            y: Math.round(v.y),
            type: v.type,
            name: v.name,
            color: v.color,
            radius: v.radius,
            health: Math.round(v.health),
            maxHealth: v.maxHealth,
            angle: v.angle,
            occupied: v.occupied,
            occupantId: v.occupantId,
            speed: v.speed
        }))
    };
    
    broadcastToRoom(roomId, state);
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
            kills: p.kills || 0
        };
    });
    
    broadcastToRoom(roomId, {
        type: 'players',
        players: players
    });
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
            break;
        case 'pvpHit':
            handlePvpHit(ws, message);
            break;
        case 'playerKilled':
            handlePlayerKilled(ws, message);
            break;
        case 'collectLoot':
            handleCollectLoot(ws, message);
            break;
        case 'collectPowerup':
            handleCollectPowerup(ws, message);
            break;
        case 'enterVehicle':
            handleEnterVehicle(ws, message);
            break;
        case 'leaveVehicle':
            handleLeaveVehicle(ws, message);
            break;
        case 'vehicleShoot':
            handleVehicleShoot(ws, message);
            break;
        case 'getOfficialRooms':
            handleGetOfficialRooms(ws, message);
            break;
        case 'joinOfficialRoom':
            handleJoinOfficialRoom(ws, message);
            break;
    }
}

function handleJoin(ws, message) {
    const roomId = message.roomId || 'default';
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
        maxHealth: 100,
        kills: 0,
        exp: 0,
        inVehicle: false
    });
    
    ws.roomId = roomId;
    ws.userId = userId;
    
    startGameLoop(roomId);
    
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
        player.kills = message.kills || 0;
        player.inVehicle = message.inVehicle || false;
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
    
    const result = checkBulletHit(
        ws.roomId,
        message.x, message.y,
        message.vx, message.vy,
        message.damage || 15,
        message.bulletRadius || 5
    );
    
    if (result.hit && result.enemy && result.enemy.health <= 0) {
        const room = rooms.get(ws.roomId);
        const player = room.get(ws.userId);
        if (player) {
            player.kills = (player.kills || 0) + 1;
            sendPlayersList(ws.roomId);
        }
    }
}

function handleVehicleShoot(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    broadcastToRoom(ws.roomId, {
        type: 'shoot',
        userId: ws.userId,
        x: message.x,
        y: message.y,
        vx: message.vx,
        vy: message.vy,
        color: message.color,
        isVehicle: true
    }, ws);
    
    const result = checkBulletHit(
        ws.roomId,
        message.x, message.y,
        message.vx, message.vy,
        message.damage || 25,
        message.bulletRadius || 8
    );
    
    if (result.hit && result.enemy && result.enemy.health <= 0) {
        const room = rooms.get(ws.roomId);
        const player = room.get(ws.userId);
        if (player) {
            player.kills = (player.kills || 0) + 1;
            sendPlayersList(ws.roomId);
        }
    }
}

function handleCollectLoot(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const gs = gameStates.get(ws.roomId);
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    if (!gs || !player) return;
    
    const lootIndex = gs.loots.findIndex(l => l.id === message.lootId);
    if (lootIndex === -1) return;
    
    const loot = gs.loots[lootIndex];
    const dist = Math.hypot(player.x - loot.x, player.y - loot.y);
    if (dist > 80) return;
    
    gs.loots.splice(lootIndex, 1);
    
    let effectValue = 0;
    switch(loot.type) {
        case 'health':
            effectValue = Math.min(player.maxHealth || 100, player.health + loot.value) - player.health;
            player.health += effectValue;
            break;
        case 'exp':
            effectValue = loot.value;
            break;
        case 'ammo':
            effectValue = loot.value;
            break;
        case 'speed':
            effectValue = loot.value;
            break;
    }
    
    broadcastToRoom(ws.roomId, {
        type: 'lootCollected',
        lootId: message.lootId,
        userId: ws.userId,
        lootType: loot.type,
        effectValue: effectValue
    });
}

function handleCollectPowerup(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const gs = gameStates.get(ws.roomId);
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    if (!gs || !player) return;
    
    const powerupIndex = gs.powerups.findIndex(p => p.id === message.powerupId);
    if (powerupIndex === -1) return;
    
    const powerup = gs.powerups[powerupIndex];
    const dist = Math.hypot(player.x - powerup.x, player.y - powerup.y);
    if (dist > 80) return;
    
    gs.powerups.splice(powerupIndex, 1);
    
    broadcastToRoom(ws.roomId, {
        type: 'powerupCollected',
        powerupId: message.powerupId,
        userId: ws.userId,
        powerupType: powerup.type,
        effectValue: powerup.effect
    });
}

function handleEnterVehicle(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const gs = gameStates.get(ws.roomId);
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    if (!gs || !player) return;
    
    const vehicle = gs.vehicles.find(v => v.id === message.vehicleId);
    if (!vehicle || vehicle.occupied) return;
    
    const dist = Math.hypot(player.x - vehicle.x, player.y - vehicle.y);
    if (dist > 100) return;
    
    vehicle.occupied = true;
    vehicle.occupantId = ws.userId;
    player.inVehicle = true;
    
    broadcastToRoom(ws.roomId, {
        type: 'vehicleEntered',
        userId: ws.userId,
        vehicleId: message.vehicleId
    });
}

function handleLeaveVehicle(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const gs = gameStates.get(ws.roomId);
    const room = rooms.get(ws.roomId);
    const player = room.get(ws.userId);
    if (!gs || !player) return;
    
    const vehicle = gs.vehicles.find(v => v.id === message.vehicleId);
    if (!vehicle) return;
    
    vehicle.occupied = false;
    vehicle.occupantId = null;
    player.inVehicle = false;
    
    broadcastToRoom(ws.roomId, {
        type: 'vehicleLeft',
        userId: ws.userId,
        vehicleId: message.vehicleId
    });
}

function handleGetOfficialRooms(ws) {
    const officialRooms = [];
    for (let i = 1; i <= OFFICIAL_ROOM_COUNT; i++) {
        const roomId = '官方-' + i;
        if (rooms.has(roomId)) {
            officialRooms.push({
                id: roomId,
                playerCount: rooms.get(roomId).size,
                maxPlayers: MAX_PLAYERS_PER_ROOM
            });
        } else {
            officialRooms.push({
                id: roomId,
                playerCount: 0,
                maxPlayers: MAX_PLAYERS_PER_ROOM
            });
        }
    }
    ws.send(JSON.stringify({ type: 'officialRooms', rooms: officialRooms }));
}

function handleJoinOfficialRoom(ws, message) {
    let bestRoom = null;
    let minPlayers = Infinity;
    for (let i = 1; i <= OFFICIAL_ROOM_COUNT; i++) {
        const roomId = '官方-' + i;
        const count = rooms.has(roomId) ? rooms.get(roomId).size : 0;
        if (count < minPlayers && count < MAX_PLAYERS_PER_ROOM) {
            minPlayers = count;
            bestRoom = roomId;
        }
    }

    if (bestRoom) {
        handleJoin(ws, { ...message, roomId: bestRoom });
        ws.send(JSON.stringify({ type: 'officialRoomJoined', roomId: bestRoom }));
    } else {
        ws.send(JSON.stringify({ type: 'error', message: '所有官方房间已满' }));
    }
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

function handlePvpHit(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const room = rooms.get(ws.roomId);
    const targetPlayer = room.get(message.targetId);
    
    if (targetPlayer) {
        targetPlayer.health -= message.damage;
        
        broadcastToRoom(ws.roomId, {
            type: 'pvpHit',
            targetId: message.targetId,
            damage: message.damage
        }, ws);
    }
}

function handlePlayerKilled(ws, message) {
    if (!ws.roomId || !rooms.has(ws.roomId)) return;
    
    const room = rooms.get(ws.roomId);
    const victim = room.get(message.victimId);
    
    if (victim) {
        victim.health = 100;
        victim.x = Math.random() * (MAP_WIDTH - 400) + 200;
        victim.y = Math.random() * (MAP_HEIGHT - 400) + 200;
        
        if (message.victimId === ws.userId) {
            spawnLoot(ws.roomId, victim.x, victim.y, 'exp', 25);
        }
        
        broadcastToRoom(ws.roomId, {
            type: 'playerRespawn',
            userId: message.victimId,
            x: victim.x,
            y: victim.y,
            health: victim.health
        });
    }
}

function handleDisconnect(ws) {
    if (ws.roomId && rooms.has(ws.roomId)) {
        const room = rooms.get(ws.roomId);
        const player = room.get(ws.userId);
        
        if (player) {
            const gs = gameStates.get(ws.roomId);
            if (gs) {
                for (const vehicle of gs.vehicles) {
                    if (vehicle.occupantId === ws.userId) {
                        vehicle.occupied = false;
                        vehicle.occupantId = null;
                    }
                }
            }
            
            broadcastToRoom(ws.roomId, {
                type: 'playerLeave',
                userId: ws.userId,
                name: player.name
            });
            
            room.delete(ws.userId);
            
            if (room.size === 0) {
                stopGameLoop(ws.roomId);
                const isOfficial = ws.roomId.startsWith('官方-');
                if (!isOfficial) {
                    rooms.delete(ws.roomId);
                    console.log(`房间 ${ws.roomId} 已关闭`);
                } else {
                    console.log(`官方房间 ${ws.roomId} 已空闲`);
                }
            } else {
                sendPlayersList(ws.roomId);
            }
        }
    }
}

process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('未处理的Promise拒绝:', error);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n🎮 几何枪战服务器已启动！');
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log('\n📋 游戏说明:');
    console.log('• WASD/方向键 - 移动');
    console.log('• 鼠标 - 瞄准');
    console.log('• 左键 - 射击');
    console.log('• 输入房间ID与朋友联机！\n');
});