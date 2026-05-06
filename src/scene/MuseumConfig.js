/**
 * MuseumConfig
 * Konfigurasi data-driven untuk layout dan elemen museum
 * Semua nilai parameter dapat diubah di file ini tanpa modifikasi logic
 */

export const MuseumConfig = {
    // Layout utama museum
    layout: {
        width: 80, // Lebar ruangan
        depth: 60, // Kedalaman ruangan
        height: 12, // Tinggi ruangan
    },

    // Partisi dinding dalam untuk membagi area galeri
    walls: [
        // Partisi Galeri A (Kiri - Lukisan)
        { x: -15, y: 6, z: 10, w: 1, h: 12, d: 20 },
        { x: -15, y: 6, z: -15, w: 1, h: 12, d: 15 },
        // Partisi Galeri B (Kanan - Artefak)
        { x: 15, y: 6, z: 10, w: 1, h: 12, d: 20 },
        { x: 15, y: 6, z: -15, w: 1, h: 12, d: 15 },
        // Partisi Galeri C (Belakang)
        { x: 0, y: 6, z: -15, w: 12, h: 12, d: 1 },
    ],

    // Karpet pembatas area
    carpets: [
        { x: 0, z: 15, w: 8, d: 20, color: "blue" }, // Hall
        { x: -28, z: 0, w: 15, d: 40, color: "red" }, // Galeri A
        { x: 28, z: 0, w: 15, d: 40, color: "red" }, // Galeri B
    ],

    // Papan informasi
    signs: [
        { x: 0, y: 9, z: -14.4, text: "LOBBY UTAMA", rot: 0 },
        { x: -14.4, y: 8, z: 0, text: "GALERI SENI", rot: Math.PI / 2 },
        { x: 14.4, y: 8, z: 0, text: "RUANG ARTEFAK", rot: -Math.PI / 2 },
    ],

    // Koleksi lukisan di dinding
    paintings: [
        // Galeri A (Kiri)
        {
            x: -39.4,
            y: 5,
            z: 0,
            rot: Math.PI / 2,
            w: 4,
            h: 6,
            color: "#e74c3c",
            title: "Erupsi Abstrak",
            desc: "Karya prosedural yang mewakili kehangatan warna solid.",
        },
        {
            x: -39.4,
            y: 5,
            z: -10,
            rot: Math.PI / 2,
            w: 5,
            h: 3,
            color: "#3498db",
            title: "Ketenangan Biru",
            desc: "Bentuk dasar yang digenerate oleh algoritma Math.random().",
        },
        {
            x: -39.4,
            y: 5,
            z: 10,
            rot: Math.PI / 2,
            w: 3,
            h: 4,
            color: "#f1c40f",
            title: "Pancaran Pagi",
            desc: "Dibuat murni menggunakan Canvas API 2D.",
        },
        {
            x: -15.6,
            y: 5,
            z: -10,
            rot: -Math.PI / 2,
            w: 6,
            h: 4,
            color: "#9b59b6",
            title: "Dimensi Ungu",
            desc: "Menggabungkan garis dan lingkaran dalam loop.",
        },
        {
            x: -15.6,
            y: 5,
            z: 10,
            rot: -Math.PI / 2,
            w: 4,
            h: 5,
            color: "#1abc9c",
            title: "Keseimbangan",
            desc: "Bentuk simetris dari engine WebGL.",
        },
        // Lobby Belakang
        {
            x: -6,
            y: 5,
            z: -29.4,
            rot: 0,
            w: 4,
            h: 4,
            color: "#34495e",
            title: "Malam Gelap",
            desc: "Interpretasi ruang kosong.",
        },
        {
            x: 6,
            y: 5,
            z: -29.4,
            rot: 0,
            w: 4,
            h: 4,
            color: "#e67e22",
            title: "Senja",
            desc: "Kontras dari lukisan malam.",
        },
    ],

    // Koleksi artefak dalam vitrine (display case kaca)
    vitrines: [
        // Galeri B (Kanan - Ruang Artefak)
        {
            x: 25,
            z: -10,
            title: "Mahkota Emas",
            desc: "Dibangun dari TorusGeometry dan warna emissive.",
        },
        {
            x: 25,
            z: 0,
            title: "Cincin Kuno",
            desc: "Ditemukan di dalam array konfigurasi.",
        },
        {
            x: 25,
            z: 10,
            title: "Kalung Dinasti",
            desc: "Kumpulan SphereGeometry yang disatukan.",
        },
        {
            x: 32,
            z: -5,
            title: "Artefak Misterius",
            desc: "Objek tak terdefinisi.",
        },
    ],

    // Patung dan relief
    statues: [
        // Galeri C (Belakang)
        {
            x: -10,
            z: -22,
            type: "abstract",
            title: "Pilar Keseimbangan",
            desc: "Susunan Cylinder dan Box Geometry.",
        },
        {
            x: 10,
            z: -22,
            type: "cone",
            title: "Piramida Masa Depan",
            desc: "ConeGeometry dengan material emas.",
        },
    ],

    // Koleksi vas dekoratif
    vases: [
        // Tersebar di berbagai lokasi
        {
            x: -35,
            z: -15,
            title: "Vas Klasik",
            desc: "Lathe / Cylinder geometry.",
        },
        {
            x: -35,
            z: 15,
            title: "Vas Tinggi",
            desc: "Vas elegan di sudut ruangan.",
        },
        {
            x: 35,
            z: 15,
            title: "Vas Relik",
            desc: "Peninggalan procedural.",
        },
    ],

    // Kursi panjang untuk tempat duduk
    benches: [
        { x: 0, z: 5, rot: 0 },
        { x: -28, z: 0, rot: Math.PI / 2 },
        { x: 28, z: 0, rot: Math.PI / 2 },
    ],

    // Tanaman dekoratif
    plants: [
        { x: -8, z: 22 },
        { x: 8, z: 22 },
        { x: -38, z: 25 },
        { x: 38, z: 25 },
        { x: -14, z: -28 },
        { x: 14, z: -28 },
    ],

    // Lokasi resepsionis
    reception: { x: 0, z: 18 },

    // Parameter kamera dan kontrol
    camera: {
        initialPosition: { x: 0, y: 4, z: 25 }, // Start di Lobby
        fov: 65,
        near: 0.1,
        far: 150,
    },

    // Parameter kontrol pergerakan
    controls: {
        speed: 10.0, // Kecepatan pergerakan (unit/detik)
        mouseSensitivity: 0.002, // Sensitivitas mouse look
        collisionRadius: 1.0, // Radius collision player
        verticalClamp: Math.PI / 2.1, // Batas rotasi vertikal kamera
    },

    // Parameter pencahayaan
    lighting: {
        hemisphereLightIntensity: 0.6,
        ambientLightIntensity: 0.3,
        directionalLightIntensity: 0.8,
        spotlightIntensity: 150,
        spotlightAngle: Math.PI / 6,
        spotlightPenumbra: 0.8,
        fogColor: 0xf5f5dc,
        fogDensity: 0.008,
    },

    // Parameter rendering
    renderer: {
        toneMapping: "ACESFilmic",
        toneMappingExposure: 1.2,
        shadowMapSize: 2048,
        shadowBias: -0.001,
    },
};

export default MuseumConfig;
