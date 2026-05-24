class Network {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.roomId = null;
        this.userId = null;
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
                console.log(data.name + ' ' + __('joined'));
                window.game.addKillFeed(data.name, __('joined'));
                break;
                
            case 'playerLeave':
                console.log(data.name + ' ' + __('left'));
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
                window.game.addKillFeed(data.killerName, `${__('killText')} ${data.victimName}`);
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
                    window.game.player.health = data.health;
                } else {
                    const player = window.game.players.get(data.userId);
                    if (player) {
                        player.x = data.x;
                        player.y = data.y;
                        player.health = data.health;
                    }
                }
                break;
                
            case 'gameState':
                this.handleGameState(data);
                break;
                
            case 'lootCollected':
                this.handleLootCollected(data);
                break;
                
            case 'powerupCollected':
                this.handlePowerupCollected(data);
                break;
                
            case 'vehicleEntered':
                this.handleVehicleEntered(data);
                break;
                
            case 'vehicleLeft':
                this.handleVehicleLeft(data);
                break;
                
            case 'officialRooms':
                this.handleOfficialRooms(data);
                break;
                
            case 'officialRoomJoined':
                this.handleOfficialRoomJoined(data);
                break;
        }
    }
    
    handleOfficialRooms(data) {
        if (!data.rooms) return;
        
        const container = document.getElementById('official-rooms');
        if (!container) return;
        
        const items = container.querySelectorAll('.official-room-item');
        data.rooms.forEach((room, index) => {
            if (items[index]) {
                const dotsContainer = items[index].querySelector('.room-dots');
                const countEl = items[index].querySelector('.room-count');
                
                if (dotsContainer) {
                    let dotsHtml = '';
                    for (let i = 0; i < room.maxPlayers; i++) {
                        dotsHtml += `<span class="dot ${i < room.playerCount ? 'active' : 'inactive'}"></span>`;
                    }
                    dotsContainer.innerHTML = dotsHtml;
                }
                
                if (countEl) {
                    countEl.textContent = `${room.playerCount}/${room.maxPlayers}`;
                }
            }
        });
    }
    
    handleOfficialRoomJoined(data) {
        console.log('已加入官方房间:', data.roomId);
        
        const btn = document.getElementById('btn-official');
        if (btn) {
            btn.textContent = '🎮 快速匹配';
            btn.disabled = false;
        }
        
        if (window.game) {
            window.game._alreadyConnected = true;
            window.game.roomId = data.roomId;
            window.game.isMultiplayer = true;
            document.getElementById('room-display').textContent = data.roomId;
            window.game.startGame();
            if (window.game._pendingColor) {
                window.game.player.color = window.game._pendingColor;
                window.game._pendingColor = null;
            }
        }
    }
    
    handleGameState(data) {
        const game = window.game;
        if (!game) return;
        
        if (data.enemies) {
            game.enemies = data.enemies.filter(e => e.health > 0).map(e => ({
                id: e.id,
                x: e.x,
                y: e.y,
                radius: e.radius,
                health: e.health,
                maxHealth: e.maxHealth,
                color: e.color,
                angle: e.angle,
                hitFlash: e.hitFlash || 0,
                speed: 2
            }));
        }
        
        if (data.loots) {
            game.loots = data.loots.map(l => ({
                id: l.id,
                x: l.x,
                y: l.y,
                type: l.type,
                value: l.value,
                color: l.color,
                radius: 12,
                bobOffset: Math.random() * Math.PI * 2
            }));
        }
        
        if (data.powerups) {
            game.powerups = data.powerups.map(p => ({
                id: p.id,
                x: p.x,
                y: p.y,
                type: p.type,
                color: p.color,
                icon: p.icon,
                name: p.name,
                radius: 15,
                bobOffset: Math.random() * Math.PI * 2
            }));
        }
        
        if (data.vehicles) {
            game.vehicles = data.vehicles.map(v => ({
                id: v.id,
                x: v.x,
                y: v.y,
                type: v.type,
                name: v.name,
                color: v.color,
                radius: v.radius,
                health: v.health,
                maxHealth: v.maxHealth,
                angle: v.angle,
                occupied: v.occupied,
                occupantId: v.occupantId,
                speed: v.speed,
                fireRate: v.type === 'tank' ? 800 : v.type === 'armored' ? 600 : 400,
                damage: v.type === 'tank' ? 25 : v.type === 'armored' ? 20 : 15
            }));
        }
    }
    
    handleLootCollected(data) {
        const game = window.game;
        if (!game) return;
        
        const idx = game.loots.findIndex(l => l.id === data.lootId);
        if (idx !== -1) {
            const loot = game.loots[idx];
            game.lootPickupAnim = {
                startX: loot.x,
                startY: loot.y,
                endX: game.player.x,
                endY: game.player.y,
                color: loot.color,
                progress: 0
            };
            game.loots.splice(idx, 1);
        }
        
        if (data.userId === this.userId && data.lootType === 'health') {
            game.player.health = Math.min(game.player.maxHealth, game.player.health + data.effectValue);
        }
        if (data.userId === this.userId && data.lootType === 'exp') {
            game.player.exp += data.effectValue;
            game.checkLevelUp();
        }
        if (data.userId === this.userId && data.lootType === 'ammo') {
            game.player.ammo += data.effectValue;
        }
        
        if (game.sound) game.sound.playPickup();
        game.addKillFeed(__('system'), `${__('pickedUp')} ${data.lootType}`);
    }
    
    handlePowerupCollected(data) {
        const game = window.game;
        if (!game) return;
        
        const idx = game.powerups.findIndex(p => p.id === data.powerupId);
        if (idx !== -1) {
            game.powerups.splice(idx, 1);
        }
        
        if (data.userId === this.userId) {
            switch(data.powerupType) {
                case 'health':
                    game.player.health = Math.min(game.player.maxHealth, game.player.health + data.effectValue);
                    break;
                case 'shield':
                    game.player.shield = data.effectValue;
                    break;
                case 'speed':
                    game.player.speedBoost = data.effectValue;
                    game.player.speed = 5 + data.effectValue;
                    setTimeout(() => {
                        game.player.speedBoost = 0;
                        game.player.speed = 5;
                    }, 8000);
                    break;
                case 'damage':
                    game.player.damageBoost = data.effectValue;
                    setTimeout(() => {
                        game.player.damageBoost = 1;
                    }, 8000);
                    break;
            }
        }
        
        if (game.sound) game.sound.playPickup();
    }
    
    handleVehicleEntered(data) {
        const game = window.game;
        if (!game) return;
        
        const vehicle = game.vehicles.find(v => v.id === data.vehicleId);
        if (vehicle) {
            vehicle.occupied = true;
        }
        
        if (data.userId === this.userId) {
            game.currentVehicle = vehicle || true;
            window.game.addKillFeed(__('system'), __('enteredVehicle'));
        }
    }
    
    handleVehicleLeft(data) {
        const game = window.game;
        if (!game) return;
        
        const vehicle = game.vehicles.find(v => v.id === data.vehicleId);
        if (vehicle) {
            vehicle.occupied = false;
        }
        
        if (data.userId === this.userId) {
            game.currentVehicle = null;
            window.game.addKillFeed(__('system'), __('leftVehicle'));
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
            owner: data.userId || 'other',
            damage: 20,
            angle: Math.atan2(data.vy, data.vx),
            rotSpeed: 0.3
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
                kills: window.game.kills,
                inVehicle: !!window.game.currentVehicle
            });
        }, 50);
        
        this.heartbeatInterval = setInterval(() => {
            if (this.connected) {
                this.send({ type: 'ping' });
            }
        }, 4 * 60 * 1000);
    }
    
    sendShoot(bullet, weapon) {
        if (!this.connected) return;
        
        this.send({
            type: 'shoot',
            x: bullet.x,
            y: bullet.y,
            vx: bullet.vx,
            vy: bullet.vy,
            color: bullet.color,
            damage: weapon ? weapon.damage : 15,
            bulletRadius: weapon ? (weapon.bulletRadius || 5) : 5
        });
    }
    
    sendVehicleShoot(bullet, weapon) {
        if (!this.connected) return;
        
        this.send({
            type: 'vehicleShoot',
            x: bullet.x,
            y: bullet.y,
            vx: bullet.vx,
            vy: bullet.vy,
            color: bullet.color,
            damage: bullet.damage || 25,
            bulletRadius: bullet.radius || 8
        });
    }
    
    sendCollectLoot(lootId) {
        if (!this.connected) return;
        this.send({
            type: 'collectLoot',
            lootId: lootId
        });
    }
    
    sendCollectPowerup(powerupId) {
        if (!this.connected) return;
        this.send({
            type: 'collectPowerup',
            powerupId: powerupId
        });
    }
    
    sendEnterVehicle(vehicleId) {
        if (!this.connected) return;
        this.send({
            type: 'enterVehicle',
            vehicleId: vehicleId
        });
    }
    
    sendLeaveVehicle(vehicleId) {
        if (!this.connected) return;
        this.send({
            type: 'leaveVehicle',
            vehicleId: vehicleId
        });
    }
    
    sendChat(message) {
        if (!this.connected) return;
        
        this.send({
            type: 'chat',
            message: message
        });
    }
    
    requestOfficialRooms() {
        if (!this.connected) return;
        this.send({ type: 'getOfficialRooms' });
    }
    
    joinOfficialRoom(name, color) {
        if (!this.connected) return;
        this.userId = name + '_' + Date.now();
        this.send({
            type: 'joinOfficialRoom',
            userId: this.userId,
            name: name,
            color: color
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