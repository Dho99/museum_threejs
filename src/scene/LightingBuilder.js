import * as THREE from "three";

/**
 * LightingBuilder
 * Menangani pembuatan dan setup semua pencahayaan dalam scene
 */
export default class LightingBuilder {
    /**
     * Membangun sistem pencahayaan dasar museum
     */
    static build(scene, config) {
        const lightCfg = config.lighting;

        // 1. Hemisphere Light - ambience alami dari langit dan tanah
        const hemiLight = new THREE.HemisphereLight(
            0xffffff,
            0xe0e0e0,
            lightCfg.hemisphereLightIntensity,
        );
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // 2. Directional Light - cahaya utama (fill light)
        const dirLight = new THREE.DirectionalLight(
            0xfffaee,
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
        scene.add(
            new THREE.AmbientLight(0xffffff, lightCfg.ambientLightIntensity),
        );
    }

    /**
     * Menambah spotlight untuk menyorot objek tertentu (lukisan, artefak)
     */
    static addSpotlight(scene, x, y, z, tx, ty, tz, config) {
        const lightCfg = config.lighting;

        const spot = new THREE.SpotLight(0xfff5e6, lightCfg.spotlightIntensity);
        spot.position.set(x, y, z);
        spot.angle = lightCfg.spotlightAngle;
        spot.penumbra = lightCfg.spotlightPenumbra;
        spot.castShadow = true;
        spot.shadow.bias = config.renderer.shadowBias;

        // Target object untuk spotlight
        const target = new THREE.Object3D();
        target.position.set(tx, ty, tz);
        scene.add(target);
        spot.target = target;

        scene.add(spot);
    }
}
