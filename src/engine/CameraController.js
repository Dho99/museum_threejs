import * as THREE from "three";

/**
 * CameraController
 * Mengelola pergerakan kamera/player dan rotasi berdasarkan input
 */
export default class CameraController {
    constructor(camera, input, collisions, config) {
        this.camera = camera;
        this.input = input;
        this.collisions = collisions;

        // Konfigurasi kontrol
        this.speed = config.controls.speed;
        this.mouseSensitivity = config.controls.mouseSensitivity;
        this.radius = config.controls.collisionRadius;
        this.verticalClamp = config.controls.verticalClamp;

        // Setup rotation order untuk kamera
        this.camera.rotation.order = "YXZ";

        // Reuse objek matematika ini supaya gerak kamera tidak membuat alokasi
        // baru terus-menerus saat frame sedang padat.
        this.mouseDelta = { x: 0, y: 0 };
        this.euler = new THREE.Euler(0, 0, 0, "YXZ");
        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.moveVec = new THREE.Vector3();
    }

    /**
     * Update kamera setiap frame
     */
    update(dt) {
        // Jika pointer tidak lock, jangan proses input
        if (!this.input.isLocked) return;

        // Handle mouse look
        this.handleMouseLook();

        // Handle movement
        this.handleMovement(dt);
    }

    /**
     * Handle mouse look around
     */
    handleMouseLook() {
        const md = this.input.getMouseDelta(this.mouseDelta);

        // Update rotasi kamera berdasarkan mouse movement
        this.camera.rotation.y -= md.x * this.mouseSensitivity;
        this.camera.rotation.x -= md.y * this.mouseSensitivity;

        // Clamp pitch (rotasi vertikal) agar tidak bisa full rotation
        this.camera.rotation.x = Math.max(
            -this.verticalClamp,
            Math.min(this.verticalClamp, this.camera.rotation.x),
        );
    }

    /**
     * Handle pergerakan pemain dengan WASD
     */
    handleMovement(dt) {
        // Hitung arah forward dan right berdasarkan rotasi kamera
        this.euler.set(0, this.camera.rotation.y, 0, "YXZ");
        this.forward.set(0, 0, -1).applyEuler(this.euler).normalize();
        this.right.set(1, 0, 0).applyEuler(this.euler).normalize();

        // Build movement vector
        this.moveVec.set(0, 0, 0);

        if (this.input.isKeyDown("KeyW")) this.moveVec.add(this.forward);
        if (this.input.isKeyDown("KeyS")) this.moveVec.sub(this.forward);
        if (this.input.isKeyDown("KeyA")) this.moveVec.sub(this.right);
        if (this.input.isKeyDown("KeyD")) this.moveVec.add(this.right);

        // Apply speed dan delta time
        if (this.moveVec.lengthSq() > 0)
            this.moveVec.normalize().multiplyScalar(this.speed * dt);

        // Hitung posisi berikutnya
        let nextX = Math.max(
            -38,
            Math.min(38, this.camera.position.x + this.moveVec.x),
        );
        let nextZ = Math.max(
            -28,
            Math.min(28, this.camera.position.z + this.moveVec.z),
        );

        // Cek collision sebelum update posisi
        if (!this.collisions.check(nextX, this.camera.position.z, this.radius))
            this.camera.position.x = nextX;
        if (!this.collisions.check(this.camera.position.x, nextZ, this.radius))
            this.camera.position.z = nextZ;
    }
}
