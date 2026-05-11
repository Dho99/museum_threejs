/**
 * InputManager
 * Mengelola input keyboard dan mouse untuk interaksi pemain
 */
export default class InputManager {
    constructor() {
        // Set untuk menyimpan key yang sedang ditekan
        this.keys = new Set();

        // Delta movement mouse untuk look around
        this.mouseDelta = { x: 0, y: 0 };

        // Status pointer lock
        this.isLocked = false;

        // Setup event listeners untuk keyboard
        window.addEventListener("keydown", (e) => this.keys.add(e.code));
        window.addEventListener("keyup", (e) => this.keys.delete(e.code));

        // Setup event listeners untuk mouse movement (saat pointer lock aktif)
        window.addEventListener("mousemove", (e) => {
            if (this.isLocked) {
                this.mouseDelta.x = e.movementX || 0;
                this.mouseDelta.y = e.movementY || 0;
            }
        });

        // Setup pointer lock UI
        this.blocker = document.getElementById("blocker");
        const instructions = document.getElementById("instructions");
        if (instructions) {
            instructions.addEventListener("click", () =>
                document.body.requestPointerLock(),
            );
        }

        // Monitor pointer lock state
        document.addEventListener("pointerlockchange", () => {
            this.isLocked = document.pointerLockElement === document.body;
            if (this.blocker) {
                this.blocker.style.display = this.isLocked ? "none" : "flex";
            }
        });
    }

    /**
     * Cek apakah key tertentu sedang ditekan
     */
    isKeyDown(code) {
        return this.keys.has(code);
    }

    /**
     * Dapatkan delta mouse movement dan reset
     */
    getMouseDelta(target = { x: 0, y: 0 }) {
        target.x = this.mouseDelta.x;
        target.y = this.mouseDelta.y;
        this.mouseDelta.x = 0;
        this.mouseDelta.y = 0;
        return target;
    }
}
