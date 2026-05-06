/**
 * CollisionSystem
 * Menangani collision detection antara player dan objek museum
 */
export default class CollisionSystem {
    constructor() {
        // Array untuk menyimpan bounding box collider
        this.boxes = [];
    }

    /**
     * Menambah collision box ke dalam system
     */
    addBox(x, z, w, d) {
        this.boxes.push({
            minX: x - w / 2,
            maxX: x + w / 2,
            minZ: z - d / 2,
            maxZ: z + d / 2,
        });
    }

    /**
     * Cek apakah posisi (x, z) dengan radius tertentu bertabrakan dengan collider
     */
    check(x, z, radius) {
        for (let b of this.boxes) {
            if (
                x + radius > b.minX &&
                x - radius < b.maxX &&
                z + radius > b.minZ &&
                z - radius < b.maxZ
            )
                return true;
        }
        return false;
    }
}
