class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        
        this.player = null;
        this.players = new Map();
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.loots = [];
        
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        this.kills = 0;
        this.running = false;
        this.autoMode = false; // 挂机模式
        
        // 大地图系统
        this.mapWidth = 3000;
        this.mapHeight = 2000;
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraSpeed = 0.1; // 平滑相机
        this.targetCameraX = 0;
        this.targetCameraY = 0;
        
        // 设备检测
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 性能优化
        this.maxParticles = 150; // 最大粒子数
        this.maxEnemies = 6; // 最大敌人数量
        this.updateInterval = 50; // 更新间隔
        
        // 昼夜系统
        this.timeOfDay = 0; // 0-100, 0=中午, 100=午夜
        this.isNight = false;
        this.dayDuration = 180000; // 3分钟一个完整昼夜周期
        
        // 道具系统
        this.powerups = []; // 道具
        this.powerupTypes = [
            { type: 'health', name: '生命', color: '#2ecc71', effect: 30, icon: '+' },
            { type: 'shield', name: '护盾', color: '#3498db', effect: 50, icon: 'O' },
            { type: 'speed', name: '加速', color: '#f39c12', effect: 3, icon: '>' },
            { type: 'damage', name: '强化', color: '#e74c3c', effect: 2, icon: '!' }
        ];
        
        // 载具系统
        this.vehicles = []; // 载具
        this.vehicleTypes = [
            { type: 'tank', name: '坦克', radius: 40, speed: 2, damage: 40, color: '#27ae60', fireRate: 1000 },
            { type: 'armored', name: '装甲车', radius: 35, speed: 4, damage: 20, color: '#8e44ad', fireRate: 500 },
            { type: 'helicopter', name: '直升机', radius: 30, speed: 6, damage: 15, color: '#e67e22', fireRate: 300 }
        ];
        
        // RPG系统
        this.loots = []; // 掉落物
        this.lootTypes = [
            { type: 'health', name: '生命药水', color: '#e74c3c', effect: 30, chance: 0.4 },
            { type: 'ammo', name: '弹药箱', color: '#f39c12', effect: 15, chance: 0.5 },
            { type: 'exp', name: '经验球', color: '#9b59b6', effect: 25, chance: 0.7 },
            { type: 'speed', name: '速度药水', color: '#3498db', effect: 2, chance: 0.3 }
        ];
        
        // 纯色RPG配色
        this.colors = [
            '#c0392b', '#2980b9', '#27ae60', '#d35400',
            '#8e44ad', '#16a085', '#e67e22', '#2c3e50'
        ];
        
        // 地形元素（树木、石头、障碍物）
        this.terrainElements = [];
        for (let i = 0; i < 50; i++) {
            this.terrainElements.push({
                x: Math.random() * 3000,
                y: Math.random() * 2000,
                size: 20 + Math.random() * 50,
                type: Math.random() > 0.6 ? 'tree' : (Math.random() > 0.5 ? 'rock' : 'obstacle')
            });
        }
        
        // 区域地形生成
        this.regions = this.generateRegions();
        
        // 武器库
        this.weapons = [
            {
                name: '手枪',
                icon: '🔫',
                damage: 20,
                shootCooldown: 300,
                maxAmmo: 12,
                reloadTime: 1000,
                bulletSpeed: 14,
                bulletCount: 1,
                spread: 0
            },
            {
                name: '冲锋枪',
                icon: 'smg',
                damage: 12,
                shootCooldown: 80,
                maxAmmo: 30,
                reloadTime: 1500,
                bulletSpeed: 16,
                bulletCount: 1,
                spread: 0.1
            },
            {
                name: '霰弹枪',
                icon: 'shotgun',
                damage: 15,
                shootCooldown: 600,
                maxAmmo: 6,
                reloadTime: 2000,
                bulletSpeed: 12,
                bulletCount: 5,
                spread: 0.3
            },
            {
                name: '狙击枪',
                icon: 'sniper',
                damage: 80,
                shootCooldown: 1200,
                maxAmmo: 5,
                reloadTime: 2500,
                bulletSpeed: 25,
                bulletCount: 1,
                spread: 0,
                bulletRadius: 8
            },
            {
                name: '步枪',
                icon: 'rifle',
                damage: 30,
                shootCooldown: 200,
                maxAmmo: 25,
                reloadTime: 1500,
                bulletSpeed: 18,
                bulletCount: 1,
                spread: 0.05
            },
            {
                name: '机枪',
                icon: 'machinegun',
                damage: 8,
                shootCooldown: 50,
                maxAmmo: 60,
                reloadTime: 3000,
                bulletSpeed: 20,
                bulletCount: 1,
                spread: 0.15
            },
            {
                name: '火箭筒',
                icon: 'rocket',
                damage: 100,
                shootCooldown: 1500,
                maxAmmo: 3,
                reloadTime: 3000,
                bulletSpeed: 10,
                bulletCount: 1,
                spread: 0,
                bulletRadius: 12
            }
        ];
        
        // 多人互动
         this.playerEffects = []; // 玩家特效
         this.init();
     }
     
     generateRegions() {
         const regions = [];
         const regionSize = 500;
         
         for (let x = 0; x < this.mapWidth; x += regionSize) {
             for (let y = 0; y < this.mapHeight; y += regionSize) {
                 const type = Math.random() > 0.7 ? 'forest' : (Math.random() > 0.5 ? 'rocks' : 'open');
                 regions.push({
                     x: x,
                     y: y,
                     width: regionSize,
                     height: regionSize,
                     type: type
                 });
             }
         }
         return regions;
     }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
            // 按 F 键切换挂机模式
            if (e.key.toLowerCase() === 'f') {
                this.toggleAutoMode();
            }
            // 按 1-4 切换武器
            if (e.key >= '1' && e.key <= '4') {
                this.switchWeapon(parseInt(e.key) - 1);
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', () => this.mouseDown = true);
        this.canvas.addEventListener('mouseup', () => this.mouseDown = false);
        
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-quit').addEventListener('click', () => this.quitGame());
        document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
        
        // 添加武器槽点击事件
        for (let i = 0; i < this.weapons.length; i++) {
            const slot = document.getElementById('weapon-' + i);
            if (slot) {
                slot.addEventListener('click', () => this.switchWeapon(i));
            }
        }
        
        // 聊天功能
        this.setupChat();
        
        // 触屏控制
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        // 只在移动设备上启用触摸控制
        if (!this.isMobile) {
            const touchControls = document.getElementById('touch-controls');
            if (touchControls) {
                touchControls.style.display = 'none';
            }
            return;
        }
        
        const joystick = document.getElementById('joystick');
        const joystickKnob = document.getElementById('joystick-knob');
        const touchShoot = document.getElementById('touch-shoot');
        const touchF = document.getElementById('touch-f');
        
        if (!joystick || !joystickKnob) return;
        
        let isJoystickActive = false;
        let joystickStartX = 0;
        let joystickStartY = 0;
        
        // 摇杆触摸开始
        joystick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isJoystickActive = true;
            const rect = joystick.getBoundingClientRect();
            joystickStartX = rect.left + rect.width / 2;
            joystickStartY = rect.top + rect.height / 2;
        });
        
        // 摇杆触摸移动
        document.addEventListener('touchmove', (e) => {
            if (!isJoystickActive) return;
            e.preventDefault();
            const touch = e.touches[0];
            const dx = touch.clientX - joystickStartX;
            const dy = touch.clientY - joystickStartY;
            const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 30);
            
            if (distance > 5) {
                const angle = Math.atan2(dy, dx);
                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;
                
                joystickKnob.style.transform = `translate(${moveX}px, ${moveY}px)`;
                
                // 模拟键盘输入
                if (Math.abs(moveX) > Math.abs(moveY)) {
                    if (moveX > 10) {
                        this.keys['d'] = true;
                        this.keys['a'] = false;
                    } else if (moveX < -10) {
                        this.keys['a'] = true;
                        this.keys['d'] = false;
                    } else {
                        this.keys['a'] = false;
                        this.keys['d'] = false;
                    }
                } else {
                    if (moveY > 10) {
                        this.keys['s'] = true;
                        this.keys['w'] = false;
                    } else if (moveY < -10) {
                        this.keys['w'] = true;
                        this.keys['s'] = false;
                    } else {
                        this.keys['w'] = false;
                        this.keys['s'] = false;
                    }
                }
            } else {
                joystickKnob.style.transform = 'translate(0, 0)';
                this.keys['w'] = false;
                this.keys['s'] = false;
                this.keys['a'] = false;
                this.keys['d'] = false;
            }
        });
        
        // 摇杆触摸结束
        document.addEventListener('touchend', (e) => {
            if (isJoystickActive) {
                isJoystickActive = false;
                joystickKnob.style.transform = 'translate(0, 0)';
                this.keys['w'] = false;
                this.keys['s'] = false;
                this.keys['a'] = false;
                this.keys['d'] = false;
            }
        });
        
        // 射击按钮
        if (touchShoot) {
            touchShoot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.mouseDown = true;
            });
            touchShoot.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.mouseDown = false;
            });
        }
        
        // F按钮
        if (touchF) {
            touchF.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggleAutoMode();
            });
        }
        
        // 双击屏幕射击
        let lastTap = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            const now = Date.now();
            if (now - lastTap < 300) {
                this.mouseDown = true;
            }
            lastTap = now;
            
            // 触屏瞄准
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            this.mouseDown = false;
        });
        
        // 显示触屏控制
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) {
            touchControls.style.display = 'flex';
            touchControls.style.justifyContent = 'space-between';
            touchControls.style.padding = '0 20px';
        }
    }
    
    setupChat() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                this.sendChat(chatInput.value.trim());
                chatInput.value = '';
            }
        });
    }
    
    sendChat(message) {
        if (!this.player) return;
        
        this.addChatMessage(this.player.name, message, true);
        
        if (window.network && window.network.connected) {
            window.network.sendChat(message);
        }
    }
    
    addChatMessage(sender, message, isSelf = false) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSelf ? 'self' : 'other'}`;
        messageDiv.innerHTML = `<span class="sender">${sender}:</span>${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 限制消息数量
        if (chatMessages.children.length > 50) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    startGame() {
        const name = document.getElementById('player-name').value.trim() || 'Player';
        const roomId = document.getElementById('room-id').value.trim();
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        
        this.currentWeaponIndex = 0; // 默认武器是手枪
        const weapon = this.weapons[this.currentWeaponIndex];
        
        this.player = {
            id: 'self',
            name: name,
            x: this.mapWidth / 2, // 地图中央
            y: this.mapHeight / 2, // 地图中央
            radius: 20,
            angle: 0,
            health: 100,
            maxHealth: 100,
            speed: 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            ammo: weapon.maxAmmo,
            maxAmmo: weapon.maxAmmo,
            reloadTime: 0,
            lastShot: 0,
            shootCooldown: weapon.shootCooldown,
            level: 1,
            exp: 0,
            expToLevel: 100,
            speedBoost: 0
        };
        
        // 初始化相机位置
        this.cameraX = this.player.x - this.width / 2;
        this.cameraY = this.player.y - this.height / 2;
        
        this.kills = 0;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.loots = [];
        this.players.clear();
        this.running = true;
        
        document.getElementById('room-display').textContent = roomId || '单人模式';
        
        if (roomId) {
            window.network.connectAndJoin(roomId, name, this.player.color);
        }
        
        this.spawnEnemies();
        this.gameLoop();
    }
    
    spawnEnemies() {
        setInterval(() => {
            if (!this.running) return;
            // 减少最大敌人数量以提升性能
            if (this.enemies.length < 8) {
                const side = Math.floor(Math.random() * 4);
                let x, y;
                
                switch(side) {
                    case 0: x = -30; y = Math.random() * this.mapHeight; break;
                    case 1: x = this.mapWidth + 30; y = Math.random() * this.mapHeight; break;
                    case 2: x = Math.random() * this.mapWidth; y = -30; break;
                    case 3: x = Math.random() * this.mapWidth; y = this.mapHeight + 30; break;
                }
                
                this.enemies.push({
                    x: x,
                    y: y,
                    radius: 15 + Math.random() * 15,
                    speed: 1.5 + Math.random() * 2,
                    health: 30 + Math.random() * 30,
                    color: '#ff4757',
                    angle: 0
                });
            }
        }, 2500); // 增加生成间隔
    }
    
    gameLoop() {
        if (!this.running) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (!this.player) return;
        
        this.updateDayNight();
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateParticles();
        this.updateLoots();
        this.updatePowerups();
        this.updateVehicles();
        this.updatePlayerEffects();
        this.updateUI();
    }
    
    updateDayNight() {
        this.timeOfDay = (this.timeOfDay + 100 / (this.dayDuration / this.updateInterval)) % 100;
        this.isNight = this.timeOfDay > 50;
    }
    
    updatePlayerEffects() {
        // 更新玩家特效
        for (let i = this.playerEffects.length - 1; i >= 0; i--) {
            const effect = this.playerEffects[i];
            effect.life--;
            effect.x += effect.vx;
            effect.y += effect.vy;
            
            if (effect.life <= 0) {
                this.playerEffects.splice(i, 1);
            }
        }
        
        // 其他玩家移动同步时添加特效
        this.players.forEach((p) => {
            if (Math.random() < 0.1) {
                this.playerEffects.push({
                    x: p.x + (Math.random() - 0.5) * 20,
                    y: p.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    color: p.color,
                    life: 15,
                    radius: 3
                });
            }
        });
    }
    
    drawPlayerEffects() {
        for (const effect of this.playerEffects) {
            this.ctx.globalAlpha = effect.life / 15;
            this.ctx.fillStyle = effect.color;
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    updatePlayer() {
        if (this.autoMode) {
            this.autoUpdatePlayer();
        } else {
            let dx = 0, dy = 0;
            if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
            if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
            if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
            if (this.keys['d'] || this.keys['arrowright']) dx += 1;
            
            if (dx !== 0 || dy !== 0) {
                const len = Math.sqrt(dx * dx + dy * dy);
                dx /= len;
                dy /= len;
                
                this.player.x += dx * this.player.speed;
                this.player.y += dy * this.player.speed;
            }
            
            // 计算鼠标在世界坐标中的位置
            const worldMouseX = this.mouseX + this.cameraX;
            const worldMouseY = this.mouseY + this.cameraY;
            // 正确计算角度
            this.player.angle = Math.atan2(worldMouseY - this.player.y, worldMouseX - this.player.x);
            
            if (this.mouseDown && Date.now() - this.player.lastShot > this.player.shootCooldown) {
                if (this.player.ammo > 0) {
                    this.shoot();
                    this.player.lastShot = Date.now();
                    this.player.ammo--;
                }
            }
        }
        
        // 大地图边界限制
        this.player.x = Math.max(this.player.radius, Math.min(this.mapWidth - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.mapHeight - this.player.radius, this.player.y));
        
        // 相机跟随玩家（平滑）
        this.targetCameraX = this.player.x - this.width / 2;
        this.targetCameraY = this.player.y - this.height / 2;
        
        // 相机边界限制
        this.targetCameraX = Math.max(0, Math.min(this.mapWidth - this.width, this.targetCameraX));
        this.targetCameraY = Math.max(0, Math.min(this.mapHeight - this.height, this.targetCameraY));
        
        // 平滑过渡
        this.cameraX += (this.targetCameraX - this.cameraX) * this.cameraSpeed;
        this.cameraY += (this.targetCameraY - this.cameraY) * this.cameraSpeed;
        
        if (this.player.ammo === 0 && this.player.reloadTime === 0) {
            const weapon = this.weapons[this.currentWeaponIndex];
            this.player.reloadTime = Date.now();
        }
        
        if (this.player.reloadTime > 0) {
            const weapon = this.weapons[this.currentWeaponIndex];
            if (Date.now() - this.player.reloadTime > weapon.reloadTime) {
                this.player.ammo = weapon.maxAmmo;
                this.player.maxAmmo = weapon.maxAmmo;
                this.player.reloadTime = 0;
            }
        }
    }
    
    switchWeapon(index) {
        if (index >= 0 && index < this.weapons.length) {
            this.currentWeaponIndex = index;
            const weapon = this.weapons[index];
            this.player.shootCooldown = weapon.shootCooldown;
            this.player.ammo = weapon.maxAmmo;
            this.player.maxAmmo = weapon.maxAmmo;
            this.player.reloadTime = 0;
            this.addKillFeed('系统', `切换到 ${weapon.name}`);

            // 更新武器栏UI
            if (window.SpriteGenerator) {
                if (!this.spriteGen) {
                    this.spriteGen = new SpriteGenerator();
                }
                for (let i = 0; i < this.weapons.length; i++) {
                    const slot = document.getElementById('weapon-' + i);
                    if (slot) {
                        slot.innerHTML = (i + 1);
                        slot.style.backgroundImage = 'none';

                        const weaponType = this.weapons[i].icon;
                        const spriteCanvas = this.spriteGen.generateWeapon(weaponType);
                        if (spriteCanvas) {
                            slot.style.backgroundImage = `url(${spriteCanvas.toDataURL()})`;
                            slot.style.backgroundSize = '60%';
                        }

                        if (i === this.currentWeaponIndex) {
                            slot.classList.add('active');
                        } else {
                            slot.classList.remove('active');
                        }
                    }
                }
            }
        }
    }
    
    spawnLoot(x, y, type, value) {
        this.loots.push({
            x: x,
            y: y,
            type: type,
            value: value,
            radius: 12,
            bobOffset: Math.random() * Math.PI * 2
        });
    }
    
    updateLoots() {
        for (let i = this.loots.length - 1; i >= 0; i--) {
            const loot = this.loots[i];
            loot.bobOffset += 0.1;
            
            // 检测玩家是否捡起
            const dist = Math.hypot(this.player.x - loot.x, this.player.y - loot.y);
            if (dist < this.player.radius + loot.radius + 20) {
                this.collectLoot(loot);
                this.loots.splice(i, 1);
            }
        }
    }
    
    collectLoot(loot) {
        switch(loot.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + loot.value);
                this.addKillFeed('系统', `拾取了 ${loot.value} 生命值`);
                break;
            case 'ammo':
                this.player.ammo += loot.value;
                this.addKillFeed('系统', `拾取了 ${loot.value} 发弹药`);
                break;
            case 'exp':
                this.player.exp += loot.value;
                this.addKillFeed('系统', `拾取了 ${loot.value} 经验`);
                this.checkLevelUp();
                break;
            case 'speed':
                this.player.speedBoost = loot.value;
                this.player.speed = 5 + loot.value;
                this.addKillFeed('系统', `拾取了速度药水`);
                setTimeout(() => {
                    this.player.speedBoost = 0;
                    this.player.speed = 5;
                }, 5000);
                break;
        }
        
        // 收集粒子效果
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: loot.x,
                y: loot.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                radius: 3,
                color: loot.type === 'exp' ? '#9b59b6' : '#f39c12',
                life: 15
            });
        }
    }
    
    checkLevelUp() {
        while (this.player.exp >= this.player.expToLevel) {
            this.player.exp -= this.player.expToLevel;
            this.player.level++;
            this.player.expToLevel = Math.floor(this.player.expToLevel * 1.5);
            this.player.maxHealth += 10;
            this.player.health = this.player.maxHealth;
            this.player.speed += 0.5;
            this.addKillFeed('系统', `升级了！当前等级: ${this.player.level}`);
        }
    }
    
    drawLoots() {
        for (const loot of this.loots) {
            const bob = Math.sin(loot.bobOffset) * 3;
            this.ctx.save();
            this.ctx.translate(loot.x, loot.y + bob);
            
            // 发光效果
            this.ctx.shadowColor = loot.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.fillStyle = loot.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, loot.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 图标
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            let icon = '';
            switch(loot.type) {
                case 'health': icon = '+'; break;
                case 'ammo': icon = '•'; break;
                case 'exp': icon = '★'; break;
                case 'speed': icon = '»'; break;
            }
            this.ctx.fillText(icon, 0, 0);
            
            this.ctx.restore();
        }
    }

    // 道具系统
    spawnPowerup(x, y) {
        const type = this.powerupTypes[Math.floor(Math.random() * this.powerupTypes.length)];
        this.powerups.push({
            x: x,
            y: y,
            ...type,
            radius: 15,
            bobOffset: Math.random() * Math.PI * 2
        });
    }

    updatePowerups() {
        // 定时生成道具
        if (this.powerups.length < 5 && Math.random() < 0.01) {
            this.spawnPowerup(
                Math.random() * (this.mapWidth - 200) + 100,
                Math.random() * (this.mapHeight - 200) + 100
            );
        }

        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.bobOffset += 0.08;

            const dist = Math.hypot(this.player.x - powerup.x, this.player.y - powerup.y);
            if (dist < this.player.radius + powerup.radius + 25) {
                this.collectPowerup(powerup);
                this.powerups.splice(i, 1);
            }
        }
    }

    collectPowerup(powerup) {
        switch(powerup.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + powerup.effect);
                this.addKillFeed('系统', `拾取了 ${powerup.name}`);
                break;
            case 'shield':
                this.player.shield = powerup.effect;
                this.addKillFeed('系统', `获得 ${powerup.effect} 护盾`);
                break;
            case 'speed':
                this.player.speedBoost = powerup.effect;
                this.player.speed = 5 + powerup.effect;
                this.addKillFeed('系统', `获得 ${powerup.name} 效果`);
                setTimeout(() => {
                    this.player.speedBoost = 0;
                    this.player.speed = 5;
                }, 8000);
                break;
            case 'damage':
                this.player.damageBoost = powerup.effect;
                this.addKillFeed('系统', `获得 ${powerup.name} 强化`);
                setTimeout(() => {
                    this.player.damageBoost = 1;
                }, 8000);
                break;
        }

        // 收集粒子效果
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x: powerup.x,
                y: powerup.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                radius: 3,
                color: powerup.color,
                life: 20
            });
        }
    }

    drawPowerups() {
        for (const powerup of this.powerups) {
            const bob = Math.sin(powerup.bobOffset) * 4;
            this.ctx.save();
            this.ctx.translate(powerup.x, powerup.y + bob);

            // 发光效果
            this.ctx.shadowColor = powerup.color;
            this.ctx.shadowBlur = 15;

            this.ctx.fillStyle = powerup.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // 图标
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(powerup.icon, 0, 0);

            this.ctx.restore();
        }
    }

    // 载具系统
    spawnVehicle() {
        const type = this.vehicleTypes[Math.floor(Math.random() * this.vehicleTypes.length)];
        this.vehicles.push({
            x: Math.random() * (this.mapWidth - 400) + 200,
            y: Math.random() * (this.mapHeight - 400) + 200,
            ...type,
            angle: Math.random() * Math.PI * 2,
            health: 200,
            maxHealth: 200,
            lastFire: 0,
            occupied: false
        });
    }

    updateVehicles() {
        // 定时生成载具
        if (this.vehicles.length < 3 && Math.random() < 0.002) {
            this.spawnVehicle();
        }

        for (const vehicle of this.vehicles) {
            if (vehicle.occupied) continue;

            // 载具寻找敌人
            let nearestEnemy = null;
            let nearestDist = Infinity;

            for (const enemy of this.enemies) {
                const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestEnemy = enemy;
                }
            }

            if (nearestEnemy && nearestDist < 400) {
                // 面向敌人
                vehicle.angle = Math.atan2(nearestEnemy.y - vehicle.y, nearestEnemy.x - vehicle.x);

                // 移动向敌人
                if (nearestDist > 200) {
                    vehicle.x += Math.cos(vehicle.angle) * vehicle.speed;
                    vehicle.y += Math.sin(vehicle.angle) * vehicle.speed;
                }

                // 自动射击
                if (Date.now() - vehicle.lastFire > vehicle.fireRate) {
                    this.bullets.push({
                        x: vehicle.x + Math.cos(vehicle.angle) * vehicle.radius,
                        y: vehicle.y + Math.sin(vehicle.angle) * vehicle.radius,
                        vx: Math.cos(vehicle.angle) * 12,
                        vy: Math.sin(vehicle.angle) * 12,
                        radius: 8,
                        color: vehicle.color,
                        owner: 'vehicle',
                        damage: vehicle.damage
                    });
                    vehicle.lastFire = Date.now();
                }
            }
        }
    }

    drawVehicles() {
        for (const vehicle of this.vehicles) {
            this.ctx.save();
            this.ctx.translate(vehicle.x, vehicle.y);
            this.ctx.rotate(vehicle.angle);

            // 发光效果
            this.ctx.shadowColor = vehicle.color;
            this.ctx.shadowBlur = 20;

            if (vehicle.type === 'tank') {
                // 坦克身体
                this.ctx.fillStyle = vehicle.color;
                this.ctx.fillRect(-vehicle.radius, -vehicle.radius * 0.6, vehicle.radius * 2, vehicle.radius * 1.2);
                // 炮管
                this.ctx.fillStyle = '#1a1a1a';
                this.ctx.fillRect(0, -4, vehicle.radius * 1.5, 8);
            } else if (vehicle.type === 'armored') {
                // 装甲车身体
                this.ctx.fillStyle = vehicle.color;
                this.ctx.beginPath();
                this.ctx.moveTo(-vehicle.radius, -vehicle.radius * 0.5);
                this.ctx.lineTo(vehicle.radius, 0);
                this.ctx.lineTo(-vehicle.radius, vehicle.radius * 0.5);
                this.ctx.closePath();
                this.ctx.fill();
            } else if (vehicle.type === 'helicopter') {
                // 直升机
                this.ctx.fillStyle = vehicle.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, vehicle.radius * 0.7, 0, Math.PI * 2);
                this.ctx.fill();
                // 螺旋桨
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(-vehicle.radius * 1.2, -3, vehicle.radius * 2.4, 6);
            }

            this.ctx.shadowBlur = 0;

            // 载具血条
            if (vehicle.health < vehicle.maxHealth) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(-vehicle.radius, vehicle.radius + 8, vehicle.radius * 2, 6);
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(-vehicle.radius, vehicle.radius + 8, (vehicle.health / vehicle.maxHealth) * vehicle.radius * 2, 6);
            }

            // 载具名称
            this.ctx.rotate(-vehicle.angle);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(vehicle.name, 0, -vehicle.radius - 12);

            this.ctx.restore();
        }
    }

    shoot() {
        const weapon = this.weapons[this.currentWeaponIndex];
        
        for (let i = 0; i < weapon.bulletCount; i++) {
            // 添加散射
            let angle = this.player.angle;
            if (weapon.spread > 0) {
                angle += (Math.random() - 0.5) * weapon.spread;
            }
            
            const bullet = {
                x: this.player.x + Math.cos(angle) * this.player.radius,
                y: this.player.y + Math.sin(angle) * this.player.radius,
                vx: Math.cos(angle) * weapon.bulletSpeed,
                vy: Math.sin(angle) * weapon.bulletSpeed,
                radius: weapon.bulletRadius || 5,
                color: this.player.color,
                owner: this.player.id,
                damage: weapon.damage
            };
            
            this.bullets.push(bullet);
        }
        
        // 射击粒子特效（性能优化）
        if (this.particles.length < this.maxParticles) {
            for (let i = 0; i < 3; i++) { // 减少粒子数量
                this.particles.push({
                    x: this.player.x + Math.cos(this.player.angle) * this.player.radius,
                    y: this.player.y + Math.sin(this.player.angle) * this.player.radius,
                    vx: Math.cos(this.player.angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                    vy: Math.sin(this.player.angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                    radius: 2 + Math.random() * 2,
                    color: this.player.color,
                    life: 15 // 减少生命周期
                });
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            if (bullet.x < -50 || bullet.x > this.mapWidth + 50 || 
                bullet.y < -50 || bullet.y > this.mapHeight + 50) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // 检测是否击中敌人
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

                if (dist < bullet.radius + enemy.radius) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(i, 1);

                    for (let k = 0; k < 5; k++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 2 + Math.random() * 3;
                        this.particles.push({
                            x: enemy.x,
                            y: enemy.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            radius: 2 + Math.random() * 2,
                            color: '#c0392b',
                            life: 15
                        });
                    }

                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.kills++;
                        this.addKillFeed(this.player.name, `击杀了 怪物`);

                        this.spawnLoot(enemy.x, enemy.y, 'exp', 25);

                        if (Math.random() < 0.3) {
                            const lootType = this.lootTypes[Math.floor(Math.random() * this.lootTypes.length)];
                            this.spawnLoot(
                                enemy.x + (Math.random() - 0.5) * 30,
                                enemy.y + (Math.random() - 0.5) * 30,
                                lootType.type,
                                lootType.effect
                            );
                        }

                        for (let k = 0; k < 8; k++) {
                            const angle = (Math.PI * 2 / 8) * k;
                            this.particles.push({
                                x: enemy.x,
                                y: enemy.y,
                                vx: Math.cos(angle) * 4,
                                vy: Math.sin(angle) * 4,
                                radius: 4,
                                color: '#c0392b',
                                life: 25
                            });
                        }
                    }
                    break;
                }
            }

            // 检测是否击中其他玩家（PVP）
            if (bullet.owner === this.player.id) {
                for (const [id, otherPlayer] of this.players) {
                    const dist = Math.hypot(bullet.x - otherPlayer.x, bullet.y - otherPlayer.y);
                    if (dist < bullet.radius + otherPlayer.radius) {
                        otherPlayer.health -= bullet.damage;
                        this.bullets.splice(i, 1);

                        if (otherPlayer.health <= 0) {
                            this.addKillFeed(this.player.name, `击杀了 ${otherPlayer.name}`);
                            this.kills++;

                            const expLost = Math.floor(otherPlayer.exp * 0.3);
                            if (expLost > 0) {
                                this.spawnLoot(otherPlayer.x, otherPlayer.y, 'exp', expLost);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    updateEnemies() {
        for (const enemy of this.enemies) {
            const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
            enemy.angle = angle;
            enemy.x += Math.cos(angle) * enemy.speed;
            enemy.y += Math.sin(angle) * enemy.speed;
            
            const dist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (dist < this.player.radius + enemy.radius) {
                this.player.health -= 0.5;
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateUI() {
        document.getElementById('health-fill').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        document.getElementById('ammo-count').textContent = this.player.ammo;
        document.getElementById('kill-count').textContent = this.kills;
        document.getElementById('level-count').textContent = this.player.level;
        document.getElementById('exp-fill').style.width = (this.player.exp / this.player.expToLevel * 100) + '%';
        
        // 更新昼夜显示
        const dayNightDisplay = document.getElementById('day-night-display');
        if (dayNightDisplay) {
            dayNightDisplay.textContent = this.isNight ? '夜间' : '白天';
        }
        
        // 更新挂机状态显示
        const autoDisplay = document.getElementById('auto-display');
        if (autoDisplay) {
            autoDisplay.textContent = this.autoMode ? '🤖 挂机中' : '✋ 手动';
            autoDisplay.style.color = this.autoMode ? '#43e97b' : '#fff';
        }
        
        // 更新武器栏
        if (window.SpriteGenerator) {
            if (!this.spriteGen) {
                this.spriteGen = new SpriteGenerator();
            }
            for (let i = 0; i < this.weapons.length; i++) {
                const slot = document.getElementById('weapon-' + i);
                if (slot) {
                    slot.innerHTML = (i + 1);
                    slot.style.backgroundImage = 'none';
                    slot.style.backgroundSize = 'contain';
                    slot.style.backgroundPosition = 'center';
                    slot.style.backgroundRepeat = 'no-repeat';

                    const weaponType = this.weapons[i].icon;
                    const spriteCanvas = this.spriteGen.generateWeapon(weaponType);
                    if (spriteCanvas) {
                        slot.style.backgroundImage = `url(${spriteCanvas.toDataURL()})`;
                        slot.style.backgroundSize = '60%';
                    }

                    if (i === this.currentWeaponIndex) {
                        slot.classList.add('active');
                    } else {
                        slot.classList.remove('active');
                    }
                }
            }
        }
        
        let playersHtml = '<h4>玩家</h4>';
        playersHtml += `<div class="player-item"><span>${this.player.name}</span><span>${this.kills}</span></div>`;
        
        this.players.forEach((p, id) => {
            playersHtml += `<div class="player-item"><span>${p.name}</span><span>${p.kills || 0}</span></div>`;
        });
        
        document.getElementById('players-list').innerHTML = playersHtml;
    }
    
    // 切换挂机模式
    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        this.addKillFeed('系统', this.autoMode ? '已开启挂机模式 (按F关闭)' : '已关闭挂机模式 (按F开启)');
    }
    
    // 自动操作逻辑
    autoUpdatePlayer() {
        if (this.enemies.length === 0) return;
        
        // 找到最近的敌人
        let nearestEnemy = null;
        let nearestDist = Infinity;
        
        for (const enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        }
        
        if (nearestEnemy) {
            // 自动瞄准
            this.player.angle = Math.atan2(nearestEnemy.y - this.player.y, nearestEnemy.x - this.player.x);
            
            // 保持一定距离
            const idealDist = 200;
            if (nearestDist < idealDist - 30) {
                // 太近，后退
                const awayAngle = this.player.angle + Math.PI;
                this.player.x += Math.cos(awayAngle) * this.player.speed;
                this.player.y += Math.sin(awayAngle) * this.player.speed;
            } else if (nearestDist > idealDist + 30) {
                // 太远，前进
                this.player.x += Math.cos(this.player.angle) * this.player.speed;
                this.player.y += Math.sin(this.player.angle) * this.player.speed;
            }
            
            // 自动射击
            if (Date.now() - this.player.lastShot > this.player.shootCooldown) {
                if (this.player.ammo > 0) {
                    this.shoot();
                    this.player.lastShot = Date.now();
                    this.player.ammo--;
                }
            }
        }
    }
    
    addKillFeed(killer, victim) {
        const feed = document.getElementById('kill-feed');
        const item = document.createElement('div');
        item.className = 'kill-item';
        item.innerHTML = `<span style="color: #667eea">${killer}</span> ${victim}`;
        feed.appendChild(item);
        
        setTimeout(() => item.remove(), 5000);
    }
    
    render() {
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.save();
        this.ctx.translate(-this.cameraX, -this.cameraY);
        
        this.drawMap();
        this.drawGrid();
        this.drawLoots();
        this.drawParticles();
        this.drawPowerups();
        this.drawVehicles();
        this.drawPlayerEffects();
        this.drawBullets();
        this.drawEnemies();
        this.players.forEach(p => this.drawPlayer(p));
        this.drawPlayer(this.player, true);
        
        this.ctx.restore();
        
        this.drawCrosshair();
    }
    
    drawMap() {
        // 根据昼夜系统改变背景
        let bgColor;
        if (this.isNight) {
            const darkness = (this.timeOfDay - 50) / 50;
            const r = Math.floor(26 * (1 - darkness * 0.8));
            const g = Math.floor(61 * (1 - darkness * 0.8));
            const b = Math.floor(26 * (1 - darkness * 0.8));
            bgColor = `rgb(${r}, ${g}, ${b})`;
        } else {
            const brightness = 1 - (this.timeOfDay / 50) * 0.3;
            bgColor = `rgb(${Math.floor(26 * brightness)}, ${Math.floor(74 * brightness)}, ${Math.floor(26 * brightness)})`;
        }
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);
        
        // 绘制草地纹理
        if (!this.isNight) {
            this.ctx.fillStyle = '#1e4d1e';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * this.mapWidth;
                const y = Math.random() * this.mapHeight;
                this.ctx.fillRect(x, y, 3, 3);
            }
        }
        
        // 夜间星星
        if (this.isNight) {
            this.ctx.fillStyle = '#fff';
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * this.mapWidth;
                const y = Math.random() * this.mapHeight;
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
        
        // 绘制地图边界 - 石墙风格
        this.ctx.strokeStyle = '#4a4a4a';
        this.ctx.lineWidth = 12;
        this.ctx.strokeRect(0, 0, this.mapWidth, this.mapHeight);
        
        // 绘制地形元素 - 树木和石头
        for (const element of this.terrainElements) {
            if (element.type === 'tree') {
                // 树干
                this.ctx.fillStyle = '#5d4037';
                this.ctx.fillRect(element.x - 4, element.y - element.size * 0.3, 8, element.size * 0.8);
                // 树冠发光效果
                this.ctx.shadowColor = '#2e7d32';
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = '#2e7d32';
                this.ctx.beginPath();
                this.ctx.arc(element.x, element.y - element.size * 0.4, element.size * 0.8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else if (element.type === 'rock') {
                // 石头发光效果
                this.ctx.shadowColor = '#9e9e9e';
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = '#757575';
                this.ctx.beginPath();
                this.ctx.arc(element.x, element.y, element.size * 0.6, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else if (element.type === 'obstacle') {
                // 障碍物发光效果
                this.ctx.shadowColor = '#c0392b';
                this.ctx.shadowBlur = 20;
                this.ctx.fillStyle = '#c0392b';
                this.ctx.fillRect(element.x - element.size/2, element.y - element.size/2, element.size, element.size);
                this.ctx.shadowBlur = 0;
            }
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 100;
        for (let x = 0; x < this.mapWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.mapHeight);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.mapHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.mapWidth, y);
            this.ctx.stroke();
        }
    }
    
    drawPlayer(player, isSelf = false) {
        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);
        
        // 玩家发光效果
        this.ctx.shadowColor = player.color;
        this.ctx.shadowBlur = isSelf ? 25 : 20;
        
        this.ctx.fillStyle = player.color;
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * player.radius;
            const y = Math.sin(angle) * player.radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * player.radius * 0.6;
            const y = Math.sin(angle) * player.radius * 0.6;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // 绘制当前武器贴图（从玩家前方延伸，随角度旋转）
        if (isSelf && window.SpriteGenerator && this.spriteGen) {
            const weaponType = this.weapons[this.currentWeaponIndex].icon;
            const weaponSprite = this.spriteGen.generateWeapon(weaponType);
            if (weaponSprite) {
                this.ctx.save();
                // 玩家已经rotate过了，所以这里直接translate到前方位置
                this.ctx.translate(player.radius * 1.2, 0);
                // 武器保持原方向（因为context已经被player.angle旋转了）
                this.ctx.drawImage(weaponSprite, -10, -10, 20, 20);
                this.ctx.restore();
            }
        } else {
            this.ctx.fillStyle = isSelf ? '#fff' : '#aaa';
            this.ctx.fillRect(player.radius * 0.5, -4, player.radius * 0.8, 8);
        }

        this.ctx.restore();

        // 玩家名称和血条（在相机translate之外绘制，使用世界坐标）
        if (isSelf) {
            // 玩家血条
            if (player.health < player.maxHealth) {
                const barWidth = 50;
                const barHeight = 6;
                const barX = player.x - barWidth / 2;
                const barY = player.y + player.radius + 15;
                
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(barX, barY, barWidth, barHeight);
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.fillRect(barX, barY, barWidth * (player.health / player.maxHealth), barHeight);
            }
        } else {
            // 其他玩家名称
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(player.name, player.x, player.y - player.radius - 10);
            
            // 其他玩家等级
            if (player.level) {
                this.ctx.fillStyle = '#f39c12';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.fillText('Lv.' + player.level, player.x, player.y - player.radius - 25);
            }
            
            // 其他玩家血条
            if (player.health < player.maxHealth) {
                const barWidth = 50;
                const barHeight = 6;
                const barX = player.x - barWidth / 2;
                const barY = player.y + player.radius + 15;
                
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(barX, barY, barWidth, barHeight);
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(barX, barY, barWidth * (player.health / player.maxHealth), barHeight);
            }
        }
    }
    
    drawEnemies() {
        for (const enemy of this.enemies) {
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            this.ctx.rotate(enemy.angle);
            
            this.ctx.shadowColor = enemy.color;
            this.ctx.shadowBlur = 15;
            
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.moveTo(enemy.radius, 0);
            this.ctx.lineTo(-enemy.radius * 0.7, enemy.radius * 0.7);
            this.ctx.lineTo(-enemy.radius * 0.7, -enemy.radius * 0.7);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    drawBullets() {
        for (const bullet of this.bullets) {
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = bullet.color;
            this.ctx.lineWidth = bullet.radius;
            this.ctx.lineCap = 'round';
            this.ctx.globalAlpha = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(bullet.x, bullet.y);
            this.ctx.lineTo(bullet.x - bullet.vx * 2, bullet.y - bullet.vy * 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    
    drawParticles() {
        for (const p of this.particles) {
            this.ctx.globalAlpha = p.life / 40;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * (p.life / 40), 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawCrosshair() {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 15, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX - 20, this.mouseY);
        this.ctx.lineTo(this.mouseX - 10, this.mouseY);
        this.ctx.moveTo(this.mouseX + 10, this.mouseY);
        this.ctx.lineTo(this.mouseX + 20, this.mouseY);
        this.ctx.moveTo(this.mouseX, this.mouseY - 20);
        this.ctx.lineTo(this.mouseX, this.mouseY - 10);
        this.ctx.moveTo(this.mouseX, this.mouseY + 10);
        this.ctx.lineTo(this.mouseX, this.mouseY + 20);
        this.ctx.stroke();
    }
    
    gameOver() {
        this.running = false;
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.remove('hidden');
        document.getElementById('final-stats').innerHTML = `
            <p>击杀数: ${this.kills}</p>
        `;
    }
    
    quitGame() {
        this.running = false;
        if (window.network.connected) {
            window.network.disconnect();
        }
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    }
    
    restartGame() {
        document.getElementById('gameover-screen').classList.add('hidden');
        this.startGame();
    }
}

window.game = new Game();
