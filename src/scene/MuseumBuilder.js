import * as THREE from "three";
import { MuseumConfig } from "./MuseumConfig.js";
import LightingBuilder from "./LightingBuilder.js";
import ObjectFactory from "../objects/ObjectFactory.js";

/**
 * MuseumBuilder
 * Bertanggung jawab membangun seluruh arsitektur dan dekorasi museum
 */
export default class MuseumBuilder {
    constructor(scene, collisions, materials) {
        this.scene = scene;
        this.col = collisions;
        this.mats = materials;
        this.factory = new ObjectFactory(materials);
        this.interactables = [];
    }

    /**
     * Build semua elemen museum
     */
    build() {
        this.buildArchitecture();
        LightingBuilder.build(this.scene, MuseumConfig);
        this.buildDecorations();
        return this.interactables;
    }

    /**
     * Membangun struktur arsitektur: lantai, dinding, ceiling
     */
    buildArchitecture() {
        const lay = MuseumConfig.layout;

        // ===== FLOOR =====
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(lay.width, lay.depth),
            this.mats.floor,
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        floor.material.map.repeat.set(lay.width / 10, lay.depth / 10);
        this.scene.add(floor);

        // ===== CEILING =====
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(lay.width, lay.depth),
            this.mats.wall,
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = lay.height;
        this.scene.add(ceiling);

        // ===== OUTER WALLS =====
        const addWall = (x, z, w, d) => {
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(w, lay.height, d),
                this.mats.wall,
            );
            wall.material.map.repeat.set(Math.max(w, d) / 5, lay.height / 5);
            wall.position.set(x, lay.height / 2, z);
            wall.receiveShadow = wall.castShadow = true;
            this.scene.add(wall);
            // Tambah collision box
            this.col.addBox(x, z, w, d);
        };

        const t = 1;
        addWall(0, -lay.depth / 2, lay.width, t); // North
        addWall(0, lay.depth / 2, lay.width, t); // South
        addWall(-lay.width / 2, 0, t, lay.depth); // West
        addWall(lay.width / 2, 0, t, lay.depth); // East

        // ===== INNER PARTITIONS =====
        MuseumConfig.walls.forEach((w) => addWall(w.x, w.z, w.w, w.d));

        // ===== CARPETS =====
        MuseumConfig.carpets.forEach((c) => {
            const mat =
                c.color === "blue" ? this.mats.carpetBlue : this.mats.carpetRed;
            const carpet = new THREE.Mesh(
                new THREE.PlaneGeometry(c.w, c.d),
                mat,
            );
            carpet.rotation.x = -Math.PI / 2;
            carpet.position.set(c.x, 0.02, c.z); // Slightly above floor
            carpet.receiveShadow = true;
            this.scene.add(carpet);
        });
    }

    /**
     * Membangun semua dekorasi: signages, paintings, vitrines, statues, dll
     */
    buildDecorations() {
        // ===== SIGNAGES =====
        MuseumConfig.signs.forEach((data) =>
            this.scene.add(this.factory.createSignage(data)),
        );

        // ===== PAINTINGS =====
        MuseumConfig.paintings.forEach((data) => {
            const p = this.factory.createPainting(data);
            this.scene.add(p);
            this.interactables.push(...p.children);

            // Spotlight untuk setiap painting
            LightingBuilder.addSpotlight(
                this.scene,
                data.x + (data.rot === 0 ? 0 : data.rot > 0 ? 4 : -4),
                10,
                data.z + (data.rot === 0 ? 4 : 0),
                data.x,
                data.y,
                data.z,
                MuseumConfig,
            );
        });

        // ===== VITRINES (Display Cases) =====
        MuseumConfig.vitrines.forEach((data) => {
            const obj = this.factory.createVitrine(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
            this.interactables.push(...obj.mesh.children);

            LightingBuilder.addSpotlight(
                this.scene,
                data.x,
                10,
                data.z,
                data.x,
                0,
                data.z,
                MuseumConfig,
            );
        });

        // ===== STATUES =====
        MuseumConfig.statues.forEach((data) => {
            const obj = this.factory.createStatue(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
            this.interactables.push(...obj.mesh.children);

            LightingBuilder.addSpotlight(
                this.scene,
                data.x,
                10,
                data.z,
                data.x,
                0,
                data.z,
                MuseumConfig,
            );
        });

        // ===== VASES =====
        MuseumConfig.vases.forEach((data) => {
            const obj = this.factory.createVase(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
            this.interactables.push(...obj.mesh.children);
        });

        // ===== BENCHES =====
        MuseumConfig.benches.forEach((data) => {
            const obj = this.factory.createBench(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
        });

        // ===== PLANTS =====
        MuseumConfig.plants.forEach((data) => {
            const obj = this.factory.createPlant(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
        });

        // ===== RECEPTION =====
        const recData = MuseumConfig.reception;
        const rec = this.factory.createReception(recData);
        this.scene.add(rec.mesh);
        this.col.addBox(recData.x, recData.z, rec.w, rec.d);
    }
}
