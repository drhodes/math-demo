var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffFFFF );
var camera = new THREE.PerspectiveCamera( 75, 1, 0.001, 100 );
var renderer = new THREE.WebGLRenderer({antialias: true});
canvas.appendChild( renderer.domElement );
renderer.setSize( 800,800 );
camera.position.y = 10;
camera.position.x = 10;


function Arrow(dir, origin, hex_color) {
    dir.normalize();
    var length = 5;
    var head_len = .40;
    var head_width = .20;
    let arr = new THREE.ArrowHelper( dir, origin, length, hex_color, head_len, head_width );
    arr.length = 5; // since arrow helper doesn't have a length.
    return arr;
}

class FatArrow {
    constructor(hexColor) {
        this.cylGeom = new THREE.CylinderGeometry( .03, .03, 1, 10 );
        let cylMat = new THREE.MeshBasicMaterial( {color: hexColor} );
        this.cylinder = new THREE.Mesh( this.cylGeom, cylMat ); 
        this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
        this.initCylGeom = new THREE.CylinderGeometry( .03, .03, 1, 10 ); // find better way to copy this.
        this.initCylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0)); 
       
        this.coneGeom = new THREE.ConeGeometry( .1, .5, 10 );
        let coneMat = new THREE.MeshBasicMaterial( {color: hexColor} );
        this.cone = new THREE.Mesh( this.coneGeom, coneMat);
        this.initConeGeom = new THREE.ConeGeometry( .1, .5, 10 );
        
        this.group = new THREE.Group();
        this.group.add(this.cylinder);
        this.group.add(this.cone);
    }

    reset_matrix() {
        this.cylGeom.copy(this.initCylGeom); 
        this.coneGeom.copy(this.initConeGeom);
    }
    
    move_to(p) {
        this.tail = p;
        this.cylGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)); 
    }

    len() {
        return this.head.distanceTo(this.tail);
    }

    setup_cylinder() {
        // PRECONDITION. the matrix should be reset.
        // scale it.
        let len = this.len();
        // console.log(len);
        let scale_matrix = new THREE.Matrix4().makeScale(1, len, 1);
        // console.log(scale_matrix);
        this.cylGeom.applyMatrix4(scale_matrix);
        // POST. the arrow is ready to be rotated.
    }
    
    setup_cone() {
        // move the cone to be flush with cylinder
        let trans_matrix = new THREE.Matrix4().makeTranslation(0, this.len(), 0);
        this.coneGeom.applyMatrix4(trans_matrix);
    }

    setup_rotate() {
        let len = this.len();
        let v1 = new THREE.Vector3(0, this.len(), 0);
        let v2 = new THREE.Vector3(this.head.x - this.tail.x,
                                   this.head.y - this.tail.y,
                                   this.head.z - this.tail.z);
        // console.log(v1);
        // console.log(v2);        
        let axis = v1.clone().cross(v2);
        // console.log(axis);
        let theta = v1.angleTo(v2);
        // console.log(theta);
        axis.normalize();
        // console.log(axis.length());
        if (axis.length() < .01) {
            return;
        } else {
            let rot_mat = new THREE.Matrix4().makeRotationAxis(axis, theta);
            this.group.applyMatrix4(rot_mat);
        }
    }
    
    setup_move() {
        let trans_mat = new THREE.Matrix4().makeTranslation(this.tail.x, this.tail.y, this.tail.z);
        this.group.applyMatrix4(trans_mat);
    }
    
    // this should be the only public update method.
    update(tail, head) {
        this.tail = tail;
        this.head = head;        
        this.reset_matrix();        
        this.setup_cylinder();
        this.setup_cone();
        this.setup_rotate();
        this.setup_move();
        // move group to tail position.
    }

    rotateX(angle) {
        this.group.rotateX(angle);
    }    
    
    add(scene) {
        scene.add(this.group);
    }
}

let red = new FatArrow(0xFF0000);
red.add(scene);
red.update(new THREE.Vector3(1, 0, 0),
           new THREE.Vector3(5, 0, 0));

let grn = new FatArrow(0x00FF00);
grn.add(scene);
grn.update(new THREE.Vector3(0, 1, 0),
           new THREE.Vector3(0, 5, 0));

let blu = new FatArrow(0x0000FF);
blu.add(scene);
blu.update(new THREE.Vector3(0, 0, 1), 
           new THREE.Vector3(0, 0, 5));

let gry = new FatArrow(0x888888);
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

function _animate() {
    //controls.autoRotate();
	requestAnimationFrame(_animate);
	renderer.render( scene, camera );
}

function _make_animator(f) {    
    var do_animation = function() {
        done = f();
        if (done) {
            return "done";
        } else {
	        requestAnimationFrame(do_animation);
        }
        return "should be dead path in _make_animator";
    };
    return do_animation;
}

