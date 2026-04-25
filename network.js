class Network {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.roomId = null;
        this.userId = null;
        // 动态生成WebSocket连接地址
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.serverUrl = `${protocol}//${window.location.host}`;
        this.lastUpdate = 0;
        this.heartbeatInterval = null;
    }
    
    connectAndJoin(roomId, name, color) {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(this.serverUrl);
                this.roomId = roomId;
                this.userId = name + '_' + Date.now();
                
                this.socket.onopen = () => {
                    this.connected = true;
                    console.log('已连接到服务器');
                    
                    this.send({
                        type: 'join',
                        roomId: roomId,
                        userId: this.userId,
                        name: name,
                        color: color
                    });
                    
                    this.startUpdateLoop();
                    resolve();
                };
                
                this.socket.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };
                
                this.socket.onclose = () => {
                    this.connected = false;
                    console.log('与服务器断开连接');
                    if (this.heartbeatInterval) {
                        clearInterval(this.heartbeatInterval);
                    }
                };
                
                this.socket.onerror = (error) => {
                    console.error('WebSocket错误:', error);
                    reject(error);
                };
                
            } catch (error) {
                console.error('连接失败:', error);
                reject(error);
            }
        });
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'players':
                this.updatePlayers(data.players);
                break;
                
            case 'playerJoin':
                console.log(data.name + ' 加入了游戏');
                window.game.addKillFeed(data.name, '加入了游戏');
                break;
                
            case 'playerLeave':
                console.log(data.name + ' 离开了游戏');
                window.game.players.delete(data.userId);
                break;
                
            case 'shoot':
                if (data.userId !== this.userId) {
                    this.receiveShoot(data);
                }
                break;
                
            case 'hit':
                if (data.targetId === this.userId) {
                    window.game.player.health -= data.damage;
                    if (window.game.player.health <= 0) {
                        window.game.gameOver();
                    }
                }
                break;
                
            case 'kill':
                window.game.addKillFeed(data.killerName, `击杀了 ${data.victimName}`);
                break;
                
            case 'chat':
                if (data.userId !== this.userId) {
                    window.game.addChatMessage(data.name, data.message, false);
                }
                break;
                
            case 'pvpHit':
                if (data.targetId === this.userId) {
                    window.game.player.health -= data.damage;
                    if (window.game.player.health <= 0) {
                        window.game.player.health = window.game.player.maxHealth;
                        window.game.player.x = Math.random() * window.game.mapWidth;
                        window.game.player.y = Math.random() * window.game.mapHeight;
                    }
                }
                break;
                
            case 'playerRespawn':
                if (data.userId === this.userId) {
                    window.game.player.x = data.x;
                    window.game.player.y = data.y;
                    window.game.player.exp = data.exp;
                    window.game.player.health = data.health;
                } else {
                    const player = window.game.players.get(data.userId);
                    if (player) {
                        player.x = data.x;
                        player.y = data.y;
                        player.exp = data.exp;
                        player.health = data.health;
                    }
                }
                break;
        }
    }
    
    updatePlayers(players) {
        for (const [id, p] of Object.entries(players)) {
            if (id !== this.userId) {
                window.game.players.set(id, {
                    id: id,
                    name: p.name,
                    x: p.x,
                    y: p.y,
                    angle: p.angle,
                    radius: 20,
                    color: p.color,
                    health: p.health,
                    maxHealth: 100
                });
            }
        }
        
        for (const [id] of window.game.players) {
            if (!players[id]) {
                window.game.players.delete(id);
            }
        }
    }
    
    receiveShoot(data) {
        const bullet = {
            x: data.x,
            y: data.y,
            vx: data.vx,
            vy: data.vy,
            radius: 5,
            color: data.color,
            owner: data.userId,
            damage: 20
        };
        window.game.bullets.push(bullet);
        
        for (let i = 0; i < 5; i++) {
            const angle = Math.atan2(data.vy, data.vx);
            window.game.particles.push({
                x: data.x,
                y: data.y,
                vx: Math.cos(angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                vy: Math.sin(angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                radius: 2 + Math.random() * 2,
                color: data.color,
                life: 20
            });
        }
    }
    
    startUpdateLoop() {
        setInterval(() => {
            if (!this.connected || !window.game.player) return;
            
            this.send({
                type: 'update',
                x: window.game.player.x,
                y: window.game.player.y,
                angle: window.game.player.angle,
                health: window.game.player.health,
                kills: window.game.kills
            });
        }, 50);
        
        // 添加心跳机制，每4分钟发送一次心跳
        this.heartbeatInterval = setInterval(() => {
            if (this.connected) {
                this.send({ type: 'ping' });
            }
        }, 4 * 60 * 1000); // 4分钟
    }
    
    sendShoot(bullet) {
        if (!this.connected) return;
        
        this.send({
            type: 'shoot',
            x: bullet.x,
            y: bullet.y,
            vx: bullet.vx,
            vy: bullet.vy,
            color: bullet.color
        });
    }
    
    sendChat(message) {
        if (!this.connected) return;
        
        this.send({
            type: 'chat',
            message: message
        });
    }
    
    send(data) {
        if (this.socket && this.connected) {
            try {
                this.socket.send(JSON.stringify(data));
            } catch (e) {
                console.error('发送失败:', e);
            }
        }
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connected = false;
        }
    }
}

window.network = new Network();

const originalShoot = window.game.shoot.bind(window.game);
window.game.shoot = function() {
    originalShoot();
    if (window.network.connected) {
        const bullet = this.bullets[this.bullets.length - 1];
        window.network.sendShoot(bullet);
    }
};
