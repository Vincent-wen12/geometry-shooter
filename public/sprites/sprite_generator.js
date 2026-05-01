// 贴图生成器 - 创建真实的游戏几何图形
class SpriteGenerator {
    constructor() {
        this.cache = {};
    }

    // 创建画布
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    // 生成武器贴图
    generateWeapon(type) {
        const key = 'weapon_' + type;
        if (this.cache[key]) return this.cache[key];

        let canvas;
        switch(type) {
            case 'pistol':
                canvas = this.createPistol();
                break;
            case 'smg':
                canvas = this.createSMG();
                break;
            case 'shotgun':
                canvas = this.createShotgun();
                break;
            case 'sniper':
                canvas = this.createSniper();
                break;
            case 'rifle':
                canvas = this.createRifle();
                break;
            case 'machinegun':
                canvas = this.createMachinegun();
                break;
            case 'rocket':
                canvas = this.createRocket();
                break;
            default:
                canvas = this.createPistol();
        }

        this.cache[key] = canvas;
        return canvas;
    }

    createPistol() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 枪身
        ctx.fillStyle = '#333';
        ctx.fillRect(-20, -8, 35, 16);

        // 枪管
        ctx.fillStyle = '#222';
        ctx.fillRect(10, -5, 15, 10);

        // 握把
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(-10, 5, 12, 20);

        // 扳机
        ctx.fillStyle = '#555';
        ctx.fillRect(-5, 8, 8, 5);

        // 高光
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-18, -6, 30, 4);

        return canvas;
    }

    createSMG() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 枪身（长）
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-25, -7, 45, 14);

        // 枪管
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(15, -4, 12, 8);

        // 握把
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(-8, 5, 10, 18);

        // 弹匣
        ctx.fillStyle = '#444';
        ctx.fillRect(-5, 10, 15, 12);

        // 瞄准镜
        ctx.fillStyle = '#555';
        ctx.fillRect(-5, -12, 20, 5);

        // 高光
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-23, -5, 40, 3);

        return canvas;
    }

    createShotgun() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 双枪管
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-20, -10, 40, 8);
        ctx.fillRect(-20, 2, 40, 8);

        // 枪管口
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(15, -8, 8, 16);

        // 枪托
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(-28, -6, 12, 12);

        // 泵动把手
        ctx.fillStyle = '#444';
        ctx.fillRect(-5, -12, 15, 4);
        ctx.fillRect(-5, 8, 15, 4);

        return canvas;
    }

    createSniper() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 长枪身
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-25, -6, 50, 12);

        // 枪管
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(20, -3, 15, 6);

        // 狙击镜
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4a90d9';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // 枪托
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(-30, -4, 8, 8);

        // 高光
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-23, -4, 45, 3);

        return canvas;
    }

    createRifle() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 枪身
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(-22, -7, 42, 14);

        // 枪管
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(15, -4, 12, 8);

        // 握把
        ctx.fillStyle = '#4a3020';
        ctx.fillRect(-5, 5, 10, 16);

        // 弹匣
        ctx.fillStyle = '#555';
        ctx.fillRect(-3, 8, 14, 10);

        // 瞄准镜座
        ctx.fillStyle = '#444';
        ctx.fillRect(0, -14, 25, 7);

        // 机械瞄准
        ctx.fillStyle = '#333';
        ctx.fillRect(-18, -12, 4, 5);
        ctx.fillRect(12, -12, 4, 5);

        return canvas;
    }

    createMachinegun() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 重型枪身
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-25, -10, 48, 20);

        // 枪管（多根）
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(18, -12, 10, 6);
        ctx.fillRect(18, -3, 10, 6);
        ctx.fillRect(18, 6, 10, 6);

        // 弹鼓
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(-5, 12, 12, 0, Math.PI * 2);
        ctx.fill();

        // 把手
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(5, 8, 8, 14);

        // 散热孔
        ctx.fillStyle = '#222';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(-15 + i * 8, -8, 4, 16);
        }

        return canvas;
    }

    createRocket() {
        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 火箭筒身
        ctx.fillStyle = '#4a5d23';
        ctx.fillRect(-20, -12, 40, 24);

        // 发射管
        ctx.fillStyle = '#3d4d1c';
        ctx.fillRect(15, -8, 15, 16);

        // 火箭弹头
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(28, -6);
        ctx.lineTo(35, 0);
        ctx.lineTo(28, 6);
        ctx.closePath();
        ctx.fill();

        // 瞄准器
        ctx.fillStyle = '#222';
        ctx.fillRect(-5, -18, 20, 6);
        ctx.fillStyle = '#4a90d9';
        ctx.fillRect(0, -16, 10, 2);

        // 把手
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-10, 10, 8, 12);

        // 尾翼
        ctx.fillStyle = '#3d4d1c';
        ctx.fillRect(-25, -15, 8, 5);
        ctx.fillRect(-25, 10, 8, 5);

        return canvas;
    }

    // 生成载具贴图
    generateVehicle(type) {
        const key = 'vehicle_' + type;
        if (this.cache[key]) return this.cache[key];

        let canvas;
        switch(type) {
            case 'tank':
                canvas = this.createTank();
                break;
            case 'armored':
                canvas = this.createArmored();
                break;
            case 'helicopter':
                canvas = this.createHelicopter();
                break;
            default:
                canvas = this.createTank();
        }

        this.cache[key] = canvas;
        return canvas;
    }

    createTank() {
        const canvas = this.createCanvas(128, 128);
        const ctx = canvas.getContext('2d');
        ctx.translate(64, 64);

        // 履带
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-55, -40, 110, 15);
        ctx.fillRect(-55, 25, 110, 15);

        // 履带轮
        ctx.fillStyle = '#1a1a1a';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(-40 + i * 20, -32, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-40 + i * 20, 32, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // 车身
        ctx.fillStyle = '#3d5c1f';
        ctx.fillRect(-45, -30, 80, 50);

        // 炮塔
        ctx.fillStyle = '#4a6d28';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        // 炮管
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(15, -5, 40, 10);

        // 高光
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-43, -28, 76, 10);

        return canvas;
    }

    createArmored() {
        const canvas = this.createCanvas(128, 128);
        const ctx = canvas.getContext('2d');
        ctx.translate(64, 64);

        // 车身（菱形）
        ctx.fillStyle = '#5a4a8a';
        ctx.beginPath();
        ctx.moveTo(-50, 0);
        ctx.lineTo(0, -35);
        ctx.lineTo(50, 0);
        ctx.lineTo(0, 35);
        ctx.closePath();
        ctx.fill();

        // 装甲板
        ctx.fillStyle = '#4a3a7a';
        ctx.beginPath();
        ctx.moveTo(-40, 0);
        ctx.lineTo(0, -28);
        ctx.lineTo(40, 0);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();

        // 炮台
        ctx.fillStyle = '#3a2a6a';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // 炮管
        ctx.fillStyle = '#2a1a5a';
        ctx.fillRect(10, -4, 30, 8);

        // 轮胎
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-35, -20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-35, 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(35, -20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(35, 20, 8, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createHelicopter() {
        const canvas = this.createCanvas(128, 128);
        const ctx = canvas.getContext('2d');
        ctx.translate(64, 64);

        // 机身
        ctx.fillStyle = '#4a6080';
        ctx.beginPath();
        ctx.ellipse(0, 10, 40, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // 驾驶舱
        ctx.fillStyle = '#6a8090';
        ctx.beginPath();
        ctx.ellipse(25, 5, 18, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // 玻璃
        ctx.fillStyle = '#4a90d9';
        ctx.beginPath();
        ctx.ellipse(28, 3, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // 尾翼
        ctx.fillStyle = '#3a5060';
        ctx.fillRect(-60, 5, 25, 10);

        // 主旋翼
        ctx.fillStyle = '#2a4050';
        ctx.fillRect(-50, -3, 100, 6);

        // 旋翼中心
        ctx.fillStyle = '#4a5060';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        // 起落架
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-20, 30, 40, 4);
        ctx.fillRect(-18, 32, 4, 10);
        ctx.fillRect(14, 32, 4, 10);

        return canvas;
    }

    // 生成玩家贴图
    generatePlayer() {
        const key = 'player';
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 身体
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * 25;
            const y = Math.sin(angle) * 25;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // 头部
        ctx.fillStyle = '#f5d0c5';
        ctx.beginPath();
        ctx.arc(0, -5, 12, 0, Math.PI * 2);
        ctx.fill();

        // 头盔
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(0, -8, 12, Math.PI, 0);
        ctx.fill();

        return canvas;
    }

    // 生成敌人贴图
    generateEnemy() {
        const key = 'enemy';
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

        // 身体（红色六边形）
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * 25;
            const y = Math.sin(angle) * 25;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-8, -5, 6, 0, Math.PI * 2);
        ctx.arc(8, -5, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -5, 3, 0, Math.PI * 2);
        ctx.arc(8, -5, 3, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    // 生成掉落物贴图
    generateLoot(type) {
        const key = 'loot_' + type;
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');
        ctx.translate(16, 16);

        switch(type) {
            case 'health':
                ctx.fillStyle = '#e74c3c';
                break;
            case 'ammo':
                ctx.fillStyle = '#f39c12';
                break;
            case 'exp':
                ctx.fillStyle = '#9b59b6';
                break;
            case 'speed':
                ctx.fillStyle = '#3498db';
                break;
            default:
                ctx.fillStyle = '#fff';
        }

        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        switch(type) {
            case 'health':
                ctx.fillText('+', 0, 1);
                break;
            case 'ammo':
                ctx.fillRect(-4, -2, 8, 4);
                break;
            case 'exp':
                // 画五角星
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                    const r = i === 0 ? 8 : 8;
                    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'speed':
                ctx.beginPath();
                ctx.moveTo(-5, 0);
                ctx.lineTo(5, 0);
                ctx.lineTo(0, -5);
                ctx.lineTo(-5, 0);
                ctx.moveTo(-5, 0);
                ctx.lineTo(5, 0);
                ctx.lineTo(0, 5);
                ctx.stroke();
                break;
        }

        this.cache[key] = canvas;
        return canvas;
    }
}

// 导出
window.SpriteGenerator = SpriteGenerator;
