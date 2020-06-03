var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffFFFF );
var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
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

function _scene_add(obj) { scene.add(obj); }

var FRAME = 1;

function _animate() {
    FRAME += 1;
	requestAnimationFrame(_animate);
	renderer.render( scene, camera );
}



// animate();
