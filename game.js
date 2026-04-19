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
        this.maxParticles = 300; // 最大粒子数
        
        this.colors = [
            '#667eea', '#f093fb', '#4facfe', '#43e97b',
            '#fa709a', '#fee140', '#a8edea', '#ffecd2'
        ];
        
        // 地形元素（只生成一次）
        this.terrainElements = [];
        for (let i = 0; i < 50; i++) {
            this.terrainElements.push({
                x: Math.random() * 3000,
                y: Math.random() * 2000,
                size: 20 + Math.random() * 50
            });
        }
        
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
                icon: '🔥',
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
                icon: '💥',
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
                icon: '🎯',
                damage: 80,
                shootCooldown: 1200,
                maxAmmo: 5,
                reloadTime: 2500,
                bulletSpeed: 25,
                bulletCount: 1,
                spread: 0,
                bulletRadius: 8
            }
        ];
        
        this.init();
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
        
        // 触屏瞄准
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
        });
    }
    
    setupChat() {
        const chatInput = document.getElementById('chat-input');
        const emojiBtn = document.getElementById('chat-emoji-btn');
        const emojiPanel = document.getElementById('emoji-panel');
        const emojiGrid = emojiPanel.querySelector('.emoji-grid');
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                this.sendChat(chatInput.value.trim());
                chatInput.value = '';
            }
        });
        
        emojiBtn.addEventListener('click', () => {
            emojiPanel.classList.toggle('hidden');
        });
        
        emojiGrid.addEventListener('click', (e) => {
            if (e.target.nodeType === Node.TEXT_NODE) {
                const emoji = e.target.textContent.trim();
                if (emoji) {
                    chatInput.value += emoji;
                    emojiPanel.classList.add('hidden');
                }
            }
        });
        
        // 点击其他地方关闭表情包面板
        document.addEventListener('click', (e) => {
            if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
                emojiPanel.classList.add('hidden');
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
            shootCooldown: weapon.shootCooldown
        };
        
        // 初始化相机位置
        this.cameraX = this.player.x - this.width / 2;
        this.cameraY = this.player.y - this.height / 2;
        
        this.kills = 0;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
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
        
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateParticles();
        this.updateUI();
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
            this.addKillFeed('系统', `切换到 ${weapon.icon} ${weapon.name}`);
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
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
                
                if (dist < bullet.radius + enemy.radius) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    
                    for (let k = 0; k < 8; k++) {
                        const angle = (Math.PI * 2 / 8) * k;
                        this.particles.push({
                            x: enemy.x,
                            y: enemy.y,
                            vx: Math.cos(angle) * 4,
                            vy: Math.sin(angle) * 4,
                            radius: 3,
                            color: '#ff4757',
                            life: 30
                        });
                    }
                    
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.kills++;
                        
                        for (let k = 0; k < 20; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 2 + Math.random() * 4;
                            this.particles.push({
                                x: enemy.x,
                                y: enemy.y,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                radius: 3 + Math.random() * 4,
                                color: '#ff4757',
                                life: 40
                            });
                        }
                        
                        this.addKillFeed('你', '消灭了一个敌人');
                    }
                    break;
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
        
        // 更新挂机状态显示
        const autoDisplay = document.getElementById('auto-display');
        if (autoDisplay) {
            autoDisplay.textContent = this.autoMode ? '🤖 挂机中' : '✋ 手动';
            autoDisplay.style.color = this.autoMode ? '#43e97b' : '#fff';
        }
        
        // 更新武器栏
        for (let i = 0; i < this.weapons.length; i++) {
            const slot = document.getElementById('weapon-' + i);
            if (slot) {
                if (i === this.currentWeaponIndex) {
                    slot.classList.add('active');
                } else {
                    slot.classList.remove('active');
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
        this.drawParticles();
        this.drawBullets();
        this.drawEnemies();
        this.players.forEach(p => this.drawPlayer(p));
        this.drawPlayer(this.player, true);
        
        this.ctx.restore();
        
        this.drawCrosshair();
    }
    
    drawMap() {
        // 绘制地图背景
        const gradient = this.ctx.createLinearGradient(0, 0, this.mapWidth, this.mapHeight);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);
        
        // 绘制地图边界
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, this.mapWidth, this.mapHeight);
        
        // 绘制地形元素
        for (const element of this.terrainElements) {
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
            this.ctx.fill();
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
        
        this.ctx.shadowColor = player.color;
        this.ctx.shadowBlur = 20;
        
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
        
        this.ctx.fillStyle = isSelf ? '#fff' : '#aaa';
        this.ctx.fillRect(player.radius * 0.5, -4, player.radius * 0.8, 8);
        
        this.ctx.restore();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.name, player.x, player.y - player.radius - 10);
        
        if (isSelf && player.health < player.maxHealth) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(player.x - 25, player.y + player.radius + 5, 50, 6);
            this.ctx.fillStyle = '#f5576c';
            this.ctx.fillRect(player.x - 25, player.y + player.radius + 5, (player.health / player.maxHealth) * 50, 6);
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
