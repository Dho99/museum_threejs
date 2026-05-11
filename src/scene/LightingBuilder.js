import * as THREE from "three";

/**
 * LightingBuilder
 * Menangani pembuatan dan setup semua pencahayaan dalam scene
 */
export default class LightingBuilder {
    static fixtureGeometry = new THREE.CylinderGeometry(0.18, 0.28, 0.22, 16);

    static wallPlateGeometry = new THREE.BoxGeometry(0.48, 0.58, 0.1);

    static roofPlateGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16);

    static ceilingLightBodyGeometry = new THREE.CylinderGeometry(0.52, 0.62, 0.12, 32);

    static ceilingLightDiffuserGeometry = new THREE.CylinderGeometry(0.44, 0.44, 0.035, 32);

    static ceilingLightTrimGeometry = new THREE.TorusGeometry(0.54, 0.045, 10, 32);

    static fixtureMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2a24,
        metalness: 0.45,
        roughness: 0.35,
        emissive: 0xffd28a,
        emissiveIntensity: 0.45,
    });

    static mountMaterial = new THREE.MeshStandardMaterial({
        color: 0x24211d,
        metalness: 0.55,
        roughness: 0.32,
    });

    static ceilingDiffuserMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff2d0,
        emissive: 0xffe3a2,
        emissiveIntensity: 1.75,
        roughness: 0.18,
        metalness: 0.02,
    });

    /**
     * Membangun sistem pencahayaan dasar museum
     */
    static build(scene, config) {
        const lightCfg = config.lighting;

        // 1. Hemisphere Light - ambience alami dari langit dan tanah
        const hemiLight = new THREE.HemisphereLight(
            0xd6e3ff,
            0x1a1714,
            lightCfg.hemisphereLightIntensity,
        );
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // 2. Directional Light - cahaya utama (fill light)
        const dirLight = new THREE.DirectionalLight(
            0xfff0d0,
            lightCfg.directionalLightIntensity,
        );
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 30;
        dirLight.shadow.camera.bottom = -30;
        dirLight.shadow.camera.left = -40;
        dirLight.shadow.camera.right = 40;
        dirLight.shadow.bias = config.renderer.shadowBias;
        dirLight.shadow.mapSize.width = config.renderer.shadowMapSize;
        dirLight.shadow.mapSize.height = config.renderer.shadowMapSize;
        scene.add(dirLight);

        // 3. Ambient Light - pencahayaan global subtle
        scene.add(new THREE.AmbientLight(0xfff1dd, lightCfg.ambientLightIntensity));

        LightingBuilder.addCeilingLightGrid(scene, config);
    }

    static addCeilingLightGrid(scene, config) {
        const lay = config.layout;
        const lightCfg = config.lighting;
        const bodyY = lay.height - 0.075;
        const diffuserY = lay.height - 0.145;
        const cols = 4;
        const rows = 4;
        const startX = -lay.width / 2 + 12;
        const endX = lay.width / 2 - 12;
        const startZ = -lay.depth / 2 + 9;
        const endZ = lay.depth / 2 - 9;
        const group = new THREE.Group();

        for (let ix = 0; ix < cols; ix++) {
            const x = THREE.MathUtils.lerp(startX, endX, ix / (cols - 1));

            for (let iz = 0; iz < rows; iz++) {
                const z = THREE.MathUtils.lerp(startZ, endZ, iz / (rows - 1));
                const body = new THREE.Mesh(
                    LightingBuilder.ceilingLightBodyGeometry,
                    LightingBuilder.mountMaterial,
                );
                body.position.set(x, bodyY, z);
                body.castShadow = body.receiveShadow = true;

                const trim = new THREE.Mesh(
                    LightingBuilder.ceilingLightTrimGeometry,
                    LightingBuilder.mountMaterial,
                );
                trim.rotation.x = Math.PI / 2;
                trim.position.set(x, diffuserY - 0.006, z);
                trim.castShadow = trim.receiveShadow = true;

                const diffuser = new THREE.Mesh(
                    LightingBuilder.ceilingLightDiffuserGeometry,
                    LightingBuilder.ceilingDiffuserMaterial.clone(),
                );
                diffuser.position.set(x, diffuserY, z);
                diffuser.userData.isGalleryFixture = true;
                diffuser.userData.onEmissiveIntensity = diffuser.material.emissiveIntensity;

                group.add(body, trim, diffuser);

                const point = new THREE.PointLight(
                    0xffefd0,
                    lightCfg.ceilingPointLightIntensity,
                    lightCfg.ceilingPointLightDistance,
                    lightCfg.ceilingPointLightDecay,
                );
                point.position.set(x, lay.height - 0.55, z);
                point.castShadow = false;
                point.userData.isGalleryLight = true;
                point.userData.onIntensity = lightCfg.ceilingPointLightIntensity;
                group.add(point);
            }
        }

        scene.add(group);
    }

    /**
     * Menambah spotlight untuk menyorot objek tertentu (lukisan, artefak)
     */
    static addSpotlight(scene, x, y, z, tx, ty, tz, config, options = {}) {
        const lightCfg = config.lighting;

        const spot = new THREE.SpotLight(0xfff5e6, lightCfg.spotlightIntensity);
        spot.position.set(x, y, z);
        spot.angle = lightCfg.spotlightAngle;
        spot.penumbra = lightCfg.spotlightPenumbra;
        spot.distance = lightCfg.spotlightDistance;
        spot.decay = lightCfg.spotlightDecay;
        spot.castShadow = config.renderer.enableSpotlightShadows;
        spot.shadow.bias = config.renderer.shadowBias;
        spot.shadow.normalBias = 0.03;
        spot.shadow.mapSize.width = 256;
        spot.shadow.mapSize.height = 256;
        spot.shadow.camera.near = 0.5;
        spot.shadow.camera.far = lightCfg.spotlightDistance;
        spot.shadow.camera.fov = THREE.MathUtils.radToDeg(lightCfg.spotlightAngle * 2);
        spot.shadow.camera.updateProjectionMatrix();
        spot.userData.isGalleryLight = true;
        spot.userData.onIntensity = lightCfg.spotlightIntensity;

        // Target object untuk spotlight
        const target = new THREE.Object3D();
        target.position.set(tx, ty, tz);
        scene.add(target);
        spot.target = target;

        scene.add(spot);

        LightingBuilder.addFixture(scene, spot.position, target.position, config, options);
    }

    static addFixture(scene, lightPosition, targetPosition, config, options) {
        const fixture = new THREE.Mesh(
            LightingBuilder.fixtureGeometry,
            LightingBuilder.fixtureMaterial.clone(),
        );
        fixture.position.copy(lightPosition);
        fixture.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            targetPosition.clone().sub(lightPosition).normalize(),
        );
        fixture.userData.isGalleryFixture = true;
        fixture.userData.onEmissiveIntensity = fixture.material.emissiveIntensity;
        scene.add(fixture);

        if (options.mount === "wall") {
            LightingBuilder.addWallMount(scene, lightPosition, targetPosition);
            return;
        }

        if (options.mount === "roof") {
            LightingBuilder.addRoofMount(scene, lightPosition, options.roofY);
            return;
        }

        LightingBuilder.addCeilingMount(scene, lightPosition, config.layout.height);
    }

    static addWallMount(scene, lightPosition, targetPosition) {
        const horizontal = new THREE.Vector3(
            lightPosition.x - targetPosition.x,
            0,
            lightPosition.z - targetPosition.z,
        );

        if (horizontal.lengthSq() < 0.01) {
            return;
        }

        const normal = horizontal.normalize();
        const wallAnchor = new THREE.Vector3(
            targetPosition.x,
            lightPosition.y,
            targetPosition.z,
        );
        const armStart = wallAnchor.clone().addScaledVector(normal, 0.08);
        const armEnd = lightPosition.clone().addScaledVector(normal, -0.16);

        const plate = new THREE.Mesh(
            LightingBuilder.wallPlateGeometry,
            LightingBuilder.mountMaterial,
        );
        plate.position.copy(wallAnchor).addScaledVector(normal, 0.055);
        plate.lookAt(plate.position.clone().add(normal));
        plate.castShadow = plate.receiveShadow = true;
        scene.add(plate);

        const arm = LightingBuilder.createCylinderBetween(
            armStart,
            armEnd,
            0.055,
            LightingBuilder.mountMaterial,
        );
        scene.add(arm);
    }

    static addRoofMount(scene, lightPosition, roofY) {
        const anchorY = roofY ?? lightPosition.y + 0.35;
        const anchor = new THREE.Vector3(lightPosition.x, anchorY, lightPosition.z);
        const stemEnd = lightPosition.clone().add(new THREE.Vector3(0, 0.18, 0));

        if (anchor.y > stemEnd.y + 0.04) {
            const stem = LightingBuilder.createCylinderBetween(
                anchor,
                stemEnd,
                0.045,
                LightingBuilder.mountMaterial,
            );
            scene.add(stem);
        }

        const fixture = new THREE.Mesh(
            LightingBuilder.roofPlateGeometry,
            LightingBuilder.mountMaterial,
        );
        fixture.position.copy(anchor);
        fixture.castShadow = fixture.receiveShadow = true;
        scene.add(fixture);
    }

    static addCeilingMount(scene, lightPosition, ceilingY) {
        const anchor = new THREE.Vector3(lightPosition.x, ceilingY - 0.04, lightPosition.z);
        const stemEnd = lightPosition.clone().add(new THREE.Vector3(0, 0.18, 0));

        if (anchor.y > stemEnd.y + 0.05) {
            const stem = LightingBuilder.createCylinderBetween(
                anchor,
                stemEnd,
                0.035,
                LightingBuilder.mountMaterial,
            );
            scene.add(stem);
        }

        const plate = new THREE.Mesh(
            LightingBuilder.roofPlateGeometry,
            LightingBuilder.mountMaterial,
        );
        plate.position.copy(anchor);
        plate.castShadow = plate.receiveShadow = true;
        scene.add(plate);
    }

    static createCylinderBetween(start, end, radius, material) {
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
}
