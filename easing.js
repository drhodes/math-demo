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

function jump_camera_to(tgt_vec, look_vec) {
    return function() {
        camera.position.set(tgt_vec.x, tgt_vec.y, tgt_vec.z);
        camera.lookAt(look_vec);
        return true;
    };
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
