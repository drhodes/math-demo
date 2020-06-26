import {scene} from "./demo.js";

class Segment {
    constructor (v1, v2, hex_color) {
        this.material = new THREE.LineBasicMaterial({ color: hex_color });
        this.geometry = new THREE.BufferGeometry().setFromPoints( [v1,v2] );
        this.line = new THREE.Line( this.geometry, this.material );
        this.head = v1;
        this.tail = v2;
    }
    
    add_to_scene() {
        scene.add(this.line);
    }

    update_points(v1, v2) {
        this.head = v1;
        this.tail = v2;
        this.geometry.setFromPoints( [v1,v2] );
        this.geometry.attributes.position.needsUpdate = true;
    }
}


export function AddSegment(v1, v2, hex_color) {
    let seg = new Segment(v1,v2, hex_color);
    seg.add_to_scene(scene);
    return seg;
}
