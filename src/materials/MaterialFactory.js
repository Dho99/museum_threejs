import * as THREE from "three";
import ProceduralTextures from "./ProceduralTextures.js";

/**
 * MaterialFactory
 * Factory untuk membuat dan mengelola material Three.js
 */
export default class MaterialFactory {
    constructor() {
        // Floor material - marble dengan reflektifitas rendah
        this.floor = new THREE.MeshStandardMaterial({
            map: ProceduralTextures.createMarbleFloorTexture(),
            roughness: 0.1,
            metalness: 0.05,
        });

        // Wall material - plaster dengan roughness tinggi
        this.wall = new THREE.MeshStandardMaterial({
            map: ProceduralTextures.createWallPlasterTexture(),
            roughness: 0.95,
        });

        // Wood material - kayu terang
        this.wood = new THREE.MeshStandardMaterial({
            map: ProceduralTextures.createLightWoodTexture(),
            roughness: 0.6,
        });

        // Dark wood - kayu gelap untuk frame dan dekorasi
        this.darkWood = new THREE.MeshStandardMaterial({
            color: 0x3d2b1f,
            roughness: 0.8,
        });

        // Glass material - transparansi tinggi untuk vitrine
        this.glass = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 0.95,
            opacity: 1,
            metalness: 0,
            roughness: 0.05,
            ior: 1.5,
            thickness: 0.2,
            transparent: true,
        });

        // Metal gold - untuk aksesoris dan frame premium
        this.metalGold = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.9,
            roughness: 0.2,
        });

        // Metal dark - untuk bagian struktural
        this.metalDark = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.8,
            roughness: 0.4,
        });

        // Stone material - untuk patung dan relief
        this.stone = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.9,
        });

        // Carpet red - karpet merah untuk area khusus
        this.carpetRed = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            roughness: 1.0,
        });

        // Carpet blue - karpet biru untuk lobby
        this.carpetBlue = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 1.0,
        });

        // Leaf material - untuk dekorasi tanaman
        this.leaf = new THREE.MeshStandardMaterial({
            color: 0x2e7d32,
            roughness: 0.8,
        });
    }
}
