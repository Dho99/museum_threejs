import * as THREE from "three";
import ProceduralTextures from "../materials/ProceduralTextures.js";

/**
 * ObjectFactory
 * Factory untuk membuat berbagai objek 3D museum
 */
export default class ObjectFactory {
    constructor(materials) {
        this.mats = materials;
    }

    /**
     * Tandai mesh sebagai interactable dengan metadata
     */
    makeInteractable(mesh, title, desc) {
        mesh.traverse((c) => {
            if (c.isMesh) {
                c.userData = {
                    isInteractable: true,
                    title,
                    description: desc,
                    originalEmissive: c.material.emissive
                        ? c.material.emissive.getHex()
                        : 0x000000,
                };
            }
        });
    }

    /**
     * Membuat lukisan dengan frame dan canvas
     */
    createPainting(data) {
        const group = new THREE.Group();

        // Frame kayu gelap
        const frameGeo = new THREE.BoxGeometry(data.w + 0.4, data.h + 0.4, 0.2);
        const frame = new THREE.Mesh(frameGeo, this.mats.darkWood);

        // Canvas dengan texture painting procedural
        const canvasGeo = new THREE.PlaneGeometry(data.w, data.h);
        const canvasMat = new THREE.MeshStandardMaterial({
            map: ProceduralTextures.createPaintingCanvas(
                data.title,
                data.color,
            ),
            roughness: 1.0,
        });
        const canvas = new THREE.Mesh(canvasGeo, canvasMat);
        canvas.position.z = 0.11;

        frame.castShadow = true;
        group.add(frame, canvas);
        group.position.set(data.x, data.y, data.z);
        group.rotation.y = data.rot;

        this.makeInteractable(group, data.title, data.desc);
        return group;
    }

    /**
     * Membuat vitrine (display case) dengan artefak
     */
    createVitrine(data) {
        const group = new THREE.Group();

        // Pedestal
        const ped = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 3, 1.5),
            this.mats.wall,
        );
        ped.position.y = 1.5;
        ped.castShadow = ped.receiveShadow = true;

        // Glass display case
        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 1.5, 1.4),
            this.mats.glass,
        );
        glass.position.y = 3.75;

        // Artefak di dalam (torus emas)
        const artiGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
        const arti = new THREE.Mesh(artiGeo, this.mats.metalGold);
        arti.position.y = 3.5;
        arti.rotation.x = Math.PI / 2;
        arti.castShadow = true;

        // Label plate
        const plate = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.4, 0.05),
            this.mats.metalDark,
        );
        plate.position.set(0, 2.5, 0.76);
        plate.rotation.x = -0.2;

        group.add(ped, glass, arti, plate);
        group.position.set(data.x, 0, data.z);
        this.makeInteractable(group, data.title, data.desc);
        return { mesh: group, w: 1.5, d: 1.5 };
    }

    /**
     * Membuat patung atau relief
     */
    createStatue(data) {
        const group = new THREE.Group();

        // Pedestal silinder
        const ped = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.5, 2, 32),
            this.mats.floor,
        );
        ped.position.y = 1;
        ped.castShadow = ped.receiveShadow = true;

        // Patung - tipe cone atau abstract
        let statue;
        if (data.type === "cone") {
            statue = new THREE.Mesh(
                new THREE.ConeGeometry(1, 2, 4),
                this.mats.metalGold,
            );
        } else {
            // Abstract - kombinasi box dan cylinder
            statue = new THREE.Group();
            const b1 = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                this.mats.stone,
            );
            b1.position.y = 0.5;
            b1.rotation.y = Math.PI / 4;
            const c1 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.5, 1.5),
                this.mats.darkWood,
            );
            c1.position.y = 1.5;
            statue.add(b1, c1);
        }
        statue.position.y = 2;
        statue.castShadow = true;

        group.add(ped, statue);
        group.position.set(data.x, 0, data.z);
        this.makeInteractable(statue, data.title, data.desc);
        return { mesh: group, w: 3, d: 3 };
    }

    /**
     * Membuat vas dekoratif
     */
    createVase(data) {
        const group = new THREE.Group();

        // Pedestal kayu
        const ped = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            this.mats.wood,
        );
        ped.position.y = 1;
        ped.castShadow = true;

        // Badan vas (sphere scaled)
        const vase = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32),
            this.mats.stone,
        );
        vase.scale.set(1, 1.5, 1);
        vase.position.y = 2.5;
        vase.castShadow = true;

        // Leher vas
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.4, 0.5),
            this.mats.stone,
        );
        neck.position.y = 3.2;
        neck.castShadow = true;

        group.add(ped, vase, neck);
        group.position.set(data.x, 0, data.z);
        this.makeInteractable(group, data.title, data.desc);
        return { mesh: group, w: 1, d: 1 };
    }

    /**
     * Membuat kursi panjang untuk duduk
     */
    createBench(data) {
        const group = new THREE.Group();

        // Tempat duduk
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.2, 1),
            this.mats.wood,
        );
        seat.position.y = 0.6;
        seat.castShadow = seat.receiveShadow = true;

        // Kaki
        const legGeo = new THREE.BoxGeometry(0.2, 0.6, 0.8);
        const leg1 = new THREE.Mesh(legGeo, this.mats.metalDark);
        leg1.position.set(-1.5, 0.3, 0);
        const leg2 = new THREE.Mesh(legGeo, this.mats.metalDark);
        leg2.position.set(1.5, 0.3, 0);
        leg1.castShadow = leg2.castShadow = true;

        group.add(seat, leg1, leg2);
        group.position.set(data.x, 0, data.z);
        group.rotation.y = data.rot;

        return {
            mesh: group,
            w: data.rot === 0 ? 4 : 1,
            d: data.rot === 0 ? 1 : 4,
        };
    }

    /**
     * Membuat tanaman dekoratif dengan pot
     */
    createPlant(data) {
        const group = new THREE.Group();

        // Pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.4, 0.8),
            this.mats.metalDark,
        );
        pot.position.y = 0.4;
        pot.castShadow = true;
        group.add(pot);

        // Daun (6 pieces)
        for (let i = 0; i < 6; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 8, 8),
                this.mats.leaf,
            );
            leaf.scale.set(1, 0.1, 3);
            leaf.position.y = 0.8;
            leaf.rotation.y = (i / 6) * Math.PI * 2;
            leaf.rotation.x = 0.6;
            leaf.position.x = Math.sin(leaf.rotation.y) * 0.5;
            leaf.position.z = Math.cos(leaf.rotation.y) * 0.5;
            leaf.castShadow = true;
            group.add(leaf);
        }

        group.position.set(data.x, 0, data.z);
        return { mesh: group, w: 1.5, d: 1.5 };
    }

    /**
     * Membuat papan informasi (signage)
     */
    createSignage(data) {
        const tex = ProceduralTextures.createSignageTexture(data.text);
        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.8,
        });
        const board = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), mat);
        board.position.set(data.x, data.y, data.z);
        board.rotation.y = data.rot;
        return board;
    }

    /**
     * Membuat meja resepsionis
     */
    createReception(data) {
        const group = new THREE.Group();

        // Base meja
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(6, 1.2, 2),
            this.mats.wood,
        );
        base.position.y = 0.6;
        base.castShadow = base.receiveShadow = true;

        // Top dengan material floor (marble)
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(6.2, 0.1, 2.2),
            this.mats.floor,
        );
        top.position.y = 1.25;
        top.castShadow = top.receiveShadow = true;

        group.add(base, top);
        group.position.set(data.x, 0, data.z);
        return { mesh: group, w: 6.2, d: 2.2 };
    }
}
