class SpriteGenerator {
    constructor() {
        this.cache = {};
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

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
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(-28, -12, 50, 24);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(18, -8, 22, 16);

        ctx.fillStyle = '#555';
        ctx.fillRect(35, -4, 6, 8);

        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.moveTo(-12, 8);
        ctx.lineTo(6, 8);
        ctx.lineTo(10, 32);
        ctx.lineTo(-8, 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#666';
        ctx.fillRect(-6, 14, 10, 6);

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-26, -10, 44, 6);

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(-26, 4, 44, 4);

        const gradient = ctx.createLinearGradient(-28, 0, 20, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.12)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-28, -10, 44, 20);

        return canvas;
    }

    createSMG() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-35, -10, 60, 20);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(20, -6, 18, 12);

        ctx.fillStyle = '#555';
        ctx.fillRect(34, -3, 4, 6);

        ctx.fillStyle = '#3d2817';
        ctx.beginPath();
        ctx.moveTo(-10, 8);
        ctx.lineTo(6, 8);
        ctx.lineTo(8, 26);
        ctx.lineTo(-8, 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#555';
        ctx.fillRect(-6, 10, 20, 16);

        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(-8, -16);
        ctx.lineTo(22, -16);
        ctx.lineTo(22, -8);
        ctx.lineTo(-8, -8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(-33, -8, 54, 4);

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(-33, 2, 54, 3);

        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = '#222';
            ctx.fillRect(-30 + i * 9, -10, 4, 20);
        }

        return canvas;
    }

    createShotgun() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-28, -14, 55, 10);
        ctx.fillRect(-28, 4, 55, 10);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(22, -12, 12, 24);

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(-38, -8, 14, 16);

        ctx.fillStyle = '#444';
        ctx.fillRect(-8, -18, 20, 6);
        ctx.fillRect(-8, 12, 20, 6);

        ctx.fillStyle = '#333';
        ctx.fillRect(-28, -14, 55, 4);
        ctx.fillRect(-28, 10, 55, 4);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-26, -12, 50, 3);
        ctx.fillRect(-26, 6, 50, 3);

        return canvas;
    }

    createSniper() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-35, -9, 70, 18);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(30, -5, 22, 10);

        ctx.fillStyle = '#555';
        ctx.fillRect(48, -3, 4, 6);

        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4a90d9';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-2, -2, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3d2817';
        ctx.fillRect(-42, -6, 10, 12);

        ctx.fillStyle = '#333';
        ctx.fillRect(-18, -16, 36, 7);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-33, -7, 64, 4);

        return canvas;
    }

    createRifle() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(-30, -10, 58, 20);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(24, -6, 16, 12);

        ctx.fillStyle = '#555';
        ctx.fillRect(36, -3, 4, 6);

        ctx.fillStyle = '#4a3020';
        ctx.beginPath();
        ctx.moveTo(-6, 8);
        ctx.lineTo(8, 8);
        ctx.lineTo(10, 26);
        ctx.lineTo(-4, 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#666';
        ctx.fillRect(-4, 10, 18, 14);

        ctx.fillStyle = '#555';
        ctx.fillRect(-2, -20, 34, 10);

        ctx.fillStyle = '#444';
        ctx.fillRect(-26, -18, 6, 7);
        ctx.fillRect(18, -18, 6, 7);

        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(-28, -8, 52, 4);

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(-28, 2, 52, 3);

        return canvas;
    }

    createMachinegun() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-35, -14, 64, 28);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(25, -18, 14, 8);
        ctx.fillRect(25, -5, 14, 8);
        ctx.fillRect(25, 8, 14, 8);

        ctx.fillStyle = '#555';
        ctx.fillRect(35, -3, 4, 6);

        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(-6, 18, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(-6, 18, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3d2817';
        ctx.fillRect(6, 12, 12, 20);

        ctx.fillStyle = '#222';
        for (let i = 0; i < 7; i++) {
            ctx.fillRect(-28 + i * 9, -12, 4, 24);
        }

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-33, -12, 58, 4);

        ctx.fillStyle = '#333';
        ctx.fillRect(-35, 4, 64, 6);

        return canvas;
    }

    createRocket() {
        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#4a5d23';
        ctx.fillRect(-28, -18, 55, 36);

        ctx.fillStyle = '#3d4d1c';
        ctx.fillRect(22, -12, 22, 24);

        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(42, -8);
        ctx.lineTo(52, 0);
        ctx.lineTo(42, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#222';
        ctx.fillRect(-8, -26, 28, 8);

        ctx.fillStyle = '#4a90d9';
        ctx.fillRect(0, -24, 14, 4);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(-14, 14, 12, 18);

        ctx.fillStyle = '#3d4d1c';
        ctx.fillRect(-36, -22, 12, 7);
        ctx.fillRect(-36, 15, 12, 7);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(-26, -16, 50, 6);

        ctx.fillStyle = '#555';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-10 + i * 18, 0, 4, 4);
        }

        return canvas;
    }

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
        const canvas = this.createCanvas(160, 160);
        const ctx = canvas.getContext('2d');
        ctx.translate(80, 80);

        const px = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
        };

        px(-64, -28, 128, 12, '#1a1a1a');
        px(-64, 16, 128, 12, '#1a1a1a');

        for (let i = 0; i < 7; i++) {
            const wx = -56 + i * 18;
            px(wx, -36, 10, 8, '#333');
            px(wx + 3, -34, 4, 4, '#555');
            px(wx, 28, 10, 8, '#333');
            px(wx + 3, 30, 4, 4, '#555');
        }

        for (let x = -52; x <= 48; x += 4) {
            px(x, -24, 4, 40, '#3d5c1f');
        }
        for (let y = -24; y <= 12; y += 4) {
            px(-52, y, 100, 4, '#3d5c1f');
        }

        for (let x = -48; x <= 44; x += 4) {
            px(x, -20, 4, 32, '#4a6d28');
        }
        px(-48, -20, 96, 4, '#5a7d38');
        px(-44, -16, 88, 4, '#5a7d38');

        px(-32, -12, 20, 4, '#5a7d38');
        px(-32, 8, 20, 4, '#5a7d38');

        for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
            const r = 26;
            px(Math.cos(angle) * r - 2, Math.sin(angle) * r - 2, 4, 4, '#3d5c1f');
        }
        for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
            const r = 22;
            px(Math.cos(angle) * r - 2, Math.sin(angle) * r - 2, 4, 4, '#4a6d28');
        }
        px(-6, -18, 12, 4, '#5a7d38');
        px(2, -14, 4, 4, '#fff');
        px(2, -14, 4, 4, 'rgba(255,255,255,0.4)');

        px(16, -5, 50, 10, '#222');
        px(62, -3, 6, 6, '#555');
        px(63, -2, 4, 4, '#888');
        px(16, -3, 46, 2, '#444');

        px(-60, -26, 120, 2, '#111');
        px(-60, 18, 120, 2, '#111');

        return canvas;
    }

    createArmored() {
        const canvas = this.createCanvas(160, 160);
        const ctx = canvas.getContext('2d');
        ctx.translate(80, 80);

        const px = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
        };

        for (let i = 0; i < 12; i++) {
            const t = i / 11;
            const x = -50 * (1 - t) + 50 * t;
            const y = -36 * (1 - t) + 0 * t;
            const w = 6 + Math.abs(t - 0.5) * 4;
            px(x - w/2, y - w/2, w, w, '#4a3a7a');
        }
        for (let i = 0; i < 12; i++) {
            const t = i / 11;
            const x = -50 * (1 - t) + 50 * t;
            const y = 0 * (1 - t) + 36 * t;
            const w = 6 + Math.abs(t - 0.5) * 4;
            px(x - w/2, y - w/2, w, w, '#4a3a7a');
        }

        px(-44, -32, 88, 4, '#5a4a8a');
        px(-40, -28, 80, 4, '#5a4a8a');
        px(-8, -24, 16, 48, '#5a4a8a');

        px(-38, -20, 24, 4, '#6a5a9a');
        px(14, -20, 24, 4, '#6a5a9a');
        px(-34, -16, 68, 4, '#3a2a6a');
        px(-30, 12, 60, 4, '#3a2a6a');

        for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
            px(Math.cos(angle) * 18 - 2, Math.sin(angle) * 18 - 2, 4, 4, '#3a2a6a');
        }
        for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
            px(Math.cos(angle) * 14 - 1.5, Math.sin(angle) * 14 - 1.5, 3, 3, '#4a3a7a');
        }

        px(18, -5, 35, 10, '#222');
        px(49, -3, 5, 6, '#555');
        px(50, -2, 3, 4, '#888');
        px(19, -3, 29, 2, '#444');

        px(-42, -26, 8, 8, '#333');
        px(-41, -25, 6, 6, '#555');
        px(-42, 18, 8, 8, '#333');
        px(-41, 19, 6, 6, '#555');
        px(34, -26, 8, 8, '#333');
        px(35, -25, 6, 6, '#555');
        px(34, 18, 8, 8, '#333');
        px(35, 19, 6, 6, '#555');

        return canvas;
    }

    createHelicopter() {
        const canvas = this.createCanvas(160, 160);
        const ctx = canvas.getContext('2d');
        ctx.translate(80, 80);

        const px = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
        };

        for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
            const rx = Math.cos(angle) * 44;
            const ry = Math.sin(angle) * 6;
            px(rx - 3, ry - 1.5, 6, 3, '#2a4a6a');
        }
        px(-72, -2, 144, 4, '#3a5a7a');

        for (let i = 0; i < 20; i++) {
            const t = i / 19;
            const x = -8 + t * 56;
            const yTop = -24 * Math.sin(t * Math.PI);
            const yBot = 24 * Math.sin(t * Math.PI);
            px(x - 2, yTop - 2, 4, 4, '#4a6a8a');
            px(x - 2, yBot - 2, 4, 4, '#4a6a8a');
        }

        for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
            px(Math.cos(angle) * 46 - 2, Math.sin(angle) * 28 - 2, 4, 4, '#4a6a8a');
        }

        for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
            px(Math.cos(angle) * 42 - 2, Math.sin(angle) * 25 - 2, 4, 4, '#5a7a9a');
        }

        for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
            if (Math.cos(angle) > 0 && Math.abs(Math.sin(angle)) < 12) {
                px(Math.cos(angle) * 34 - 2, Math.sin(angle) * 22 - 2, 4, 4, '#6ab0e0');
            }
        }
        px(26, -10, 16, 4, '#7ac0f0');
        px(30, -6, 12, 4, '#7ac0f0');
        px(32, -2, 8, 4, '#7ac0f0');
        px(26, 2, 16, 4, '#5a90c9');
        px(32, 6, 8, 4, 'rgba(255,255,255,0.25)');
        px(30, -8, 5, 3, 'rgba(255,255,255,0.35)');

        px(-60, 6, 36, 4, '#3a5a7a');
        px(-58, 4, 40, 2, '#4a6a8a');
        px(-56, 10, 32, 4, '#2a4a6a');

        px(-22, 38, 50, 4, '#333');
        px(-18, 42, 4, 14, '#444');
        px(14, 42, 4, 14, '#444');
        px(-18, 54, 4, 4, '#555');
        px(14, 54, 4, 4, '#555');

        px(38, 10, 14, 8, '#8a3030');
        px(39, 11, 12, 6, '#aa4040');
        px(41, 13, 4, 2, '#cc6060');

        px(-48, -10, 52, 4, '#5a7a9a');
        px(-46, -14, 48, 3, '#4a6a8a');

        px(0, -4, 4, 4, '#fff');
        px(0, -4, 4, 4, 'rgba(255,255,255,0.3)');

        return canvas;
    }

    generatePlayer() {
        const key = 'player';
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(96, 96);
        const ctx = canvas.getContext('2d');
        ctx.translate(48, 48);

        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * 32;
            const y = Math.sin(angle) * 32;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * 20;
            const y = Math.sin(angle) * 20;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f5d0c5';
        ctx.beginPath();
        ctx.arc(0, -6, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(0, -10, 16, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.fillRect(-4, -18, 8, 4);

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-5, -8, 3, 0, Math.PI * 2);
        ctx.arc(5, -8, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(-5, -8, 1.5, 0, Math.PI * 2);
        ctx.arc(5, -8, 1.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    generateEnemy() {
        const key = 'enemy';
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(64, 64);
        const ctx = canvas.getContext('2d');
        ctx.translate(32, 32);

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

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * 16;
            const y = Math.sin(angle) * 16;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

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

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 6, 4, 0, Math.PI);
        ctx.stroke();

        return canvas;
    }

    generateLoot(type) {
        const key = 'loot_' + type;
        if (this.cache[key]) return this.cache[key];

        const canvas = this.createCanvas(32, 32);
        const ctx = canvas.getContext('2d');
        ctx.translate(16, 16);

        let color;
        switch(type) {
            case 'health': color = '#e74c3c'; break;
            case 'ammo': color = '#f39c12'; break;
            case 'exp': color = '#9b59b6'; break;
            case 'speed': color = '#3498db'; break;
            default: color = '#fff';
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        switch(type) {
            case 'health':
                ctx.font = 'bold 16px Arial';
                ctx.fillText('+', 0, 1);
                break;
            case 'ammo':
                ctx.fillRect(-4, -2, 8, 4);
                break;
            case 'exp':
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                    if (i === 0) ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
                    else ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
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

window.SpriteGenerator = SpriteGenerator;