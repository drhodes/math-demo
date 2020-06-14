// (load "wrapper.scm")
// (load "colors.scm")
// console.log("starting demo");
// animate(); // start rendering.

function interpolate_nums(x, y, num_steps) {
    var delta = (y - x) / num_steps;
    var xs = [];
    for (var step=0; step < num_steps; step++) {
        xs.push(x + step*delta);
    }
    xs.push(y);
    return xs;
}

function interpolate_vectors(v1, v2, num_steps) {
    let xs = interpolate_nums(v1.x, v2.x, num_steps);
    let ys = interpolate_nums(v1.y, v2.y, num_steps);
    let zs = interpolate_nums(v1.z, v2.z, num_steps);
    let result = [];
    for (var i=0; i<xs.length; i++) {
        result.push(vec(xs[i], ys[i], zs[i]));
    }
    return result;
}

function ease_arrow_head_to(arr, target_vector, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var positions = interpolate_vectors(arr.head, target_vector, num_steps);

        return function() {
            arr.update(arr.tail, positions[0]);
            positions.shift(0);            
            return positions.length == 0;
        };
    }
}

function ease_arrow_head_from_to(arr, from_vec, to_vec, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var positions = interpolate_vectors(from_vec, to_vec, num_steps);

        return function() {
            arr.update(arr.tail, positions[0]);
            positions.shift(0);            
            return positions.length == 0;
        };
    }
}

function ease_camera_to(tgt_vec, look_vec, num_steps) {
    if (num_steps < 1) {
        throw "num_steps must be greater than 0!";
    } else {
        let positions = interpolate_vectors(camera.position, tgt_vec, num_steps);
        return function() {
            camera.position.set(positions[0].x, positions[0].y, positions[0].z);
            positions.shift(0);
            camera.lookAt(look_vec);
            // indicat when the easing computation is done.
            return positions.length == 0;
        };
    }
}

function ease_arrow_from_to(arr, from_pair, to_pair, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        let tail_positions = interpolate_vectors(from_pair[0], to_pair[0], num_steps);
        let head_positions = interpolate_vectors(from_pair[1], to_pair[1], num_steps);
        return function() {
            arr.update(tail_positions[0], head_positions[0]);
            tail_positions.shift(0);
            head_positions.shift(0);
            return (tail_positions.length == 0 ||
                    head_positions.length == 0 );
        };
    }
}

function add_coordinate_system() {
    function f(v, w, color) {
        var arr = Segment(v, w, color);
        arr.setLength(1000);
        arr.length=1000;
        scene.add(arr);
    }
    f(vec(10, 0, 0), vec(-100, 0, 0), 0xFFAAAA);
    f(vec(0, 10, 0), vec(0, -100, 0), 0xAAFFAA);
    f(vec(0, 0, 10), vec(0, 0, -100), 0xAAAAFF);
}

function vec(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function AddArrow(tail, head, color) {
    let arr = new FatArrow(color);
    arr.add(scene);
    arr.update(tail, head);
    return arr;
}

function AddStep(step_name, latex, sequence_callback) {
    steps.add(step_name, latex, sequence_callback);
}

class Step {
    constructor(step_name, latex, sequence_callback) {
        this.node = document.createElement("div");
        this.node.setAttribute("class", "unselected");
        this.node.append(MathJax.tex2svg(latex, {scale: 200}));
        this.img = null;

		// var texture = new THREE.TextureLoader().load( 'imgs/math-1.jpg' );
        // texture.repeat.set(5,5);
		// var geometry = new THREE.BoxBufferGeometry( .1, 2, 3 );
		// var material = new THREE.MeshBasicMaterial( { map: texture } );
        // var mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);
    }

    select() { this.node.setAttribute("class", "selected"); }
    unselect() { this.node.setAttribute("class", "unselected"); }

    get_svg() {
        //return new THREE.SVGObject(this.node.children[0].children[0]);
    }
}


class StepList {
    constructor() {
        MathJax.svgStylesheet();
        this.steps = [];
    }
    
    add(step_name, latex, sequence_callback) {
        var step = new Step(step_name, latex, sequence_callback);
        steplist.appendChild(step.node);
        this.steps.push(step);
        console.log(step.get_svg());
        sequence_callback();
    }
}

let steps = new StepList();

// -----------------------------------------------------------------------------
function gram_schmidt() {
    //let u1 = Label("u_1").hide();

    // MATH LABELS...
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    var textureLoader = new THREE.TextureLoader();
    var sprite = textureLoader.load('./imgs/u_1.png');
    vertices.push(0, 0, 0);

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    material = new THREE.PointsMaterial({size:1,
                                         map:sprite,
                                         //depthTest: false,
                                         transparent: true, });
    var particles = new THREE.Points(geometry, material);
    scene.add(particles);


    // this is the only code a demo maker needs to worry about.
    add_coordinate_system();
    
    let origin = vec(0,0,0);
    let p1 = vec(5, 0, 0);
    let p2 = vec(0, 5, 0);
    let p3 = vec(0, 0, 5);
    
    let red_arrow = AddArrow(origin, p1, COLOR_RED);
    let green_arrow = AddArrow(origin, p2, COLOR_GREEN);
    let blue_arrow = AddArrow(origin, p3, COLOR_BLUE);

    
    /// ------------------------------------------------------------------
    AddStep(        
        "name-of-step",
        "\\mathbf{e}_1 = \\frac{\\mathbf{u}_1}{||\\mathbf{u}_1||}", 
        function() {
            sequence([
                red_arrow.ease_to(p1, p2, 200),
                red_arrow.ease_to(p2, p3, 200),
                red_arrow.ease_to(p3, p1, 200),
            ]);

            // proto math labels.
            sequence([
                function() {
                    particles.position.set(red_arrow.head_x() + 0,
                                           red_arrow.head_y() + 0,
                                           red_arrow.head_z() + .3);
                    return false;
                },
            ]);
            
            // camera
            sequence([
                ease_camera_to(vec(5, -7, 7), origin, 400), 
            ]);
        });
}



gram_schmidt();
console.log("loaded gram_schmidt");

