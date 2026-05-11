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
            this.createWallMaterial(lay.width / 8, lay.depth / 8),
        );
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = lay.height;
        this.scene.add(ceiling);

        // ===== OUTER WALLS =====
        const addWall = (x, z, w, d) => {
            const wallMat = this.createWallMaterial(
                Math.max(w, d) / 5,
                lay.height / 5,
            );
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(w, lay.height, d),
                wallMat,
            );
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

    createWallMaterial(repeatX, repeatY) {
        const mat = this.mats.wall.clone();
        if (this.mats.wall.map) {
            mat.map = this.mats.wall.map.clone();
            mat.map.repeat.set(repeatX, repeatY);
            mat.map.needsUpdate = true;
        }
        return mat;
    }

    /**
     * Menambah detail museum pada permukaan dinding tanpa shader berat.
     */
    buildWallDetails(lay) {
        const wallHalf = 0.5;

        this.addWallFaceDetails("x", 0, -lay.depth / 2 + wallHalf, 1, lay.width - 2, true);
        this.addWallFaceDetails("x", 0, lay.depth / 2 - wallHalf, -1, lay.width - 2, true);
        this.addWallFaceDetails("z", -lay.width / 2 + wallHalf, 0, 1, lay.depth - 2, true);
        this.addWallFaceDetails("z", lay.width / 2 - wallHalf, 0, -1, lay.depth - 2, true);

        MuseumConfig.walls.forEach((w) => {
            if (w.w > w.d) {
                this.addWallFaceDetails("x", w.x, w.z - w.d / 2, -1, w.w, false);
                this.addWallFaceDetails("x", w.x, w.z + w.d / 2, 1, w.w, false);
            } else {
                this.addWallFaceDetails("z", w.x - w.w / 2, w.z, -1, w.d, false);
                this.addWallFaceDetails("z", w.x + w.w / 2, w.z, 1, w.d, false);
            }
        });
    }

    addWallTrimBox(axis, center, surface, normal, y, length, height, thickness) {
        const geo =
            axis === "x"
                ? new THREE.BoxGeometry(length, height, thickness)
                : new THREE.BoxGeometry(thickness, height, length);
        const mesh = new THREE.Mesh(geo, this.mats.wallTrim);
        const fixed = surface + normal * (thickness / 2 + 0.004);

        if (axis === "x") {
            mesh.position.set(center, y, fixed);
        } else {
            mesh.position.set(fixed, y, center);
        }

        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    addWallFaceDetails(axis, center, surface, normal, length, includePanels) {
        if (length < 3) return;

        this.addWallTrimBox(axis, center, surface, normal, 0.18, length, 0.36, 0.08);

        if (!includePanels) return;

        this.addWallTrimBox(axis, center, surface, normal, 3.05, length, 0.1, 0.055);
        this.addWallTrimBox(axis, center, surface, normal, 11.35, length, 0.26, 0.085);

        const panels = Math.max(1, Math.floor(length / 11));
        const panelWidth = length / panels;
        const start = center - length / 2;

        for (let i = 0; i < panels; i++) {
            const panelCenter = start + panelWidth * (i + 0.5);
            const innerWidth = Math.max(1.8, panelWidth - 1.4);
            const left = panelCenter - innerWidth / 2;
            const right = panelCenter + innerWidth / 2;

            this.addWallTrimBox(axis, panelCenter, surface, normal, 4.15, innerWidth, 0.06, 0.04);
            this.addWallTrimBox(axis, panelCenter, surface, normal, 7.85, innerWidth, 0.06, 0.04);
            this.addWallTrimBox(axis, left, surface, normal, 6, 0.06, 3.7, 0.04);
            this.addWallTrimBox(axis, right, surface, normal, 6, 0.06, 3.7, 0.04);
        }
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
                { mount: "wall" },
            );
        });

        const artifactRoof = this.buildArtifactLightingRoof();

        // ===== LOBBY ARTIFACT =====
        MuseumConfig.lobbyArtifacts.forEach((data) => {
            const obj = this.factory.createLobbyArtifact(data);
            this.scene.add(obj.mesh);
            this.col.addBox(data.x, data.z, obj.w, obj.d);
            this.interactables.push(...obj.mesh.children);

            LightingBuilder.addSpotlight(
                this.scene,
                data.x,
                10,
                data.z + 1.5,
                data.x,
                3.4,
                data.z,
                MuseumConfig,
                { mount: "ceiling" },
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
                artifactRoof.lightY,
                data.z,
                data.x,
                3.35,
                data.z,
                MuseumConfig,
                { mount: "roof", roofY: artifactRoof.undersideY },
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
                2.6,
                data.z,
                MuseumConfig,
                { mount: "ceiling" },
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

    buildArtifactLightingRoof() {
        const vitrines = MuseumConfig.vitrines;
        const margin = 4;
        const minX = Math.min(...vitrines.map((v) => v.x)) - margin;
        const maxX = Math.max(...vitrines.map((v) => v.x)) + margin;
        const minZ = Math.min(...vitrines.map((v) => v.z)) - margin;
        const maxZ = Math.max(...vitrines.map((v) => v.z)) + margin;
        const centerX = (minX + maxX) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const width = maxX - minX;
        const depth = maxZ - minZ;
        const roofY = 9.9;
        const thickness = 0.35;
        const group = new THREE.Group();

        const canopy = new THREE.Mesh(
            new THREE.BoxGeometry(width, thickness, depth),
            this.mats.wallTrim,
        );
        canopy.position.y = roofY;
        canopy.castShadow = canopy.receiveShadow = true;

        const beamMat = this.mats.metalDark;
        const beamHeight = 0.18;
        const beamThickness = 0.18;
        const frontBeam = new THREE.Mesh(
            new THREE.BoxGeometry(width + beamThickness, beamHeight, beamThickness),
            beamMat,
        );
        const backBeam = frontBeam.clone();
        const leftBeam = new THREE.Mesh(
            new THREE.BoxGeometry(beamThickness, beamHeight, depth + beamThickness),
            beamMat,
        );
        const rightBeam = leftBeam.clone();

        frontBeam.position.set(0, roofY - thickness / 2 - beamHeight / 2, depth / 2);
        backBeam.position.set(0, roofY - thickness / 2 - beamHeight / 2, -depth / 2);
        leftBeam.position.set(-width / 2, roofY - thickness / 2 - beamHeight / 2, 0);
        rightBeam.position.set(width / 2, roofY - thickness / 2 - beamHeight / 2, 0);
        [frontBeam, backBeam, leftBeam, rightBeam].forEach((beam) => {
            beam.castShadow = beam.receiveShadow = true;
        });

        const rodHeight = MuseumConfig.layout.height - (roofY + thickness / 2);
        const rodY = roofY + thickness / 2 + rodHeight / 2;
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, rodHeight, 12);
        const plateGeo = new THREE.BoxGeometry(0.45, 0.05, 0.45);
        const cornerInset = 0.6;
        const corners = [
            [-width / 2 + cornerInset, -depth / 2 + cornerInset],
            [width / 2 - cornerInset, -depth / 2 + cornerInset],
            [-width / 2 + cornerInset, depth / 2 - cornerInset],
            [width / 2 - cornerInset, depth / 2 - cornerInset],
        ];

        corners.forEach(([x, z]) => {
            const rod = new THREE.Mesh(rodGeo, beamMat);
            rod.position.set(x, rodY, z);
            rod.castShadow = rod.receiveShadow = true;

            const plate = new THREE.Mesh(plateGeo, beamMat);
            plate.position.set(x, MuseumConfig.layout.height - 0.03, z);
            plate.castShadow = plate.receiveShadow = true;
            group.add(rod, plate);
        });

        group.add(canopy, frontBeam, backBeam, leftBeam, rightBeam);
        group.position.set(centerX, 0, centerZ);
        this.scene.add(group);

        return {
            lightY: roofY - thickness / 2 - 0.42,
            undersideY: roofY - thickness / 2 - 0.04,
        };
    }
}
