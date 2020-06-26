
export var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf8f8f8 );

export var camera = new THREE.PerspectiveCamera( 65, 1, 0.001, 100 );

function init_camera() {
    camera.up.set(0, 0, 1);
    camera.position.y = 10;
    camera.position.x = 10;
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

init_camera();

var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    // depthWrite: false,
    // depthTest: false,
    // transparent: true,
    // alphaTest: 0.5,
});

canvas.appendChild( renderer.domElement );
renderer.setSize(800, 800);

function animate() {
	requestAnimationFrame(animate);
	renderer.render( scene, camera );
}
animate();

// -----------------------------------------------------------------------------
// each f in fs is a callback representing an animation in
// progress. Each frame of the animation is performed by calling the
// callback.

// If the callback returns true, then the animation is done and it is
// time to start the next animation.

// If the callback return false, then the animation is still running,
// so call the callback again.

// export var Seq = { Done: 1, Running: 2 };
export function sequence_animators(fs) {
    let i = 0;
    var do_animation = function() {
        if (i >= fs.length) return "done";
        let done = fs[i]();
        if (done && i < fs.length) {
            // finished the current animator, onto the next.
            i++;
        } 
	    requestAnimationFrame(do_animation);
    };
    return do_animation;
}

export function sequence(...args) {
    sequence_animators(args)();   
}

console.log("loaded demo.js");
