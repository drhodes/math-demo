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

// (define (ease-arrow arr tail-to head-to num-steps)
//   ;; return a function that interpolates a path which is stepped over
//   ;; mutating the arrow depending on the frame.
//   (if (< num-steps 0) (raise "num-steps must be greater than 0"))
//   (let* ((cur-step 0)
//          ;; generate a list of positions which will consumed by the
//          ;; lambda
//          (tail-positions (interpolate-vectors (fat-arrow-tail arr) tail-to num-steps))
//          (head-positions (interpolate-vectors (fat-arrow-head arr) head-to num-steps)))
//     (lambda ()
//       (fat-arrow-update arr (car tail-positions) (car head-positions))
      
//       (set! tail-positions (cdr tail-positions))
//       (set! head-positions (cdr head-positions))
      
//       ;; aim the camera 
//       ;; return true when positions empty    
//       ;; this indicates when the easing computation is done.
//       (or (null? head-positions)
//           (null? tail-positions)))))
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
    var arr1 = Arrow(new THREE.Vector3(10, 0, 0), new THREE.Vector3(-100, 0, 0), 0xFFAAAA);
    arr1.setLength(1000);
    arr1.length=1000;
    scene.add(arr1);
    
    arr2 = Arrow(new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, -100, 0), 0xAAFFAA);
    arr2.setLength(1000);
    arr2.length=1000;
    scene.add(arr2);
    
    arr3 = Arrow(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -100), 0xAAAAFF);
    arr3.setLength(1000);
    arr3.length=1000;
    scene.add(arr3);
}

const COLOR_RED = 0xFF0000;
const COLOR_BLUE = 0x0000FF;
const COLOR_GREEN = 0x00FF00;

function vec(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function AddArrow(tail, head, color) {
    let arr = new FatArrow(color);
    arr.add(scene);
    arr.update(tail, head);
    return arr;
}


function gram_schmidt() {
    add_coordinate_system();

    let red_arrow = AddArrow(vec(0, 0, 0), vec(5, 0, 0), COLOR_RED);
    let green_arrow = AddArrow(vec(0, 0, 0), vec(0, 5, 0), COLOR_GREEN);
    let blue_arrow = AddArrow(vec(0, 0, 0), vec(0, 0, 5), COLOR_BLUE);

    // these sequences are done in parallel
    sequence([
        ease_arrow_head_from_to(red_arrow, vec(5, 0, 0), vec(0, 5, 0), 50),
        ease_arrow_head_from_to(red_arrow, vec(0, 5, 0), vec(0, 0, 5), 50),
        ease_arrow_from_to(red_arrow, [vec(0, 0, 0), vec(5, 0, 0)], [vec(0, 0, 5), vec(5, 0, 5)], 50),
    ]);
    sequence([
        ease_arrow_head_from_to(green_arrow, vec(0, 5, 0), vec(0, 0, 5), 50),
        ease_arrow_head_from_to(green_arrow, vec(0, 0, 5), vec(5, 0, 0), 50),
        ease_arrow_head_from_to(green_arrow, vec(5, 0, 0), vec(0, 5, 0), 50),
    ]);
    sequence([
        ease_arrow_head_from_to(blue_arrow, vec(0, 0, 5), vec(5, 0, 0), 50),
        ease_arrow_head_from_to(blue_arrow, vec(5, 0, 0), vec(0, 5, 0), 50),
        ease_arrow_head_from_to(blue_arrow, vec(0, 5, 0), vec(0, 0, 5), 50),
    ]);

    // camera
    sequence([
        ease_camera_to(vec(1,1,5), vec(0, 0, 5), 450),
    ]);
               
    
    
}



gram_schmidt();
console.log("loaded gram_schmidt");

