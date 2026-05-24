console.log('[game.js v2025-05-11-3] Loading...');
const LANG = {
    current: 'zh',
    zh: {
        // Start screen
        title: '几何枪战',
        subtitle: 'GEOMETRIC GUNFIGHT',
        nickname: '昵称',
        nicknamePlaceholder: '输入你的游戏昵称',
        roomId: '房间ID',
        roomIdPlaceholder: '输入房间ID (留空单人模式)',
        startGame: '开始游戏',
        officialServer: '官方服务器',
        quickMatch: '快速匹配',
        matching: '匹配中...',
        singlePlayer: '单人模式',
        // HUD
        health: '生命值',
        level: '等级',
        ammo: '弹药',
        kills: '击杀',
        manual: '手动',
        autoMode: '挂机中',
        autoModeOn: '已开启挂机模式 (按 F 关闭)',
        autoModeOff: '已关闭挂机模式 (按 F 开启)',
        day: '白天',
        night: '夜间',
        quit: '退出',
        music: '背景音乐',
        driving: '驾驶',
        leaveVehicle: '离开',
        reloading: '换弹中...',
        enterVehicle: '按 E 进入',
        // Weapons
        pistol: '手枪',
        smg: '冲锋枪',
        shotgun: '霰弹枪',
        sniper: '狙击枪',
        rifle: '步枪',
        machinegun: '机枪',
        rocket: '火箭筒',
        // Game
        gameOver: '游戏结束',
        restart: '再来一局',
        // Kill feed
        killedMonster: '击杀了 怪物',
        killedPlayer: '击杀了',
        system: '系统',
        pickedUp: '拾取了',
        exp: '经验',
        healthValue: '生命值',
        ammoValue: '发弹药',
        speedValue: '速度药水',
        enteredVehicle: '进入',
        leftVehicle: '离开',
        // Chat
        chatPlaceholder: '按 Enter 发送消息...',
        chatTitle: '聊天',
        // Official rooms
        roomName: '官方',
        // Game info
        features: '游戏特色',
        featuresList: ['3000x2000 大地图', '7种武器自由切换', '多人联机实时对战', '智能挂机模式', '实时聊天系统', '支持触屏操作'],
        controls: '操作说明',
        controlsList: ['WASD / 方向键 - 移动', '鼠标 - 瞄准', '左键 - 射击', '1-7 - 切换武器', 'F - 切换挂机模式', 'Tab - 打开聊天', 'Enter - 发送消息'],
        footer: '自由创作游戏',
        player: '玩家',
        joined: '加入了游戏',
        left: '离开了游戏',
        killText: '击杀了',
    },
    en: {
        title: 'Geometry Shooter',
        subtitle: '2D Multiplayer Gunfight',
        nickname: 'Nickname',
        nicknamePlaceholder: 'Enter your nickname',
        roomId: 'Room ID',
        roomIdPlaceholder: 'Enter room ID (leave empty for single player)',
        startGame: 'Start Game',
        officialServer: 'Official Server',
        quickMatch: 'Quick Match',
        matching: 'Matching...',
        singlePlayer: 'Single Player',
        health: 'HP',
        level: 'Lv',
        ammo: 'Ammo',
        kills: 'Kills',
        manual: 'Manual',
        autoMode: 'Auto',
        autoModeOn: 'Auto mode ON (Press F to disable)',
        autoModeOff: 'Auto mode OFF (Press F to enable)',
        day: 'Day',
        night: 'Night',
        quit: 'Quit',
        music: 'Music',
        driving: 'Driving',
        leaveVehicle: 'Leave',
        reloading: 'Reloading...',
        enterVehicle: 'Press E to enter',
        pistol: 'Pistol',
        smg: 'SMG',
        shotgun: 'Shotgun',
        sniper: 'Sniper',
        rifle: 'Rifle',
        machinegun: 'Machine Gun',
        rocket: 'Rocket',
        gameOver: 'Game Over',
        restart: 'Play Again',
        killedMonster: 'killed a monster',
        killedPlayer: 'killed',
        system: 'System',
        pickedUp: 'Picked up',
        exp: 'EXP',
        healthValue: 'HP',
        ammoValue: 'ammo',
        speedValue: 'Speed Boost',
        enteredVehicle: 'Entered',
        leftVehicle: 'Left',
        chatPlaceholder: 'Press Enter to chat...',
        chatTitle: 'Chat',
        roomName: 'Room',
        features: 'Features',
        featuresList: ['3000x2000 Map', '7 Weapons', 'Multiplayer PvP', 'Auto Mode', 'Real-time Chat', 'Touch Support'],
        controls: 'Controls',
        controlsList: ['WASD / Arrow Keys - Move', 'Mouse - Aim', 'Left Click - Shoot', '1-7 - Switch Weapon', 'F - Toggle Auto', 'Enter - Chat'],
        footer: 'Free Creative Game',
        player: 'Player',
        joined: 'joined the game',
        left: 'left the game',
        killText: 'killed',
    },
    t(key) {
        return LANG[LANG.current][key] || key;
    }
};

function __(key) {
    return LANG.t(key);
}

function updateLang() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = __(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = __(key);
    });
    document.querySelectorAll('[data-i18n-prefix]').forEach(el => {
        const key = el.dataset.i18nPrefix;
        const num = el.textContent.match(/\d+/);
        el.textContent = `${__(key)}-${num ? num[0] : ''}`;
    });
    const featuresList = document.getElementById('features-list');
    if (featuresList) {
        featuresList.innerHTML = LANG[LANG.current].featuresList.map(t => `<li>${t}</li>`).join('');
    }
    const controlsList = document.getElementById('controls-list');
    if (controlsList) {
        controlsList.innerHTML = LANG[LANG.current].controlsList.map(t => `<li>${t}</li>`).join('');
    }
    document.title = __('title') + ' - 2D Multiplayer';
}

function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    LANG.current = lang;
    updateLang();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

class SoundGenerator {
    constructor() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
        } catch(e) {
            this.enabled = false;
        }
    }

    ensureContext() {
        if (!this.enabled) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playShoot(type = 'pistol') {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        switch(type) {
            case 'shotgun':
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => this.playBlast(0.15), i * 15);
                }
                break;
            case 'sniper':
                this.playBlast(0.3);
                this.playRifleEcho();
                break;
            case 'rocket':
                this.playRocket();
                break;
            case 'machinegun':
                this.playBlast(0.06);
                break;
            case 'smg':
                this.playBlast(0.08);
                break;
            case 'rifle':
                this.playBlast(0.12);
                break;
            default:
                this.playBlast(0.1);
        }
    }

    playBlast(duration = 0.1) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    playRifleEcho() {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime + 0.05);
        osc.stop(ctx.currentTime + 0.5);
    }

    playRocket() {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    playExplosion() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);

        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(80, ctx.currentTime);
        noise.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
        noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        noise.start();
        noise.stop(ctx.currentTime + 0.3);
    }

    playPickup() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    }

    playReload() {
        if (!this.enabled) return;
        this.ensureContext();
        this.playClick();
        setTimeout(() => this.playClick(), 180);
        setTimeout(() => this.playClickHigh(), 360);
    }

    playClick() {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    }

    playClickHigh() {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    }

    playHurt() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    playKill() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    playLevelUp() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;
        const notes = [523, 659, 784, 1047];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
    }

    playEmpty() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
    }

    playVehicleEnter() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    playVehicleLeave() {
        if (!this.enabled) return;
        this.ensureContext();
        const ctx = this.ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    // Background music
    startBackgroundMusic() {
        if (this._bgAudio) return;
        try {
            const audio = new Audio('public/audio/background.mp3');
            audio.loop = true;
            audio.volume = 0.3;
            audio.play().catch(e => {
                console.log('背景音乐自动播放被阻止，等待用户交互');
                this._bgPending = true;
            });
            this._bgAudio = audio;
            this._bgPlaying = true;
        } catch(e) {
            console.log('无法加载背景音乐:', e);
        }
    }

    stopBackgroundMusic() {
        if (this._bgAudio) {
            this._bgAudio.pause();
            this._bgAudio = null;
            this._bgPlaying = false;
        }
    }

    toggleBackgroundMusic() {
        if (!this._bgAudio) {
            this.startBackgroundMusic();
            return;
        }
        if (this._bgPlaying) {
            this._bgAudio.pause();
            this._bgPlaying = false;
        } else {
            this._bgAudio.play().catch(() => {});
            this._bgPlaying = true;
        }
    }

    setBackgroundMusicVolume(vol) {
        if (this._bgAudio) {
            this._bgAudio.volume = Math.max(0, Math.min(1, vol));
        }
    }

    resumeBackgroundMusic() {
        if (this._bgPending && this._bgAudio) {
            this._bgAudio.play().catch(() => {});
            this._bgPlaying = true;
            this._bgPending = false;
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        
        this.player = null;
        this.players = new Map();
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.loots = [];
        this.damageTexts = [];
        
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        this.kills = 0;
        this.running = false;
        this.autoMode = false;
        this.isMultiplayer = false;
        
        // 大地图系统
        this.mapWidth = 3000;
        this.mapHeight = 2000;
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraSpeed = 0.1;
        this.targetCameraX = 0;
        this.targetCameraY = 0;
        
        // 设备检测
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 性能优化
        this.maxParticles = 150;
        this.maxEnemies = 6;
        this.updateInterval = 50;
        
        // 昼夜系统
        this.timeOfDay = 0;
        this.isNight = false;
        this.dayDuration = 180000;
        
        // 道具系统
        this.powerups = [];
        this.powerupTypes = [
            { type: 'health', name: '生命', color: '#2ecc71', effect: 30, icon: '+' },
            { type: 'shield', name: '护盾', color: '#3498db', effect: 50, icon: 'O' },
            { type: 'speed', name: '加速', color: '#f39c12', effect: 3, icon: '>' },
            { type: 'damage', name: '强化', color: '#e74c3c', effect: 2, icon: '!' }
        ];
        
        // 载具系统
        this.vehicles = [];
        this.vehicleTypes = [
            { type: 'tank', name: '坦克', radius: 40, speed: 2, damage: 40, color: '#27ae60', fireRate: 1000 },
            { type: 'armored', name: '装甲车', radius: 35, speed: 4, damage: 20, color: '#8e44ad', fireRate: 500 },
            { type: 'helicopter', name: '直升机', radius: 30, speed: 6, damage: 15, color: '#e67e22', fireRate: 300 }
        ];
        
        // RPG系统
        this.loots = [];
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
        
        // 地形元素
        this.terrainElements = [];
        for (let i = 0; i < 50; i++) {
            this.terrainElements.push({
                x: Math.random() * 3000,
                y: Math.random() * 2000,
                size: 20 + Math.random() * 50,
                type: Math.random() > 0.6 ? 'tree' : (Math.random() > 0.5 ? 'rock' : 'obstacle')
            });
        }
        
        this.regions = this.generateRegions();

        this.grassPositions = [];
        for (let i = 0; i < 300; i++) {
            this.grassPositions.push({
                x: Math.random() * this.mapWidth,
                y: Math.random() * this.mapHeight,
                r: 1 + Math.random() * 2,
                shade: 0.5 + Math.random() * 0.3
            });
        }

        // 动画状态
        this.walkTime = 0;
        this.shootAnimTimer = 0;
        this.reloadAnimTimer = 0;
        this.gunFlashTimer = 0;
        this.enemyHitFlash = new Map();
        this.lootPickupAnim = null;
        
        // 载具交互
        this.currentVehicle = null;
        this.nearbyVehicle = null;
        this.playerHitFlash = 0;
        this.weaponSpritesReady = false;
        this._generatingSprites = false;
        this.weaponDataUrls = [];
        this.spriteGen = null;
        this.vehicleEntryHint = '';
        this.sound = new SoundGenerator();
        
        // 武器库
        this.weapons = [
            {
                name: __('pistol'),
                icon: 'pistol',
                damage: 20,
                shootCooldown: 300,
                maxAmmo: 12,
                reloadTime: 1000,
                bulletSpeed: 14,
                bulletCount: 1,
                spread: 0
            },
            {
                name: __('smg'),
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
                name: __('shotgun'),
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
                name: __('sniper'),
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
                name: __('rifle'),
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
                name: __('machinegun'),
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
                name: __('rocket'),
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
        
        this.playerEffects = [];
        this.isMoving = false;
        this.weaponDataUrls = [];
        this.weaponSpritesReady = false;
        this.playerHitFlash = 0;
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
            if (e.key.toLowerCase() === 'e') {
                this.handleVehicleInteract();
            }
            if (e.key.toLowerCase() === 'f') {
                this.toggleAutoMode();
            }
            if (e.key.toLowerCase() === 'r' && this.player) {
                this.startReload();
            }
            if (e.key === 'Tab' && this.running) {
                e.preventDefault();
                document.getElementById('chat-input').focus();
            }
            if (e.key >= '1' && e.key <= '7') {
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
        
        document.getElementById('btn-start').addEventListener('click', () => {
            try {
                if (this.sound) {
                    this.sound.ensureContext();
                    this.sound.resumeBackgroundMusic();
                }
                this.startGame();
            } catch (e) {
                console.error('startGame error:', e);
            }
        });
        
        document.getElementById('btn-official').addEventListener('click', () => {
            try {
                if (this.sound) {
                    this.sound.ensureContext();
                    this.sound.resumeBackgroundMusic();
                }
                
                const nameInput = document.getElementById('player-name');
                const name = nameInput.value.trim() || '玩家' + Math.floor(Math.random() * 1000);
                const playerColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                this._pendingColor = playerColor;
                
                const btn = document.getElementById('btn-official');
                btn.textContent = __('matching');
                btn.disabled = true;
                
                const ws = new WebSocket(window.network.serverUrl);
                ws.onopen = () => {
                    window.network.socket = ws;
                    window.network.connected = true;
                    window.network.userId = name + '_' + Date.now();
                    window.network.startUpdateLoop();
                    window.network.joinOfficialRoom(name, playerColor);
                };
                ws.onmessage = (event) => {
                    window.network.handleMessage(JSON.parse(event.data));
                };
                ws.onclose = () => {
                    window.network.connected = false;
                };
                ws.onerror = () => {
                    btn.textContent = '🎮 快速匹配';
                    btn.disabled = false;
                };
            } catch (e) {
                console.error('official match error:', e);
                const btn = document.getElementById('btn-official');
                if (btn) {
                    btn.textContent = '🎮 快速匹配';
                    btn.disabled = false;
                }
            }
        });
        
        this.connectForRoomList();
        
        document.getElementById('btn-lang-zh').addEventListener('click', () => setLang('zh'));
        document.getElementById('btn-lang-en').addEventListener('click', () => setLang('en'));
        updateLang();
        
        document.getElementById('btn-quit').addEventListener('click', () => {
            try {
                this.quitGame();
            } catch (e) {
                console.error('quitGame error:', e);
            }
        });
        document.getElementById('btn-restart').addEventListener('click', () => {
            try {
                this.restartGame();
            } catch (e) {
                console.error('restartGame error:', e);
            }
        });
        
        const musicBtn = document.getElementById('btn-music');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                try {
                    if (this.sound) {
                        this.sound.toggleBackgroundMusic();
                        musicBtn.textContent = this.sound._bgPlaying ? '♪' : '♪';
                        musicBtn.style.opacity = this.sound._bgPlaying ? '1' : '0.5';
                    }
                } catch (e) {
                    console.error('music toggle error:', e);
                }
            });
        }
        
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
    
    handleVehicleInteract() {
        if (!this.player || !this.running) return;

        if (this.currentVehicle) {
            if (this.isMultiplayer && window.network && window.network.connected) {
                window.network.sendLeaveVehicle(this.currentVehicle.id);
            }
            this.leaveVehicle();
            return;
        }

        let nearest = null;
        let nearestDist = 80;
        for (const v of this.vehicles) {
            if (v.occupied) continue;
            const dist = Math.hypot(this.player.x - v.x, this.player.y - v.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = v;
            }
        }
        if (nearest) {
            if (this.isMultiplayer && window.network && window.network.connected) {
                window.network.sendEnterVehicle(nearest.id);
            }
            this.enterVehicle(nearest);
        }
    }

    enterVehicle(vehicle) {
        this.currentVehicle = vehicle;
        vehicle.occupied = true;
        this.addKillFeed(__('system'), `${__('enteredVehicle')} ${vehicle.name}`);
        if (this.sound) this.sound.playVehicleEnter();
    }

    leaveVehicle() {
        if (!this.currentVehicle) return;
        const v = this.currentVehicle;
        v.occupied = false;
        this.player.x = v.x + 50;
        this.player.y = v.y + 50;
        this.currentVehicle = null;
        this.addKillFeed(__('system'), __('leftVehicle'));
        if (this.sound) this.sound.playVehicleLeave();
    }

    startReload() {
        if (!this.player || this.player.ammo === this.player.maxAmmo) return;
        const weapon = this.weapons[this.currentWeaponIndex];
        this.player.reloadTime = Date.now();
        this.reloadAnimTimer = weapon.reloadTime;
        if (this.sound) this.sound.playReload();
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
        messageDiv.className = `chat-message ${isSelf ? 'self' : 'other'}`;
        messageDiv.innerHTML = `<span class="name">${sender}:</span>${message}`;
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
        try {
        const nameInput = document.getElementById('player-name');
        const name = (nameInput && nameInput.value.trim()) || 'Player';
        const roomIdInput = document.getElementById('room-id');
        const roomId = this.roomId || (roomIdInput && roomIdInput.value.trim());
        
        console.log('[startGame] name:', name, 'roomId:', roomId);
        
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');
        const gameoverScreen = document.getElementById('gameover-screen');
        if (startScreen) startScreen.classList.add('hidden');
        if (gameScreen) gameScreen.classList.remove('hidden');
        if (gameoverScreen) gameoverScreen.classList.add('hidden');
        
        this.currentWeaponIndex = 0;
        const weapon = this.weapons[this.currentWeaponIndex];
        
        if (!this.player) {
            this.player = {
                id: 'self',
                name: name,
                x: this.mapWidth / 2,
                y: this.mapHeight / 2,
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
        }
        
        this.cameraX = this.player.x - this.width / 2;
        this.cameraY = this.player.y - this.height / 2;
        
        this.kills = 0;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.loots = [];
        this.damageTexts = [];
        this.players.clear();
        this.running = true;
        this.isMoving = false;
        this.shootAnimTimer = 0;
        this.reloadAnimTimer = 0;
        this.gunFlashTimer = 0;
        this.currentVehicle = null;
        this.nearbyVehicle = null;
        
        const healthFill = document.getElementById('health-fill');
        if (healthFill) healthFill.style.width = '100%';
        const expFill = document.getElementById('exp-fill');
        if (expFill) expFill.style.width = '0%';
        
        const roomDisplay = document.getElementById('room-display');
        if (roomDisplay) roomDisplay.textContent = roomId || __('singlePlayer');
        
        this.isMultiplayer = !!roomId;
        
        try {
            if (this.sound) {
                this.sound.startBackgroundMusic();
            }
            
            if (roomId && !this._alreadyConnected) {
                window.network.connectAndJoin(roomId, name, this.player.color);
            }
        } catch (e) {
            console.error('startGame secondary init error:', e);
        }
        
        if (!roomId) {
            console.log('[startGame] Spawning enemies (single player mode)');
            this.spawnEnemies();
        } else {
            console.log('[startGame] Multiplayer mode, skipping enemy spawn');
        }
        console.log('[startGame] Starting game loop, player at:', this.player?.x, this.player?.y);
        this.gameLoop();
        } catch (e) {
            console.error('[startGame] CRITICAL ERROR:', e);
            if (!this.running && this.player) {
                this.running = true;
                this.gameLoop();
            }
        }
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
                    maxHealth: 0,
                    hitFlash: 0,
                    color: '#ff4757',
                    angle: 0
                });
                const enemy = this.enemies[this.enemies.length - 1];
                enemy.maxHealth = enemy.health;
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
        this.updateDamageTexts();
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
        if (!this.player) return;

        this.walkTime += 0.1;

        if (this.currentVehicle) {
            this.updateVehicleDriving();
        } else if (this.autoMode) {
            this.autoUpdatePlayer();
        } else {
            this.player.vx = this.player.vx || 0;
            this.player.vy = this.player.vy || 0;

            let dx = 0, dy = 0;
            if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
            if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
            if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
            if (this.keys['d'] || this.keys['arrowright']) dx += 1;

            if (dx !== 0 || dy !== 0) {
                const len = Math.sqrt(dx * dx + dy * dy);
                dx /= len;
                dy /= len;
                const targetVx = dx * this.player.speed;
                const targetVy = dy * this.player.speed;
                this.player.vx += (targetVx - this.player.vx) * 0.25;
                this.player.vy += (targetVy - this.player.vy) * 0.25;
                this.isMoving = true;
            } else {
                this.player.vx *= 0.85;
                this.player.vy *= 0.85;
                if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
                if (Math.abs(this.player.vy) < 0.1) this.player.vy = 0;
                this.isMoving = false;
                this.walkTime = 0;
            }

            this.player.x += this.player.vx;
            this.player.y += this.player.vy;

            const worldMouseX = this.mouseX + this.cameraX;
            const worldMouseY = this.mouseY + this.cameraY;
            this.player.angle = Math.atan2(worldMouseY - this.player.y, worldMouseX - this.player.x);

            if (this.mouseDown && Date.now() - this.player.lastShot > this.player.shootCooldown) {
                if (this.player.ammo > 0) {
                    this.shoot();
                    this.player.lastShot = Date.now();
                    this.player.ammo--;
                } else if (this.sound) {
                    this.sound.playEmpty();
                }
            }
        }

        if (!this.currentVehicle) {
            this.player.x = Math.max(this.player.radius, Math.min(this.mapWidth - this.player.radius, this.player.x));
            this.player.y = Math.max(this.player.radius, Math.min(this.mapHeight - this.player.radius, this.player.y));
        }

        this.targetCameraX = this.player.x - this.width / 2;
        this.targetCameraY = this.player.y - this.height / 2;

        this.targetCameraX = Math.max(0, Math.min(this.mapWidth - this.width, this.targetCameraX));
        this.targetCameraY = Math.max(0, Math.min(this.mapHeight - this.height, this.targetCameraY));

        this.cameraX += (this.targetCameraX - this.cameraX) * this.cameraSpeed;
        this.cameraY += (this.targetCameraY - this.cameraY) * this.cameraSpeed;

        if (this.player.ammo === 0 && this.player.reloadTime === 0) {
            this.startReload();
        }

        if (this.player.reloadTime > 0) {
            const weapon = this.weapons[this.currentWeaponIndex];
            if (Date.now() - this.player.reloadTime > weapon.reloadTime) {
                this.player.ammo = weapon.maxAmmo;
                this.player.maxAmmo = weapon.maxAmmo;
                this.player.reloadTime = 0;
                this.reloadAnimTimer = 0;
            }
        }

        this.updateAnimations();

        if (!this.currentVehicle) {
            this.updateNearbyVehicle();
        }

        if (this.currentVehicle) {
            this.player.x = this.currentVehicle.x;
            this.player.y = this.currentVehicle.y;
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
            this.reloadAnimTimer = 0;
            this.addKillFeed(__('system'), `${weapon.name}`);

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
        }
    }

    updateVehicleDriving() {
        const vehicle = this.currentVehicle;
        if (!vehicle) return;

        let dx = 0, dy = 0;
        if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
        if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
        if (this.keys['d'] || this.keys['arrowright']) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            vehicle.x += dx * vehicle.speed;
            vehicle.y += dy * vehicle.speed;
        }

        const worldMouseX = this.mouseX + this.cameraX;
        const worldMouseY = this.mouseY + this.cameraY;
        vehicle.angle = Math.atan2(worldMouseY - vehicle.y, worldMouseX - vehicle.x);

        if (this.mouseDown && Date.now() - vehicle.lastFire > vehicle.fireRate) {
            const newBullet = {
                x: vehicle.x + Math.cos(vehicle.angle) * vehicle.radius,
                y: vehicle.y + Math.sin(vehicle.angle) * vehicle.radius,
                vx: Math.cos(vehicle.angle) * 12,
                vy: Math.sin(vehicle.angle) * 12,
                radius: 8,
                color: vehicle.color,
                owner: 'vehicle',
                damage: vehicle.damage,
                angle: vehicle.angle,
                rotSpeed: 0.3
            };
            this.bullets.push(newBullet);
            vehicle.lastFire = Date.now();
            this.shootAnimTimer = 200;
            
            if (this.isMultiplayer && window.network && window.network.connected) {
                window.network.sendVehicleShoot(newBullet);
            }
        }

        vehicle.x = Math.max(vehicle.radius, Math.min(this.mapWidth - vehicle.radius, vehicle.x));
        vehicle.y = Math.max(vehicle.radius, Math.min(this.mapHeight - vehicle.radius, vehicle.y));

        vehicle.health = vehicle.health || 200;
    }

    updateNearbyVehicle() {
        this.nearbyVehicle = null;
        this.vehicleEntryHint = '';
        for (const v of this.vehicles) {
            if (v.occupied) continue;
            const dist = Math.hypot(this.player.x - v.x, this.player.y - v.y);
            if (dist < 80) {
                this.nearbyVehicle = v;
                this.vehicleEntryHint = __('enterVehicle') + ' ' + v.name;
                break;
            }
        }
    }

    updateAnimations() {
        if (this.shootAnimTimer > 0) this.shootAnimTimer -= 16;
        if (this.reloadAnimTimer > 0) this.reloadAnimTimer -= 16;
        if (this.gunFlashTimer > 0) this.gunFlashTimer -= 16;
        if (this.playerHitFlash > 0) this.playerHitFlash -= 16;

        for (const [id, timer] of this.enemyHitFlash) {
            this.enemyHitFlash.set(id, timer - 16);
            if (timer - 16 <= 0) {
                this.enemyHitFlash.delete(id);
            }
        }

        if (this.lootPickupAnim) {
            this.lootPickupAnim.progress += 0.05;
            if (this.lootPickupAnim.progress >= 1) {
                this.lootPickupAnim = null;
            }
        }
    }
    
    spawnLoot(x, y, type, value) {
        const lootType = this.lootTypes.find(t => t.type === type);
        this.loots.push({
            x: x,
            y: y,
            type: type,
            value: value,
            color: lootType ? lootType.color : '#f39c12',
            radius: 12,
            bobOffset: Math.random() * Math.PI * 2
        });
    }
    
    updateLoots() {
        for (let i = this.loots.length - 1; i >= 0; i--) {
            const loot = this.loots[i];
            loot.bobOffset += 0.1;
            
            const dist = Math.hypot(this.player.x - loot.x, this.player.y - loot.y);
            if (dist < this.player.radius + loot.radius + 20) {
                if (this.isMultiplayer) {
                    if (window.network && window.network.connected) {
                        window.network.sendCollectLoot(loot.id);
                        this.loots.splice(i, 1);
                        this.collectLootEffect(loot);
                    }
                } else {
                    this.collectLoot(loot);
                    this.loots.splice(i, 1);
                }
            }
        }
    }
    
    collectLoot(loot) {
        this.collectLootEffect(loot);
        
        if (this.sound) this.sound.playPickup();

        switch(loot.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + loot.value);
                this.addKillFeed(__('system'), `${__('pickedUp')} ${loot.value} ${__('healthValue')}`);
                break;
            case 'ammo':
                this.player.ammo += loot.value;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${loot.value} ${__('ammoValue')}`);
                break;
            case 'exp':
                this.player.exp += loot.value;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${loot.value} ${__('exp')}`);
                this.checkLevelUp();
                break;
            case 'speed':
                this.player.speedBoost = loot.value;
                this.player.speed = 5 + loot.value;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${__('speedValue')}`);
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

    collectLootEffect(loot) {
        this.lootPickupAnim = {
            startX: loot.x,
            startY: loot.y,
            endX: this.player.x,
            endY: this.player.y,
            color: loot.color || '#f39c12',
            progress: 0
        };
    }
    
    checkLevelUp() {
        while (this.player.exp >= this.player.expToLevel) {
            this.player.exp -= this.player.expToLevel;
            this.player.level++;
            this.player.expToLevel = Math.floor(this.player.expToLevel * 1.5);
            this.player.maxHealth += 10;
            this.player.health = this.player.maxHealth;
            this.player.speed += 0.5;
            this.addKillFeed(__('system'), `${__('level')} ${this.player.level}!`);
            if (this.sound) this.sound.playLevelUp();
        }
    }
    
    drawLoots() {
        for (const loot of this.loots) {
            const bob = Math.sin(loot.bobOffset) * 3;
            this.ctx.save();
            this.ctx.translate(loot.x, loot.y + bob);

            this.ctx.shadowColor = loot.color || '#f39c12';
            this.ctx.shadowBlur = 10;

            if (window.SpriteGenerator && this.spriteGen) {
                const lootSprite = this.spriteGen.generateLoot(loot.type || 'exp');
                if (lootSprite) {
                    this.ctx.drawImage(lootSprite, -16, -16, 32, 32);
                }
            } else {
                this.ctx.fillStyle = loot.color || '#f39c12';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, loot.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.lootPickupAnim) {
            const anim = this.lootPickupAnim;
            const t = anim.progress;
            const cx = anim.startX + (anim.endX - anim.startX) * t;
            const cy = anim.startY + (anim.endY - anim.startY) * t - 20 * Math.sin(t * Math.PI);
            const alpha = 1 - t;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = anim.color || '#f39c12';
            this.ctx.shadowColor = anim.color || '#f39c12';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 8 * (1 - t * 0.5), 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            this.ctx.globalAlpha = 1;
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
        if (!this.isMultiplayer && this.powerups.length < 5 && Math.random() < 0.01) {
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
                if (this.isMultiplayer) {
                    if (window.network && window.network.connected) {
                        window.network.sendCollectPowerup(powerup.id);
                        this.powerups.splice(i, 1);
                    }
                } else {
                    this.collectPowerup(powerup);
                    this.powerups.splice(i, 1);
                }
            }
        }
    }

    collectPowerup(powerup) {
        switch(powerup.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + powerup.effect);
                this.addKillFeed(__('system'), `${__('pickedUp')} ${powerup.name}`);
                break;
            case 'shield':
                this.player.shield = (this.player.shield || 0) + powerup.effect;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${powerup.effect} ${__('healthValue')}`);
                break;
            case 'speed':
                this.player.speedBoost = powerup.effect;
                this.player.speed = 5 + powerup.effect;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${powerup.name}`);
                setTimeout(() => {
                    this.player.speedBoost = 0;
                    this.player.speed = 5;
                }, 8000);
                break;
            case 'damage':
                this.player.damageBoost = powerup.effect;
                this.addKillFeed(__('system'), `${__('pickedUp')} ${powerup.name}`);
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
        if (this.isMultiplayer) return;
        
        if (this.vehicles.length < 3 && Math.random() < 0.002) {
            this.spawnVehicle();
        }

        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            const vehicle = this.vehicles[i];
            if (vehicle.occupied) continue;
            if (vehicle.health === undefined) vehicle.health = 200;

            let nearestEnemy = null;
            let nearestDist = 300;

            for (const enemy of this.enemies) {
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

            for (const enemy of this.enemies) {
                const dist = Math.hypot(enemy.x - vehicle.x, enemy.y - vehicle.y);
                if (dist < vehicle.radius + enemy.radius) {
                    vehicle.health -= 0.2;
                    if (vehicle.health <= 0) {
                        this.vehicles.splice(i, 1);
                        this.spawnDeathEffect(vehicle.x, vehicle.y, '#ff4757');
                        break;
                    }
                }
            }
        }
    }

    drawVehicles() {
        for (const vehicle of this.vehicles) {
            this.ctx.save();
            this.ctx.translate(vehicle.x, vehicle.y);
            this.ctx.rotate(vehicle.angle);

            this.ctx.shadowColor = vehicle.color;
            this.ctx.shadowBlur = 20;

            if (window.SpriteGenerator && this.spriteGen) {
                const vehicleSprite = this.spriteGen.generateVehicle(vehicle.type);
                if (vehicleSprite) {
                    const size = vehicle.radius * 3.5;
                    this.ctx.drawImage(vehicleSprite, -size/2, -size/2, size, size);
                }
            } else {
                if (vehicle.type === 'tank') {
                    this.ctx.fillStyle = vehicle.color;
                    this.ctx.fillRect(-vehicle.radius, -vehicle.radius * 0.6, vehicle.radius * 2, vehicle.radius * 1.2);
                    this.ctx.fillStyle = '#1a1a1a';
                    this.ctx.fillRect(0, -4, vehicle.radius * 1.5, 8);
                } else if (vehicle.type === 'armored') {
                    this.ctx.fillStyle = vehicle.color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(-vehicle.radius, -vehicle.radius * 0.5);
                    this.ctx.lineTo(vehicle.radius, 0);
                    this.ctx.lineTo(-vehicle.radius, vehicle.radius * 0.5);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else if (vehicle.type === 'helicopter') {
                    this.ctx.fillStyle = vehicle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, vehicle.radius * 0.7, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(-vehicle.radius * 1.2, -3, vehicle.radius * 2.4, 6);
                }
            }

            this.ctx.shadowBlur = 0;

            if (vehicle.health < vehicle.maxHealth) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(-vehicle.radius, vehicle.radius + 8, vehicle.radius * 2, 6);
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(-vehicle.radius, vehicle.radius + 8, (vehicle.health / vehicle.maxHealth) * vehicle.radius * 2, 6);
            }

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

        this.shootAnimTimer = 200;
        this.gunFlashTimer = 100;

        if (this.sound) {
            this.sound.playShoot(weapon.icon);
        }

        for (let i = 0; i < weapon.bulletCount; i++) {
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
                damage: weapon.damage,
                angle: angle,
                rotSpeed: 0.2 + Math.random() * 0.3
            };

            this.bullets.push(bullet);
        }

        if (this.particles.length < this.maxParticles) {
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: this.player.x + Math.cos(this.player.angle) * this.player.radius,
                    y: this.player.y + Math.sin(this.player.angle) * this.player.radius,
                    vx: Math.cos(this.player.angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                    vy: Math.sin(this.player.angle) * (3 + Math.random() * 3) + (Math.random() - 0.5) * 3,
                    radius: 2 + Math.random() * 2,
                    color: this.player.color,
                    life: 15
                });
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            if (bullet.angle !== undefined) {
                bullet.angle += bullet.rotSpeed;
            }

            if (bullet.x < -50 || bullet.x > this.mapWidth + 50 || 
                bullet.y < -50 || bullet.y > this.mapHeight + 50) {
                this.bullets.splice(i, 1);
                continue;
            }

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                const steps = Math.max(1, Math.ceil(Math.hypot(bullet.vx, bullet.vy) / 3));
                let hit = false;
                for (let step = 0; step <= steps; step++) {
                    const t = step / steps;
                    const cx = bullet.x - bullet.vx * (1 - t);
                    const cy = bullet.y - bullet.vy * (1 - t);
                    const dist = Math.hypot(cx - enemy.x, cy - enemy.y);
                    if (dist < bullet.radius + enemy.radius) {
                        hit = true;
                        break;
                    }
                }

                if (hit) {
                    this.bullets.splice(i, 1);

                    try { this.damageTexts.push({
                        x: enemy.x,
                        y: enemy.y - enemy.radius,
                        text: '-' + bullet.damage,
                        color: '#ff4444',
                        life: 40,
                        vy: -2
                    }); } catch(e) { console.error('damageTexts:', e); }

                    this.spawnHitEffect(enemy.x, enemy.y, '#c0392b');
                    if (this.sound) this.sound.playExplosion();

                    if (!this.isMultiplayer) {
                        enemy.health -= bullet.damage;
                        enemy.hitFlash = 300;

                        if (enemy.health <= 0) {
                            this.spawnDeathEffect(enemy.x, enemy.y, '#c0392b');
                            this.enemies.splice(j, 1);
                            this.kills++;
                            this.addKillFeed(__('system'), `${this.player.name} ${__('killedMonster')}`);
                            if (this.sound) this.sound.playKill();

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
                    } else {
                        enemy.health -= bullet.damage;
                        if (enemy.health < 0) enemy.health = 0;
                        enemy.hitFlash = 300;
                    }
                    break;
                }
            }

            if (bullet.owner === this.player.id) {
                for (const [id, otherPlayer] of this.players) {
                    const steps2 = Math.max(1, Math.ceil(Math.hypot(bullet.vx, bullet.vy) / 3));
                    let hit2 = false;
                    for (let step = 0; step <= steps2; step++) {
                        const t = step / steps2;
                        const cx = bullet.x - bullet.vx * (1 - t);
                        const cy = bullet.y - bullet.vy * (1 - t);
                        const dist = Math.hypot(cx - otherPlayer.x, cy - otherPlayer.y);
                        if (dist < bullet.radius + otherPlayer.radius) {
                            hit2 = true;
                            break;
                        }
                    }
                    if (hit2) {
                        otherPlayer.health -= bullet.damage;
                        otherPlayer.hitFlash = 300;
                        this.bullets.splice(i, 1);

                        if (otherPlayer.health <= 0) {
                            this.addKillFeed(this.player.name, `${__('killedPlayer')} ${otherPlayer.name}`);
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

    updateDamageTexts() {
        for (let i = this.damageTexts.length - 1; i >= 0; i--) {
            const dt = this.damageTexts[i];
            dt.y += dt.vy;
            dt.life--;
            if (dt.life <= 0) {
                this.damageTexts.splice(i, 1);
            }
        }
    }

    drawDamageTexts() {
        for (const dt of this.damageTexts) {
            this.ctx.globalAlpha = dt.life / 40;
            this.ctx.fillStyle = dt.color;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(dt.text, dt.x, dt.y);
        }
        this.ctx.globalAlpha = 1;
    }

    spawnHitEffect(x, y, color) {
        for (let k = 0; k < 5; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 2 + Math.random() * 2,
                color: color,
                life: 15
            });
        }
    }

    spawnDeathEffect(x, y, color) {
        for (let k = 0; k < 12; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 3 + Math.random() * 3,
                color: color,
                life: 30
            });
        }
    }
    
    updateEnemies() {
        if (this.isMultiplayer) return;
        
        for (const enemy of this.enemies) {
            if (enemy.hitFlash === undefined) enemy.hitFlash = 0;
            if (enemy.hitFlash > 0) enemy.hitFlash -= 16;
            if (enemy.hitFlash < 0) enemy.hitFlash = 0;

            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < 1) continue;
            
            const dist = Math.sqrt(distSq);
            enemy.angle = Math.atan2(dy, dx);
            
            if (dist > 600) {
                enemy.x += (dx / dist) * enemy.speed * 0.5;
                enemy.y += (dy / dist) * enemy.speed * 0.5;
            } else {
                enemy.x += (dx / dist) * enemy.speed;
                enemy.y += (dy / dist) * enemy.speed;
            }

            const collisionDist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
            if (collisionDist < this.player.radius + enemy.radius) {
                if (!this.currentVehicle) {
                    this.player.health -= 0.5;
                    this.playerHitFlash = 200;
                    if (this.sound) this.sound.playHurt();
                }
                
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
        if (!this._uiTimer) this._uiTimer = 0;
        this._uiTimer++;
        if (this._uiTimer % 12 !== 0) return;
        
        const healthFill = document.getElementById('health-fill');
        if (healthFill) {
            const pct = Math.round(this.player.health / this.player.maxHealth * 100);
            if (pct !== this._lastHealthPct) {
                healthFill.style.width = pct + '%';
                this._lastHealthPct = pct;
            }
        }
        
        const ammoCount = document.getElementById('ammo-count');
        if (ammoCount && ammoCount.textContent != this.player.ammo) {
            ammoCount.textContent = this.player.ammo;
        }
        
        const killCount = document.getElementById('kill-count');
        if (killCount && killCount.textContent != this.kills) {
            killCount.textContent = this.kills;
        }
        
        const levelCount = document.getElementById('level-count');
        if (levelCount && levelCount.textContent != this.player.level) {
            levelCount.textContent = this.player.level;
        }
        
        const expFill = document.getElementById('exp-fill');
        if (expFill) {
            const pct = Math.round(this.player.exp / this.player.expToLevel * 100);
            if (pct !== this._lastExpPct) {
                expFill.style.width = pct + '%';
                this._lastExpPct = pct;
            }
        }
        
        const dayNightDisplay = document.getElementById('day-night-display');
        if (dayNightDisplay) {
            const text = this.isNight ? __('night') : __('day');
            if (dayNightDisplay.textContent !== text) dayNightDisplay.textContent = text;
        }
        
        const autoDisplay = document.getElementById('auto-display');
        if (autoDisplay) {
            const text = this.autoMode ? __('autoMode') : __('manual');
            if (autoDisplay.textContent !== text) autoDisplay.textContent = text;
            autoDisplay.style.color = this.autoMode ? '#43e97b' : '#fff';
        }
        
        if (window.SpriteGenerator) {
            if (!this.spriteGen) {
                this.spriteGen = new SpriteGenerator();
            }
            if (!this.weaponSpritesReady && !this._generatingSprites) {
                this._generatingSprites = true;
                try {
                    let allReady = true;
                    for (let i = 0; i < this.weapons.length; i++) {
                        const weaponType = this.weapons[i].icon;
                        const spriteCanvas = this.spriteGen.generateWeapon(weaponType);
                        if (spriteCanvas) {
                            this.weaponDataUrls[i] = spriteCanvas.toDataURL();
                        } else {
                            allReady = false;
                        }
                    }
                    if (allReady) {
                        this.weaponSpritesReady = true;
                        for (let i = 0; i < this.weapons.length; i++) {
                            const slot = document.getElementById('weapon-' + i);
                            if (slot && this.weaponDataUrls[i]) {
                                const img = document.createElement('img');
                                img.src = this.weaponDataUrls[i];
                                img.style.cssText = 'width:100%;height:100%;object-fit:contain;transform:scale(0.7)';
                                slot.innerHTML = '';
                                slot.appendChild(img);
                            }
                            if (i === this.currentWeaponIndex) {
                                slot.classList.add('active');
                            } else {
                                slot.classList.remove('active');
                            }
                        }
                    }
                } catch(e) { console.error('Sprite generation error:', e); }
                this._generatingSprites = false;
            } else if (this.weaponSpritesReady) {
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
            }
        }
        
        let playersHtml = '<h4>' + __('players') + '</h4>';
        playersHtml += `<div class="player-item"><span>${this.player.name}</span><span>${this.kills}</span></div>`;
        
        this.players.forEach((p, id) => {
            playersHtml += `<div class="player-item"><span>${p.name}</span><span>${p.kills || 0}</span></div>`;
        });
        
        const playersList = document.getElementById('players-list');
        if (playersList) playersList.innerHTML = playersHtml;
    }
    
    // 切换挂机模式
    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        this.addKillFeed(__('system'), this.autoMode ? __('autoModeOn') : __('autoModeOff'));
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
                const awayAngle = this.player.angle + Math.PI;
                this.player.x += Math.cos(awayAngle) * this.player.speed;
                this.player.y += Math.sin(awayAngle) * this.player.speed;
                this.isMoving = true;
            } else if (nearestDist > idealDist + 30) {
                this.player.x += Math.cos(this.player.angle) * this.player.speed;
                this.player.y += Math.sin(this.player.angle) * this.player.speed;
                this.isMoving = true;
            } else {
                this.isMoving = false;
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
        
        try { this.drawMap(); } catch(e) { console.error('drawMap:', e); }
        try { this.drawGrid(); } catch(e) { console.error('drawGrid:', e); }
        try { this.drawLoots(); } catch(e) { console.error('drawLoots:', e); }
        try { this.drawParticles(); } catch(e) { console.error('drawParticles:', e); }
        try { this.drawPowerups(); } catch(e) { console.error('drawPowerups:', e); }
        try { this.drawVehicles(); } catch(e) { console.error('drawVehicles:', e); }
        try { this.drawPlayerEffects(); } catch(e) { console.error('drawPlayerEffects:', e); }
        try { this.drawBullets(); } catch(e) { console.error('drawBullets:', e); }
        try { this.drawEnemies(); } catch(e) { console.error('drawEnemies:', e); }
        try { this.drawDamageTexts(); } catch(e) { console.error('drawDamageTexts:', e); }
        
        if (this.players.size > 0) {
            try { this.players.forEach(p => { try { this.drawPlayer(p); } catch(e2) {} }); } catch(e) {}
        }
        
        if (this.player) {
            try { this.drawPlayer(this.player, true); } catch(e) { console.error('drawPlayer(self):', e); }
        }
        
        this.ctx.restore();
        
        if (this.currentVehicle) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(this.width / 2 - 80, 10, 160, 30);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${__('driving')}: ${this.currentVehicle.name} [E] ${__('leaveVehicle')}`, this.width / 2, 30);

            const vh = this.currentVehicle.health || 200;
            const vhMax = 200;
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(this.width / 2 - 60, 35, 120, 8);
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(this.width / 2 - 60, 35, 120 * (vh / vhMax), 8);
        }

        if (this.vehicleEntryHint && !this.currentVehicle) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            const hintW = this.ctx.measureText(this.vehicleEntryHint).width + 30;
            this.ctx.fillRect(this.width / 2 - hintW / 2, this.height - 80, hintW, 36);
            this.ctx.fillStyle = '#43e97b';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.vehicleEntryHint, this.width / 2, this.height - 56);
        }

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
            for (const g of this.grassPositions) {
                this.ctx.globalAlpha = g.shade;
                this.ctx.fillRect(g.x, g.y, g.r, g.r);
            }
            this.ctx.globalAlpha = 1;
        }
        
        if (this.isNight) {
            this.ctx.fillStyle = '#fff';
            for (let i = 0; i < 50; i++) {
                this.ctx.fillRect(
                    (i * 137 + 53) % this.mapWidth,
                    (i * 271 + 107) % this.mapHeight,
                    2, 2
                );
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
        const startX = Math.floor(this.cameraX / gridSize) * gridSize;
        const startY = Math.floor(this.cameraY / gridSize) * gridSize;
        const endX = Math.ceil((this.cameraX + this.width) / gridSize) * gridSize;
        const endY = Math.ceil((this.cameraY + this.height) / gridSize) * gridSize;
        
        for (let x = Math.max(0, startX); x <= Math.min(this.mapWidth, endX); x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, Math.max(0, this.cameraY));
            this.ctx.lineTo(x, Math.min(this.mapHeight, this.cameraY + this.height));
            this.ctx.stroke();
        }
        for (let y = Math.max(0, startY); y <= Math.min(this.mapHeight, endY); y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(Math.max(0, this.cameraX), y);
            this.ctx.lineTo(Math.min(this.mapWidth, this.cameraX + this.width), y);
            this.ctx.stroke();
        }
    }
    
    drawPlayer(player, isSelf = false) {
        if (isSelf && this.currentVehicle) {
            this.ctx.save();
            this.ctx.translate(player.x, player.y);
            this.ctx.scale(0.35, 0.35);

            this.ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i - Math.PI / 6;
                const x = Math.cos(a) * player.radius;
                const y = Math.sin(a) * player.radius;
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.restore();
            return;
        }

        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(player.x, player.y);
        this.ctx.rotate(player.angle);

        const bobAmount = this.isMoving ? Math.sin(this.walkTime * 3) * 2 : 0;

        this.ctx.save();
        this.ctx.translate(0, bobAmount);

        if (this.playerHitFlash > 0) {
            this.ctx.shadowColor = '#ff0000';
            this.ctx.shadowBlur = 40;
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        } else {
            this.ctx.shadowColor = player.color;
            this.ctx.shadowBlur = isSelf ? 25 : 20;
            this.ctx.fillStyle = player.color;
        }
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(a) * player.radius;
            const y = Math.sin(a) * player.radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(a) * player.radius * 0.55;
            const y = Math.sin(a) * player.radius * 0.55;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();

        if (isSelf) {
            const handSwing = this.isMoving ? Math.sin(this.walkTime * 3) * 0.4 : 0;

            const weapon = this.weapons[this.currentWeaponIndex];
            const reloadProgress = this.reloadAnimTimer > 0
                ? (weapon.reloadTime - this.reloadAnimTimer) / weapon.reloadTime : 1;

            let reloadTilt = 0;
            let reloadDrop = 0;
            if (this.reloadAnimTimer > 0) {
                if (reloadProgress < 0.3) {
                    reloadDrop = reloadProgress / 0.3 * 8;
                    reloadTilt = reloadProgress / 0.3 * 0.25;
                } else if (reloadProgress > 0.7) {
                    const p = (reloadProgress - 0.7) / 0.3;
                    reloadDrop = (1 - p) * 8;
                    reloadTilt = (1 - p) * 0.25;
                } else {
                    reloadDrop = 8 + Math.sin(this.reloadAnimTimer * 0.05) * 2;
                    reloadTilt = 0.25;
                }
            }

            const recoil = this.shootAnimTimer > 0 ? -3 : 0;

            this.ctx.save();
            this.ctx.translate(player.radius * 0.5, 4 + handSwing * 2);
            this.ctx.fillStyle = this.lightenColor(player.color, 30);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(player.radius * 0.5, -4 - handSwing * 2);
            this.ctx.fillStyle = this.lightenColor(player.color, 30);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(player.radius * 0.35, reloadDrop);
            this.ctx.rotate(recoil * 0.05 + reloadTilt);

            if (window.SpriteGenerator && this.spriteGen) {
                const weaponType = weapon.icon;
                const weaponSprite = this.spriteGen.generateWeapon(weaponType);
                if (weaponSprite) {
                    this.ctx.translate(player.radius * 0.8, 0);
                    this.ctx.drawImage(weaponSprite, -18, -14, 36, 28);
                }
            } else {
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(player.radius * 0.6, -4, player.radius * 0.7, 8);
            }

            this.ctx.restore();

            if (this.gunFlashTimer > 0) {
                this.ctx.save();
                this.ctx.translate(player.radius * 1.25, -2);
                const flashAlpha = this.gunFlashTimer / 100;
                this.ctx.fillStyle = `rgba(255, 255, 220, ${flashAlpha})`;
                this.ctx.shadowColor = '#ffcc00';
                this.ctx.shadowBlur = 25 * flashAlpha;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, 12 * flashAlpha, 6 * flashAlpha, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            if (this.reloadAnimTimer > 0) {
                this.ctx.save();
                this.ctx.translate(0, player.radius + 25);
                this.ctx.font = 'bold 9px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = `rgba(255,200,50,${0.7 + Math.sin(Date.now() * 0.01) * 0.3})`;
                this.ctx.fillText(__('reloading'), 0, 0);

                const barW = 30;
                const barH = 3;
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(-barW/2, 5, barW, barH);
                this.ctx.fillStyle = '#f39c12';
                this.ctx.fillRect(-barW/2, 5, barW * (1 - reloadProgress), barH);
                this.ctx.restore();
            }
        } else {
            this.ctx.fillStyle = '#aaa';
            this.ctx.fillRect(player.radius * 0.5, -4, player.radius * 0.8, 8);
        }

        this.ctx.restore();
        this.ctx.restore();

        if (isSelf) {
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
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(player.name, player.x, player.y - player.radius - 10);

            if (player.level) {
                this.ctx.fillStyle = '#f39c12';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.fillText('Lv.' + player.level, player.x, player.y - player.radius - 25);
            }

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

    lightenColor(color, amt) {
        if (!color || color.startsWith('rgb')) return color || '#fff';
        let c = color.replace('#', '');
        if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        let num = parseInt(c, 16);
        let r = Math.min(255, (num >> 16) + amt);
        let g = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        let b = Math.min(255, (num & 0x0000FF) + amt);
        return `rgb(${r},${g},${b})`;
    }
    
    drawEnemies() {
        for (const enemy of this.enemies) {
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);

            if (enemy.hitFlash > 0) {
                this.ctx.shadowColor = '#fff';
                this.ctx.shadowBlur = 30;
                this.ctx.fillStyle = '#fff';
            } else {
                this.ctx.shadowColor = enemy.color;
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = enemy.color;
            }

            this.ctx.rotate(enemy.angle + Math.sin(Date.now() * 0.003) * 0.1);

            this.ctx.beginPath();
            this.ctx.moveTo(enemy.radius, 0);
            this.ctx.lineTo(-enemy.radius * 0.7, enemy.radius * 0.7);
            this.ctx.lineTo(-enemy.radius * 0.7, -enemy.radius * 0.7);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.shadowBlur = 0;

            if (window.SpriteGenerator && this.spriteGen) {
                const enemyGun = this.spriteGen.generateWeapon('pistol');
                if (enemyGun) {
                    this.ctx.save();
                    this.ctx.translate(enemy.radius * 0.6, 0);
                    this.ctx.drawImage(enemyGun, -6, -4, 12, 8);
                    this.ctx.restore();
                }
            }

            const barWidth = enemy.radius * 2;
            const barHeight = 4;
            const barX = -barWidth / 2;
            const barY = -enemy.radius - 10;
            const maxHp = enemy.maxHealth || enemy.health || 1;
            const healthPct = Math.max(0, (enemy.health || 0) / maxHp);
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            let barColor;
            if (healthPct > 0.6) barColor = '#2ecc71';
            else if (healthPct > 0.3) barColor = '#f39c12';
            else barColor = '#e74c3c';
            this.ctx.fillStyle = barColor;
            this.ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);

            this.ctx.restore();
        }
    }
    
    drawBullets() {
        for (const bullet of this.bullets) {
            this.ctx.save();
            this.ctx.translate(bullet.x, bullet.y);

            if (bullet.angle !== undefined) {
                this.ctx.rotate(bullet.angle);
            }

            this.ctx.fillStyle = bullet.color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, bullet.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            if (bullet.angle !== undefined) {
                this.ctx.ellipse(0, 0, bullet.radius * 1.5, bullet.radius * 0.8, 0, 0, Math.PI * 2);
            } else {
                this.ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
            }
            this.ctx.fill();

            this.ctx.restore();

            this.ctx.globalAlpha = 0.15;
            this.ctx.strokeStyle = bullet.color;
            this.ctx.lineWidth = bullet.radius * 0.6;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(bullet.x, bullet.y);
            this.ctx.lineTo(bullet.x - bullet.vx * 2, bullet.y - bullet.vy * 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    
    drawParticles() {
        for (const p of this.particles) {
            const alpha = p.life / (p.maxLife || 40);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
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
        this.player = null;
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.classList.add('hidden');
        const gameoverScreen = document.getElementById('gameover-screen');
        if (gameoverScreen) gameoverScreen.classList.remove('hidden');
        const finalStats = document.getElementById('final-stats');
        if (finalStats) finalStats.innerHTML = `
            <p>${__('kills')}: ${this.kills}</p>
            <p>${__('level')}: ${this.player.level}</p>
        `;
    }
    
    quitGame() {
        this.running = false;
        if (this.sound) {
            this.sound.stopBackgroundMusic();
        }
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

    connectForRoomList() {
        if (window.network._roomListWs) return;
        try {
            const ws = new WebSocket(window.network.serverUrl);
            ws.onopen = () => {
                window.network._roomListWs = ws;
                ws.send(JSON.stringify({ type: 'getOfficialRooms' }));
                window.network._roomListTimer = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'getOfficialRooms' }));
                    }
                }, 3000);
            };
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'officialRooms') {
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
            };
            ws.onclose = () => {
                window.network._roomListWs = null;
                if (window.network._roomListTimer) {
                    clearInterval(window.network._roomListTimer);
                    window.network._roomListTimer = null;
                }
            };
        } catch(e) {
            console.log('房间列表连接失败:', e);
        }
    }
}

window.game = new Game();

const originalShoot = window.game.shoot.bind(window.game);
window.game.shoot = function() {
    originalShoot();
    if (window.network && window.network.connected) {
        const weapon = this.weapons[this.currentWeaponIndex];
        const bullet = this.bullets[this.bullets.length - 1];
        if (bullet) {
            window.network.sendShoot(bullet, weapon);
        }
    }
};
