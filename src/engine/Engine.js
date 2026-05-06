import * as THREE from "three";
import { MuseumConfig } from "../scene/MuseumConfig.js";
import InputManager from "./InputManager.js";
import CollisionSystem from "./CollisionSystem.js";
import CameraController from "./CameraController.js";
import MaterialFactory from "../materials/MaterialFactory.js";
import MuseumBuilder from "../scene/MuseumBuilder.js";

/**
 * Engine
 * Core engine yang mengatur lifecycle aplikasi dan koordinasi semua sistem
 */
export default class Engine {
    constructor() {
        // ===== RENDERER SETUP =====
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure =
            MuseumConfig.renderer.toneMappingExposure;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        const container = document.getElementById("canvas-container");
        if (container) {
            container.appendChild(this.renderer.domElement);
        }

        // ===== CLOCK =====
        this.clock = new THREE.Clock();

        // ===== SCENE SETUP =====
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(
            MuseumConfig.lighting.fogColor,
            MuseumConfig.lighting.fogDensity,
        );

        // ===== INPUT & COLLISION =====
        this.input = new InputManager();
        this.collisions = new CollisionSystem();

        // ===== CAMERA SETUP =====
        const camCfg = MuseumConfig.camera;
        this.camera = new THREE.PerspectiveCamera(
            camCfg.fov,
            window.innerWidth / window.innerHeight,
            camCfg.near,
            camCfg.far,
        );
        this.camera.position.set(
            camCfg.initialPosition.x,
            camCfg.initialPosition.y,
            camCfg.initialPosition.z,
        );

        // ===== CAMERA CONTROLLER =====
        this.camControl = new CameraController(
            this.camera,
            this.input,
            this.collisions,
            MuseumConfig,
        );

        // ===== BUILD MUSEUM =====
        const materials = new MaterialFactory();
        const builder = new MuseumBuilder(
            this.scene,
            this.collisions,
            materials,
        );
        this.interactables = builder.build();

        // ===== RAYCASTER & UI =====
        this.raycaster = new THREE.Raycaster();
        this.center = new THREE.Vector2(0, 0);
        this.hovered = null;

        this.uiPanel = document.getElementById("info-panel");
        this.uiTitle = document.getElementById("info-title");
        this.uiDesc = document.getElementById("info-desc");

        // ===== EVENT LISTENERS =====
        window.addEventListener("resize", () => this.onResize(), false);

        // ===== START ANIMATION LOOP =====
        this.loop();
    }

    /**
     * Handle window resize
     */
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Handle raycasting untuk interaksi dengan objek
     */
    handleRaycast() {
        if (!this.input.isLocked) {
            if (this.uiPanel) {
                this.uiPanel.style.display = "none";
            }
            return;
        }

        this.raycaster.setFromCamera(this.center, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.interactables,
            false,
        );

        if (intersects.length > 0 && intersects[0].distance < 8) {
            const hit = intersects[0].object;
            if (hit.userData.isInteractable) {
                if (this.hovered !== hit) {
                    // Reset hovered object
                    if (this.hovered && this.hovered.material) {
                        this.hovered.material.emissive.setHex(
                            this.hovered.userData.originalEmissive,
                        );
                    }
                    // Set new hovered object
                    this.hovered = hit;
                    if (hit.material) {
                        hit.material.emissive.setHex(0x333333); // Soft highlight
                    }
                    if (this.uiTitle && this.uiDesc && this.uiPanel) {
                        this.uiTitle.innerText = hit.userData.title;
                        this.uiDesc.innerText = hit.userData.description;
                        this.uiPanel.style.display = "block";
                    }
                }
            }
        } else if (this.hovered) {
            if (this.hovered.material) {
                this.hovered.material.emissive.setHex(
                    this.hovered.userData.originalEmissive,
                );
            }
            this.hovered = null;
            if (this.uiPanel) {
                this.uiPanel.style.display = "none";
            }
        }
    }

    /**
     * Main animation loop
     */
    loop() {
        requestAnimationFrame(() => this.loop());
        const dt = Math.min(this.clock.getDelta(), 0.1);

        // Update kontrol kamera
        this.camControl.update(dt);

        // Handle raycasting untuk UI interaksi
        this.handleRaycast();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}
