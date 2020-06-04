var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffFFFF );
var camera = new THREE.PerspectiveCamera( 75, 1, 0.001, 100 );
var renderer = new THREE.WebGLRenderer();
canvas.appendChild( renderer.domElement );
renderer.setSize( 600,600 );
camera.position.z = 10;

function Arrow(dir, origin, hex_color) {
    dir.normalize();
    var length = 5;
    var head_len = .40;
    var head_width = .20;
    return new THREE.ArrowHelper( dir, origin, length, hex_color, head_len, head_width );
}

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

