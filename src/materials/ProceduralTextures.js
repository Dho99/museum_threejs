import * as THREE from "three";

/**
 * ProceduralTextures
 * Generator untuk membuat texture procedural menggunakan Canvas API
 */
export default class ProceduralTextures {
    static createCanvasTexture(canvas, repeat = false) {
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        if (repeat) {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        }
        return tex;
    }

    /**
     * Membuat texture kayu terang dengan efek grain
     */
    static createLightWoodTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#e8d5b7"; // Warm light wood
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#d4be99";
        for (let i = 0; i < 150; i++) {
            ctx.globalAlpha = Math.random() * 0.4;
            ctx.fillRect(Math.random() * 512, 0, Math.random() * 8 + 1, 512);
        }
        ctx.globalAlpha = 1;
        return this.createCanvasTexture(canvas, true);
    }

    /**
     * Membuat texture lantai marble dengan garis-garis curved
     */
    static createMarbleFloorTexture() {
        const canvas = document.createElement("canvas");
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fdfbf7"; // Ivory white
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = "#e0dbce";
        ctx.lineWidth = 2;
        for (let i = 0; i < 28; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * size, 0);
            ctx.bezierCurveTo(
                Math.random() * size,
                size * 0.3,
                Math.random() * size,
                size * 0.7,
                Math.random() * size,
                size,
            );
            ctx.stroke();
        }
        return this.createCanvasTexture(canvas, true);
    }

    /**
     * Membuat texture dinding plaster galeri modern
     */
    static createWallPlasterTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        const base = ctx.createLinearGradient(0, 0, 512, 512);
        base.addColorStop(0, "#f4f0e7");
        base.addColorStop(0.55, "#e9e2d6");
        base.addColorStop(1, "#f7f4ee");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 1800; i++) {
            ctx.globalAlpha = Math.random() * 0.055;
            ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#cfc4b4";
            ctx.fillRect(
                Math.random() * 512,
                Math.random() * 512,
                Math.random() * 3 + 1,
                Math.random() * 18 + 4,
            );
        }

        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = "#bfb4a6";
        ctx.lineWidth = 1;
        for (let y = 24; y < 512; y += 48) {
            ctx.beginPath();
            ctx.moveTo(0, y + Math.random() * 8);
            ctx.bezierCurveTo(140, y - 6, 340, y + 8, 512, y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        return this.createCanvasTexture(canvas, true);
    }

    /**
     * Membuat texture untuk lukisan dengan warna primer yang ditentukan
     */
    static createPaintingCanvas(title, primaryColor) {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        const name = title.toLowerCase();

        const fillBackground = (top, bottom) => {
            const gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, top);
            gradient.addColorStop(1, bottom);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
        };

        if (name.includes("erupsi")) {
            fillBackground("#2a1010", "#e85d2a");
            ctx.fillStyle = "#241512";
            ctx.beginPath();
            ctx.moveTo(70, 430);
            ctx.lineTo(230, 155);
            ctx.lineTo(282, 155);
            ctx.lineTo(445, 430);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#ffce54";
            ctx.beginPath();
            ctx.moveTo(245, 170);
            ctx.lineTo(270, 170);
            ctx.lineTo(255, 405);
            ctx.closePath();
            ctx.fill();
        } else if (name.includes("biru")) {
            fillBackground("#b8dcff", "#1f5f9e");
            ctx.fillStyle = "#eaf6ff";
            ctx.beginPath();
            ctx.arc(370, 120, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#21466f";
            ctx.beginPath();
            ctx.moveTo(0, 315);
            ctx.lineTo(160, 190);
            ctx.lineTo(300, 315);
            ctx.lineTo(512, 230);
            ctx.lineTo(512, 512);
            ctx.lineTo(0, 512);
            ctx.closePath();
            ctx.fill();
        } else if (name.includes("pagi")) {
            fillBackground("#fff4c2", "#f2a33a");
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(256, 290, 105, Math.PI, 0);
            ctx.fill();
            ctx.strokeStyle = "#fff6a6";
            ctx.lineWidth = 8;
            for (let i = 0; i < 9; i++) {
                const a = -Math.PI + (i / 8) * Math.PI;
                ctx.beginPath();
                ctx.moveTo(256 + Math.cos(a) * 125, 290 + Math.sin(a) * 125);
                ctx.lineTo(256 + Math.cos(a) * 210, 290 + Math.sin(a) * 210);
                ctx.stroke();
            }
        } else if (name.includes("ungu")) {
            fillBackground("#ece7f4", "#b9a7d7");
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.ellipse(280, 265, 185, 135, -0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#2c2538";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(85, 170);
            ctx.lineTo(215, 150);
            ctx.stroke();
            ctx.strokeStyle = "#b28a37";
            ctx.lineWidth = 9;
            ctx.beginPath();
            ctx.moveTo(75, 300);
            ctx.lineTo(150, 405);
            ctx.stroke();
        } else if (name.includes("keseimbangan")) {
            fillBackground("#e7fbf7", "#75c7ba");
            ctx.fillStyle = primaryColor;
            ctx.fillRect(185, 160, 140, 42);
            ctx.fillRect(238, 205, 36, 160);
            ctx.fillStyle = "#183d38";
            ctx.beginPath();
            ctx.arc(172, 345, 52, 0, Math.PI * 2);
            ctx.arc(340, 345, 52, 0, Math.PI * 2);
            ctx.fill();
        } else if (name.includes("malam")) {
            fillBackground("#09111f", "#1c2f4f");
            ctx.fillStyle = "#f2f0d7";
            ctx.beginPath();
            ctx.arc(345, 135, 46, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#09111f";
            ctx.beginPath();
            ctx.arc(365, 120, 46, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#18243a";
            ctx.fillRect(70, 330, 45, 120);
            ctx.fillRect(140, 285, 70, 165);
            ctx.fillRect(245, 350, 55, 100);
        } else {
            fillBackground("#ffcf8a", "#7b2b1d");
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(256, 315, 78, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = "#3d1f2b";
            ctx.fillRect(0, 315, 512, 197);
            ctx.strokeStyle = "#ffd08a";
            ctx.lineWidth = 5;
            for (let y = 340; y < 430; y += 28) {
                ctx.beginPath();
                ctx.moveTo(40, y);
                ctx.bezierCurveTo(160, y - 16, 330, y + 16, 470, y);
                ctx.stroke();
            }
        }

        return this.createCanvasTexture(canvas);
    }

    /**
     * Membuat texture untuk signage (papan informasi)
     */
    static createSignageTexture(text) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#111a23";
        ctx.fillRect(0, 0, 1024, 256);

        const gradient = ctx.createLinearGradient(0, 0, 1024, 256);
        gradient.addColorStop(0, "#142332");
        gradient.addColorStop(0.5, "#1f3e4d");
        gradient.addColorStop(1, "#10202b");
        ctx.fillStyle = gradient;
        ctx.fillRect(20, 20, 984, 216);

        ctx.strokeStyle = "#7ee7ff";
        ctx.lineWidth = 8;
        ctx.shadowColor = "#55dfff";
        ctx.shadowBlur = 26;
        ctx.strokeRect(34, 34, 956, 188);

        ctx.fillStyle = "#eaffff";
        ctx.font = "bold 80px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#70efff";
        ctx.shadowBlur = 34;
        ctx.fillText(text, 512, 128);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, 512, 128);

        return this.createCanvasTexture(canvas);
    }
}
