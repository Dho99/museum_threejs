import * as THREE from "three";

/**
 * ProceduralTextures
 * Generator untuk membuat texture procedural menggunakan Canvas API
 */
export default class ProceduralTextures {
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
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    /**
     * Membuat texture lantai marble dengan garis-garis curved
     */
    static createMarbleFloorTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fdfbf7"; // Ivory white
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.strokeStyle = "#e0dbce";
        ctx.lineWidth = 3;
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 1024, 0);
            ctx.bezierCurveTo(
                Math.random() * 1024,
                300,
                Math.random() * 1024,
                700,
                Math.random() * 1024,
                1024,
            );
            ctx.stroke();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    /**
     * Membuat texture dinding plaster galeri modern
     */
    static createWallPlasterTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f4f1ea"; // Warm gallery white
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 5000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? "#fcfaf5" : "#ebe7dd";
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    /**
     * Membuat texture untuk lukisan dengan warna primer yang ditentukan
     */
    static createPaintingCanvas(title, primaryColor) {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Base
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);

        // Abstract procedural art
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(256, 256, Math.random() * 150 + 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#222222";
        ctx.fillRect(
            Math.random() * 300,
            Math.random() * 300,
            Math.random() * 200,
            Math.random() * 20,
        );

        ctx.strokeStyle = "#d4af37"; // Gold accent
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.lineTo(Math.random() * 512, Math.random() * 512);
        ctx.stroke();

        return new THREE.CanvasTexture(canvas);
    }

    /**
     * Membuat texture untuk signage (papan informasi)
     */
    static createSignageTexture(text) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#2c3e50"; // Dark modern blue
        ctx.fillRect(0, 0, 1024, 256);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 80px Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 512, 128);

        return new THREE.CanvasTexture(canvas);
    }
}
