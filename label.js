import {scene} from "./demo.js";
import {
    ease_arrow_head_from_to,
    ease_label_from_to,
    ease_opacity,
} from "./easing.js";

// MATH LABELS...
export class Label {
    // latex_img will eventually be latex source, but one step at a time.
    constructor(latex_img, size) {
        var geometry = new THREE.BufferGeometry();
        var vertices = [];
        var textureLoader = new THREE.TextureLoader();
        var sprite = textureLoader.load(latex_img);
        vertices.push(0, 0, 0);

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        if (typeof size == "undefined") {
            size = 1;
        }
        
        this.material = new THREE.PointsMaterial({size,
                                                  map:sprite,
                                                  transparent: true, });
        this.particle = new THREE.Points(geometry, this.material);
        scene.add(this.particle);
    }

    set_position(vec) {
        this.pos = vec;
        this.particle.position.set(vec.x, vec.y, vec.z);
    }
    
    ease_opacity(from_opacity, to_opacity, num_steps) {
        return ease_opacity(this, from_opacity, to_opacity, num_steps);
    }

    ease_from_to(from_vec, to_vec, num_steps) {
        this.set_position(from_vec.x, from_vec.y, from_vec.z);
        return ease_label_from_to(this, from_vec, to_vec, num_steps);
    }

    hide() {
        this.opacity(0);
        this.set_vis(false);
    }
    
    show() {
        this.opacity(1);
        this.set_vis(true);
    }
    
    opacity(n) {
        if (n < 0 || n > 1) throw "n has to be between 0 and 1";
        if (n > 0) this.set_vis(true);
        if (n == 0) this.set_vis(false);
        this.material.opacity = n;
    }

    set_vis(bool) {
        this.particle.visible = bool;
    }
    
    to_arrow_tip(arr) {
        console.log("asdf");
        var p = arr.head.clone();
        p.z += .4;
        this.set_position(p);
    }
}
