/**
 * main.js
 * Entry point aplikasi Museum 3D
 *
 * Tanggung jawab:
 * - Import Engine
 * - Membuat instance Engine
 * - Menjalankan engine saat window load
 */

import Engine from "./engine/Engine.js";

// Inisialisasi engine saat halaman selesai dimuat
window.addEventListener("load", () => {
    // Membuat instance Engine akan secara otomatis:
    // 1. Setup renderer, scene, camera
    // 2. Membangun museum
    // 3. Memulai animation loop
    const engine = new Engine();

    // Simpan reference global jika diperlukan untuk debugging
    window.museumEngine = engine;
});
