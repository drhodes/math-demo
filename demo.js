var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf8f8f8 );
var camera = new THREE.PerspectiveCamera( 65, 1, 0.001, 100 );
var renderer = new THREE.WebGLRenderer({antialias: true});
canvas.appendChild( renderer.domElement );
renderer.setSize(700, 700);

camera.up.set(0, 0, 1);
camera.position.y = 10;
camera.position.x = 10;
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

function Arrow(dir, origin, hex_color) {
    dir.normalize();
    var length = 5;
    var head_len = .40;
    var head_width = .20;
    let arr = new THREE.ArrowHelper( dir, origin, length, hex_color, head_len, head_width );
    arr.length = 5; // since arrow helper doesn't have a length.
    return arr;
}

function animate() {
    //controls.autoRotate();
	requestAnimationFrame(animate);
	renderer.render( scene, camera );
}

animate();

class FatArrow {
    constructor(hexColor) {
        this.cylGeom = new THREE.CylinderGeometry( .03, .03, 1, 10 );
        let cylMat = new THREE.MeshBasicMaterial( {color: hexColor} );
        this.cylinder = new THREE.Mesh( this.cylGeom, cylMat ); 
        this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
       
        this.coneGeom = new THREE.ConeGeometry( .1, .5, 10 );
        let coneMat = new THREE.MeshBasicMaterial( {color: hexColor} );
        this.cone = new THREE.Mesh( this.coneGeom, coneMat);

        this.CONE_HEIGHT = .25; // why is this .25?
    }
   
    move_to(p) {
        this.tail = p;
        this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)); 
    }

    len() {
        return this.head.distanceTo(this.tail);
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
    
    // this should be the only public update method.
    update(tail, head) {
        this.tail = tail;
        this.head = head;        
        this.setup_cylinder();
        this.setup_cone();
        this.setup_rotate();
        this.setup_move();
        // move group to tail position.
    }
    
    add(scene) {
        scene.add(this.cone);
        scene.add(this.cylinder);
    }
}

let gry = new FatArrow(0xFF0000);
gry.add(scene);
gry.update(new THREE.Vector3(0, 0, 0), 
           new THREE.Vector3(1, 1, 1));

function setCameraPosX(cam, x) { cam.position.x = x; }
function setCameraPosY(cam, y) { cam.position.y = y; }
function setCameraPosZ(cam, z) { cam.position.z = z; }

function getCameraPosX(cam, x) { return cam.position.x; }
function getCameraPosY(cam, y) { return cam.position.y; }
function getCameraPosZ(cam, z) { return cam.position.z; }

function _scene_add(obj) { scene.add(obj); }



function _make_animator(f) {    
    var do_animation = function() {
        done = f();
        if (done) {
            return "done";
        }
	    requestAnimationFrame(do_animation);
    };
    return do_animation;
}

function sequence_animators(fs) {
    let i = 0;
    var do_animation = function() {
        if (i >= fs.length) {
            return "done";
        }
        done = fs[i]();
        if (done && i < fs.length) {
            // finished the current animator, onto the next.
            i++;
        } 
	    requestAnimationFrame(do_animation);
    };
    return do_animation;
}

function sequence(xs) {
    sequence_animators(xs)();   
}


console.log("loaded demo.js");
