import {vec, negate} from "./util.js";
import { ease_arrow_head_from_to,
         ease_arrow_tail_to,         
         ease_opacity,
         ease_arrow_translate,
       } from "./easing.js";
import {scene} from "./demo.js";


export function AddArrow(tail, head, color, radius) {
    let arr = new Arrow(color, radius);
    arr.add(scene);
    arr.update(tail, head);
    return arr;
}

export class Arrow {
    constructor(hexColor, radius) {
        // default radius of arrow is .03;
        let r = radius ? radius : .02;
        
        this.cylGeom = new THREE.CylinderGeometry( r, r, 1, 20 );
        this.cylMat = new THREE.MeshBasicMaterial({
            color: hexColor,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.cylinder = new THREE.Mesh( this.cylGeom, this.cylMat ); 
        this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
       
        this.coneGeom = new THREE.ConeGeometry( .09, .5, 20 );
        this.coneMat = new THREE.MeshBasicMaterial( {color: hexColor} );
        this.coneMat.transparent = true;
        this.cone = new THREE.Mesh( this.coneGeom, this.coneMat);

        this.CONE_HEIGHT = .25; // why is this .25?
    }
    
    // move_to(p) {
    //     this.tail = p;
    //     this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)); 
    // }

    ease_head_to(v1, num_frames) {
        return ease_arrow_head_from_to(this, this.head, v1, num_frames);
    }

    ease_tail_to(v1, num_frames) {
        return ease_arrow_tail_to(this, this.tail, v1, num_frames);
    }
    
    ease_translate(v1, num_frames) {
        return ease_arrow_translate(this, v1, num_frames);
    }
    
    len() {
        return this.head.distanceTo(this.tail);
    }

    ease_opacity(from_opacity, to_opacity, num_steps) {
        return ease_opacity(this, from_opacity, to_opacity, num_steps);
    }
    
    setup_cylinder() {
        this.cylinder.position.set( 0, 0, 0 );
        this.cylinder.rotation.set( 0, 0, 0 );
        this.cylinder.scale.set( 1, 1, 1 );
        // scale it.
        let len = this.len() - this.CONE_HEIGHT;
        let scale_matrix = new THREE.Matrix4().makeScale(1, len, 1);
        this.cylinder.applyMatrix4(scale_matrix);
        // POST. the arrow is ready to be rotated.
    }
    
    setup_cone() {
        this.cone.position.set( 0, 0, 0 );
        this.cone.rotation.set( 0, 0, 0 );
        this.cone.scale.set( 1, 1, 1 );
        // move the cone to be flush with cylinder
        let trans_matrix = new THREE.Matrix4().makeTranslation(0, this.len() - this.CONE_HEIGHT, 0);
        this.cone.applyMatrix4(trans_matrix);
    }

    setup_rotate() {
        let len = this.len();
        let v1 = new THREE.Vector3(0, this.len(), 0);
        let v2 = new THREE.Vector3(this.head.x - this.tail.x,
                                   this.head.y - this.tail.y,
                                   this.head.z - this.tail.z);
        let axis = v1.clone().cross(v2);
        let theta = v1.angleTo(v2);
        axis.normalize();
        if (axis.length() < .01) {
            return;
        } else {
            let rot_mat = new THREE.Matrix4().makeRotationAxis(axis, theta);
            this.cone.applyMatrix4(rot_mat);
            this.cylinder.applyMatrix4(rot_mat);
        }
    }
    
    setup_move() {
        let trans_mat = new THREE.Matrix4().makeTranslation(this.tail.x, this.tail.y, this.tail.z);
        this.cylinder.applyMatrix4(trans_mat);
        this.cone.applyMatrix4(trans_mat);
    }

    head_x() { return this.head.x; }
    head_y() { return this.head.y; }
    head_z() { return this.head.z; }
    
    update(tail, head) {
        this.tail = tail;
        this.head = head;        
        this.setup_cylinder();
        this.setup_cone();
        this.setup_rotate();
        this.setup_move();
    }
    
    update_head(head) { this.update(this.tail, head); }
    update_tail(tail) { this.update(tail, this.head); }

    add(scene) {
        scene.add(this.cone);
        scene.add(this.cylinder);
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
        this.coneMat.opacity = n;
        this.cylMat.opacity = n;
    }

    toVector3() {
        return vec(this.head.x - this.tail.x,
                   this.head.y - this.tail.y,
                   this.head.z - this.tail.z);
    }

    set_vis(bool) {
        this.cone.visible = bool;
        this.cylinder.visible = bool;
    }

    projectOnto(arr) {
        let u = this.toVector3();
        let v = arr.toVector3();
        u.projectOnVector(v);
        return u;
    }
}
