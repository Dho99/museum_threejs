import * as THREE from "three";
import ProceduralTextures from "../materials/ProceduralTextures.js";

/**
 * ObjectFactory
 * Factory untuk membuat berbagai objek 3D museum
 */
export default class ObjectFactory {
    constructor(materials) {
        this.mats = materials;
        this.instanceDummy = new THREE.Object3D();
        this.geometries = {
            vitrinePedestal: new THREE.BoxGeometry(1.5, 3, 1.5),
            vitrineGlass: new THREE.BoxGeometry(1.4, 1.5, 1.4),
            artifactRing: new THREE.TorusGeometry(0.3, 0.1, 12, 24),
            crownBand: new THREE.CylinderGeometry(0.56, 0.62, 0.28, 32, 1, true),
            crownPeak: new THREE.ConeGeometry(0.12, 0.45, 4),
            ringGem: new THREE.OctahedronGeometry(0.16, 0),
            necklaceBead: new THREE.SphereGeometry(0.085, 12, 8),
            necklacePendant: new THREE.OctahedronGeometry(0.22, 0),
            mysteryCrystal: new THREE.IcosahedronGeometry(0.42, 1),
            lobbyPedestal: new THREE.CylinderGeometry(2.2, 2.5, 1.2, 36),
            lobbyPlinth: new THREE.CylinderGeometry(2.55, 2.75, 0.28, 36),
            demonCranium: new THREE.SphereGeometry(1, 32, 20),
            demonJaw: new THREE.BoxGeometry(1.15, 0.62, 0.86),
            demonSnout: new THREE.SphereGeometry(0.55, 20, 12),
            demonEyeSocket: new THREE.SphereGeometry(0.18, 16, 10),
            demonNasalHole: new THREE.ConeGeometry(0.16, 0.38, 3),
            demonHornCurve: new THREE.TorusGeometry(0.55, 0.12, 12, 32, Math.PI * 1.18),
            demonHornTip: new THREE.ConeGeometry(0.18, 0.46, 16),
            demonTooth: new THREE.ConeGeometry(0.055, 0.32, 8),
            barrierPost: new THREE.CylinderGeometry(0.08, 0.11, 1.15, 14),
            barrierCap: new THREE.SphereGeometry(0.15, 14, 10),
            labelPlate: new THREE.BoxGeometry(0.8, 0.4, 0.05),
            statuePedestal: new THREE.CylinderGeometry(1.5, 1.5, 2, 24),
            statueCone: new THREE.ConeGeometry(1, 2, 4),
            abstractBox: new THREE.BoxGeometry(1, 1, 1),
            abstractCylinder: new THREE.CylinderGeometry(0.5, 0.5, 1.5, 20),
            vasePedestal: new THREE.BoxGeometry(1, 2, 1),
            vaseBody: new THREE.SphereGeometry(0.6, 24, 16),
            vaseNeck: new THREE.CylinderGeometry(0.2, 0.4, 0.5, 20),
            benchSeat: new THREE.BoxGeometry(4, 0.2, 1),
            benchLeg: new THREE.BoxGeometry(0.2, 0.6, 0.8),
            plantPot: new THREE.CylinderGeometry(0.5, 0.4, 0.8, 16),
            plantLeaf: new THREE.SphereGeometry(0.4, 8, 8),
            signage: new THREE.PlaneGeometry(6, 1.5),
            signageGlow: new THREE.PlaneGeometry(6.8, 2.1),
            receptionBase: new THREE.BoxGeometry(6, 1.2, 2),
            receptionTop: new THREE.BoxGeometry(6.2, 0.1, 2.2),
        };
        this.artifactMats = {
            ruby: new THREE.MeshStandardMaterial({
                color: 0xb91646,
                emissive: 0x300010,
                roughness: 0.25,
                metalness: 0.05,
            }),
            sapphire: new THREE.MeshStandardMaterial({
                color: 0x1f6feb,
                emissive: 0x061533,
                roughness: 0.2,
                metalness: 0.05,
            }),
            emerald: new THREE.MeshStandardMaterial({
                color: 0x13a66b,
                emissive: 0x06301f,
                roughness: 0.25,
                metalness: 0.05,
            }),
            crystal: new THREE.MeshStandardMaterial({
                color: 0x8fe7ff,
                emissive: 0x12384a,
                roughness: 0.18,
                metalness: 0.15,
            }),
            bone: new THREE.MeshStandardMaterial({
                color: 0xd8cfb6,
                roughness: 0.82,
                metalness: 0.02,
            }),
            shadow: new THREE.MeshStandardMaterial({
                color: 0x11100f,
                roughness: 0.9,
            }),
            agedHorn: new THREE.MeshStandardMaterial({
                color: 0x6b5843,
                roughness: 0.72,
                side: THREE.DoubleSide,
            }),
            rope: new THREE.MeshStandardMaterial({
                color: 0x8b1f22,
                roughness: 0.78,
            }),
        };
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
        canvas.position.z = 0.035;

        const frameDepth = 0.08;
        const frameWidth = 0.18;
        const verticalGeo = new THREE.BoxGeometry(frameWidth, data.h + frameWidth * 2, frameDepth);
        const horizontalGeo = new THREE.BoxGeometry(data.w + frameWidth * 2, frameWidth, frameDepth);

        const frameLeft = new THREE.Mesh(verticalGeo, this.mats.darkWood);
        frameLeft.position.set(-data.w / 2 - frameWidth / 2, 0, 0.02);

        const frameRight = new THREE.Mesh(verticalGeo, this.mats.darkWood);
        frameRight.position.set(data.w / 2 + frameWidth / 2, 0, 0.02);

        const frameTop = new THREE.Mesh(horizontalGeo, this.mats.darkWood);
        frameTop.position.set(0, data.h / 2 + frameWidth / 2, 0.02);

        const frameBottom = new THREE.Mesh(horizontalGeo, this.mats.darkWood);
        frameBottom.position.set(0, -data.h / 2 - frameWidth / 2, 0.02);

        frameLeft.castShadow =
            frameRight.castShadow =
            frameTop.castShadow =
            frameBottom.castShadow =
                true;

        group.add(frameLeft, frameRight, frameTop, frameBottom, canvas);
        group.position.set(data.x, data.y, data.z);
        group.rotation.y = data.rot;

        this.makeInteractable(group, data.title, data.desc);
        return group;
    }

    createArtifact(data) {
        const title = data.title.toLowerCase();

        if (title.includes("mahkota")) return this.createCrownArtifact();
        if (title.includes("cincin")) return this.createRingArtifact();
        if (title.includes("kalung")) return this.createNecklaceArtifact();

        return this.createMysteryArtifact();
    }

    createCrownArtifact() {
        const group = new THREE.Group();

        const band = new THREE.Mesh(this.geometries.crownBand, this.mats.metalGold);
        band.position.y = 0;
        band.castShadow = true;
        group.add(band);

        for (let i = 0; i < 7; i++) {
            const angle = (i / 7) * Math.PI * 2;
            const peak = new THREE.Mesh(
                this.geometries.crownPeak,
                this.mats.metalGold,
            );
            peak.position.set(Math.sin(angle) * 0.48, 0.35, Math.cos(angle) * 0.48);
            peak.rotation.y = angle + Math.PI / 4;
            peak.castShadow = true;

            const gem = new THREE.Mesh(this.geometries.ringGem, this.artifactMats.ruby);
            gem.position.set(
                Math.sin(angle) * 0.48,
                0.62,
                Math.cos(angle) * 0.48,
            );
            gem.scale.setScalar(i === 0 ? 1.15 : 0.82);
            gem.castShadow = true;

            group.add(peak, gem);
        }

        group.position.y = 3.45;
        group.scale.setScalar(0.82);
        return group;
    }

    createRingArtifact() {
        const group = new THREE.Group();

        const ring = new THREE.Mesh(this.geometries.artifactRing, this.mats.metalGold);
        ring.scale.set(1.35, 1.35, 1.35);
        ring.castShadow = true;

        const setting = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.1, 0.22),
            this.mats.metalGold,
        );
        setting.position.y = 0.34;
        setting.castShadow = true;

        const gem = new THREE.Mesh(this.geometries.ringGem, this.artifactMats.sapphire);
        gem.position.y = 0.5;
        gem.scale.set(1, 1.2, 1);
        gem.castShadow = true;

        group.add(ring, setting, gem);
        group.position.y = 3.52;
        return group;
    }

    createNecklaceArtifact() {
        const group = new THREE.Group();
        const beads = new THREE.InstancedMesh(
            this.geometries.necklaceBead,
            this.mats.metalGold,
            21,
        );

        for (let i = 0; i < 21; i++) {
            const t = i / 20;
            const angle = Math.PI * (0.12 + t * 0.76);
            const x = Math.cos(angle) * 0.72;
            const y = -Math.sin(angle) * 0.5 + 0.3;
            this.instanceDummy.position.set(x, y, 0);
            this.instanceDummy.rotation.set(0, 0, 0);
            this.instanceDummy.scale.setScalar(1);
            this.instanceDummy.updateMatrix();
            beads.setMatrixAt(i, this.instanceDummy.matrix);
        }
        beads.castShadow = true;

        const pendant = new THREE.Mesh(
            this.geometries.necklacePendant,
            this.artifactMats.emerald,
        );
        pendant.position.set(0, -0.28, 0);
        pendant.rotation.z = Math.PI / 4;
        pendant.castShadow = true;

        group.add(beads, pendant);
        group.position.y = 3.78;
        group.rotation.x = -0.15;
        return group;
    }

    createMysteryArtifact() {
        const group = new THREE.Group();

        const crystal = new THREE.Mesh(
            this.geometries.mysteryCrystal,
            this.artifactMats.crystal,
        );
        crystal.rotation.set(0.4, 0.8, 0.2);
        crystal.castShadow = true;

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 16, 12),
            this.artifactMats.sapphire,
        );
        core.scale.set(1, 0.65, 1);
        core.castShadow = true;

        group.add(crystal, core);
        group.position.y = 3.55;
        return group;
    }

    createLobbyArtifact(data) {
        const group = new THREE.Group();

        const base = new THREE.Mesh(this.geometries.lobbyPlinth, this.mats.floor);
        base.position.y = 0.14;
        base.castShadow = base.receiveShadow = true;

        const pedestal = new THREE.Mesh(this.geometries.lobbyPedestal, this.mats.darkWood);
        pedestal.position.y = 0.88;
        pedestal.castShadow = pedestal.receiveShadow = true;

        const skull = this.createDemonSkull();
        skull.position.y = 2.15;
        skull.scale.setScalar(1.55);

        const label = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.42, 0.06),
            this.mats.metalDark,
        );
        label.position.set(0, 1.05, 2.28);
        label.rotation.x = -0.22;
        label.castShadow = true;

        const barrier = this.createRopeBarrier(6.6, 5.6);
        barrier.position.y = 0;

        group.add(base, pedestal, skull, label, barrier);
        group.position.set(data.x, 0, data.z);
        group.rotation.y = data.rot ?? 0;

        this.makeInteractable(skull, data.title, data.desc);
        return { mesh: group, w: 6.6, d: 5.6 };
    }

    createDemonSkull() {
        const group = new THREE.Group();

        const cranium = new THREE.Mesh(this.geometries.demonCranium, this.artifactMats.bone);
        cranium.scale.set(1.05, 0.88, 0.95);
        cranium.position.y = 0.46;
        cranium.castShadow = true;

        const snout = new THREE.Mesh(this.geometries.demonSnout, this.artifactMats.bone);
        snout.scale.set(0.95, 0.58, 0.72);
        snout.position.set(0, 0.1, 0.58);
        snout.castShadow = true;

        const jaw = new THREE.Mesh(this.geometries.demonJaw, this.artifactMats.bone);
        jaw.position.set(0, -0.5, 0.32);
        jaw.scale.set(1, 0.9, 0.95);
        jaw.castShadow = true;

        group.add(cranium, snout, jaw);

        [-0.38, 0.38].forEach((x) => {
            const socket = new THREE.Mesh(
                this.geometries.demonEyeSocket,
                this.artifactMats.shadow,
            );
            socket.position.set(x, 0.32, 0.92);
            socket.scale.set(1.45, 1.2, 0.35);
            socket.castShadow = true;
            group.add(socket);
        });

        const nose = new THREE.Mesh(
            this.geometries.demonNasalHole,
            this.artifactMats.shadow,
        );
        nose.position.set(0, -0.05, 1.06);
        nose.rotation.x = Math.PI / 2;
        nose.scale.set(0.9, 1.05, 1.15);
        group.add(nose);

        [-0.46, -0.28, -0.1, 0.1, 0.28, 0.46].forEach((x, i) => {
            const tooth = new THREE.Mesh(this.geometries.demonTooth, this.artifactMats.bone);
            tooth.position.set(x, -0.77, 0.78);
            tooth.rotation.x = Math.PI;
            tooth.scale.setScalar(i === 0 || i === 5 ? 1.18 : 0.92);
            tooth.castShadow = true;
            group.add(tooth);
        });

        [-1, 1].forEach((side) => {
            const hornRoot = new THREE.Mesh(
                this.geometries.demonHornCurve,
                this.artifactMats.agedHorn,
            );
            hornRoot.position.set(side * 0.72, 0.82, 0.05);
            hornRoot.rotation.set(0.35, side > 0 ? -0.35 : 0.35, side > 0 ? -1.2 : 1.2);
            hornRoot.scale.set(side, 1, 1);
            hornRoot.castShadow = true;

            const tip = new THREE.Mesh(this.geometries.demonHornTip, this.artifactMats.agedHorn);
            tip.position.set(side * 1.58, 1.12, -0.1);
            tip.rotation.set(0.65, 0, side > 0 ? -0.72 : 0.72);
            tip.castShadow = true;
            group.add(hornRoot, tip);
        });

        return group;
    }

    createRopeBarrier(width, depth) {
        const group = new THREE.Group();
        const halfW = width / 2;
        const halfD = depth / 2;
        const postY = 0.58;
        const corners = [
            [-halfW, -halfD],
            [halfW, -halfD],
            [halfW, halfD],
            [-halfW, halfD],
        ];

        corners.forEach(([x, z]) => {
            const post = new THREE.Mesh(this.geometries.barrierPost, this.mats.metalGold);
            post.position.set(x, postY, z);
            post.castShadow = post.receiveShadow = true;

            const cap = new THREE.Mesh(this.geometries.barrierCap, this.mats.metalGold);
            cap.position.set(x, 1.18, z);
            cap.castShadow = true;
            group.add(post, cap);
        });

        for (let i = 0; i < corners.length; i++) {
            const start = new THREE.Vector3(corners[i][0], 0.98, corners[i][1]);
            const endCorner = corners[(i + 1) % corners.length];
            const end = new THREE.Vector3(endCorner[0], 0.98, endCorner[1]);
            group.add(this.createCylinderBetween(start, end, 0.045, this.artifactMats.rope));
        }

        return group;
    }

    createCylinderBetween(start, end, radius, material) {
        const length = start.distanceTo(end);
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(radius, radius, length, 12),
            material,
        );
        mesh.position.copy(start).add(end).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            end.clone().sub(start).normalize(),
        );
        mesh.castShadow = mesh.receiveShadow = true;
        return mesh;
    }

    /**
     * Membuat vitrine (display case) dengan artefak
     */
    createVitrine(data) {
        const group = new THREE.Group();

        // Pedestal
        const ped = new THREE.Mesh(
            this.geometries.vitrinePedestal,
            this.mats.wall,
        );
        ped.position.y = 1.5;
        ped.castShadow = ped.receiveShadow = true;

        // Glass display case
        const glass = new THREE.Mesh(
            this.geometries.vitrineGlass,
            this.mats.glass,
        );
        glass.position.y = 3.75;

        // Artefak dibuat sesuai nama koleksi di MuseumConfig.
        const arti = this.createArtifact(data);

        // Label plate
        const plate = new THREE.Mesh(
            this.geometries.labelPlate,
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
            this.geometries.statuePedestal,
            this.mats.floor,
        );
        ped.position.y = 1;
        ped.castShadow = ped.receiveShadow = true;

        // Patung - tipe cone atau abstract
        let statue;
        if (data.type === "cone") {
            statue = new THREE.Mesh(
                this.geometries.statueCone,
                this.mats.metalGold,
            );
        } else {
            // Abstract - kombinasi box dan cylinder
            statue = new THREE.Group();
            const b1 = new THREE.Mesh(
                this.geometries.abstractBox,
                this.mats.stone,
            );
            b1.position.y = 0.5;
            b1.rotation.y = Math.PI / 4;
            const c1 = new THREE.Mesh(
                this.geometries.abstractCylinder,
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
            this.geometries.vasePedestal,
            this.mats.wood,
        );
        ped.position.y = 1;
        ped.castShadow = true;

        // Badan vas (sphere scaled)
        const vase = new THREE.Mesh(
            this.geometries.vaseBody,
            this.mats.stone,
        );
        vase.scale.set(1, 1.5, 1);
        vase.position.y = 2.5;
        vase.castShadow = true;

        // Leher vas
        const neck = new THREE.Mesh(
            this.geometries.vaseNeck,
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
            this.geometries.benchSeat,
            this.mats.wood,
        );
        seat.position.y = 0.6;
        seat.castShadow = seat.receiveShadow = true;

        // Kaki
        const leg1 = new THREE.Mesh(this.geometries.benchLeg, this.mats.metalDark);
        leg1.position.set(-1.5, 0.3, 0);
        const leg2 = new THREE.Mesh(this.geometries.benchLeg, this.mats.metalDark);
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
            this.geometries.plantPot,
            this.mats.metalDark,
        );
        pot.position.y = 0.4;
        pot.castShadow = true;
        group.add(pot);

        // Daun (6 instances dalam satu draw call)
        const leaves = new THREE.InstancedMesh(
            this.geometries.plantLeaf,
            this.mats.leaf,
            6,
        );
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.instanceDummy.position.set(
                Math.sin(angle) * 0.5,
                0.8,
                Math.cos(angle) * 0.5,
            );
            this.instanceDummy.rotation.set(0.6, angle, 0);
            this.instanceDummy.scale.set(1, 0.1, 3);
            this.instanceDummy.updateMatrix();
            leaves.setMatrixAt(i, this.instanceDummy.matrix);
        }
        leaves.castShadow = true;
        group.add(leaves);

        group.position.set(data.x, 0, data.z);
        return { mesh: group, w: 1.5, d: 1.5 };
    }

    /**
     * Membuat papan informasi (signage)
     */
    createSignage(data) {
        const group = new THREE.Group();
        const tex = ProceduralTextures.createSignageTexture(data.text);
        const mat = new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.DoubleSide,
            toneMapped: false,
        });

        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x65dcff,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
        });

        const glow = new THREE.Mesh(this.geometries.signageGlow, glowMat);
        glow.position.z = -0.02;

        const board = new THREE.Mesh(this.geometries.signage, mat);
        board.position.z = 0.01;

        const light = new THREE.PointLight(0x8ceeff, 0.18, 2.8, 2.4);
        light.position.set(0, 0, 0.45);

        group.add(glow, board, light);
        group.position.set(data.x, data.y, data.z);
        group.rotation.y = data.rot;
        return group;
    }

    /**
     * Membuat meja resepsionis
     */
    createReception(data) {
        const group = new THREE.Group();

        // Base meja
        const base = new THREE.Mesh(
            this.geometries.receptionBase,
            this.mats.wood,
        );
        base.position.y = 0.6;
        base.castShadow = base.receiveShadow = true;

        // Top dengan material floor (marble)
        const top = new THREE.Mesh(
            this.geometries.receptionTop,
            this.mats.floor,
        );
        top.position.y = 1.25;
        top.castShadow = top.receiveShadow = true;

        group.add(base, top);
        group.position.set(data.x, 0, data.z);
        return { mesh: group, w: 6.2, d: 2.2 };
    }
}
