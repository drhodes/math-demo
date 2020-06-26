import {vec, negate} from "./util.js";
import {camera} from "./demo.js";

export function interpolate_nums(x, y, num_steps) {
    var delta = (y - x) / num_steps;
    var xs = [];
    for (var step=0; step < num_steps; step++) {
        xs.push(x + step*delta);
    }
    xs.push(y);
    return xs;
}

export function interpolate_vectors(v1, v2, num_steps) {
    let xs = interpolate_nums(v1.x, v2.x, num_steps);
    let ys = interpolate_nums(v1.y, v2.y, num_steps);
    let zs = interpolate_nums(v1.z, v2.z, num_steps);
    let result = [];
    for (var i=0; i<xs.length; i++) {
        result.push(vec(xs[i], ys[i], zs[i]));
    }
    return result;
}

export function ease_arrow_head_to(arr, target_vector, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var positions = null;

        return function() {
            if (!positions) interpolate_vectors(arr.head, target_vector, num_steps);
            arr.update(arr.tail, positions[0]);
            positions.shift(0);            
            return positions.length == 0;
        };
    }
}

export function ease_arrow_tail_to(arr, target_vector, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var positions = interpolate_vectors(arr.tail, target_vector, num_steps);

        return function() {
            arr.update(arr.tail, positions[0]);
            positions.shift(0);            
            return positions.length == 0;
        };
    }
}



export function ease_label_from_to(label, from_vec, to_vec, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var positions = interpolate_vectors(from_vec, to_vec, num_steps);
        
        return function() {
            label.set_position(positions[0]);
            positions.shift(0);            
            return positions.length == 0;
        };
    }
}

export function ease_segment_shift_by(segment, vec, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        var first_run = true;
        var target_head;
        var heads;
        var target_tail;
        var tails;
        
        return function() {
            if (first_run) {
                target_head = segment.head.clone().add(vec);
                target_tail = segment.tail.clone().add(vec);
                heads = interpolate_vectors(segment.head, target_head, num_steps);
                tails = interpolate_vectors(segment.tail, target_tail, num_steps);
                first_run = false;
            }
            segment.update_points(heads[0], tails[0]);
            heads.shift(0);            
            tails.shift(0);            
            return heads.length == 0 || tails.length == 0;
        };
    }
}

export function ease_arrow_translate(arrow, vec, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        let init = true;
        var target_head = undefined;
        var heads = undefined;
        var target_tail = undefined;
        var tails = undefined;
        
        return function() {
            if (init) {
                target_head = arrow.head.clone().add(vec);
                target_tail = arrow.tail.clone().add(vec);
                heads = interpolate_vectors(arrow.head, target_head, num_steps);
                tails = interpolate_vectors(arrow.tail, target_tail, num_steps);
                init = false;
            }
            arrow.update(heads[0], tails[0]);
            heads.shift(0);            
            tails.shift(0);            
            return heads.length == 0 || tails.length == 0;
        };
    }
}




export function ease_opacity(obj, from_opacity, to_opacity, num_steps) {
    if (typeof obj.opacity === "undefined") throw "obj must have opacity method";
    if (from_opacity < 0 || from_opacity > 1) throw "from_opacity out of range";
    if (to_opacity < 0 || to_opacity > 1) throw "to_opacity out of range";
    if (num_steps < 0) throw "num_steps must be greater than 0";

    var levels_of_opacity = interpolate_nums(from_opacity, to_opacity, num_steps);
    
    return function() {
        obj.opacity(levels_of_opacity[0]);
        levels_of_opacity.shift(0);            
        return levels_of_opacity.length == 0;
    };
}

export function ease_arrow_head_from_to(arr, from_vec, to_vec, num_steps) {
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

export function ease_camera_to(tgt_vec, look_vec, num_steps) {
    if (num_steps < 1) {
        throw "num_steps must be greater than 0!";
    } else {
        let positions = null;
        let look_ats = null;
        
        return function() {
            if (positions == null) {
                positions = interpolate_vectors(camera.position, tgt_vec, num_steps);
                // next 2 lines from https://stackoverflow.com/questions/23642912/three-js-get-camera-lookat-vector
                var cur_look_vec = new THREE.Vector3(0,0, -1);
                cur_look_vec.applyQuaternion(camera.quaternion);                
                look_ats = interpolate_vectors(cur_look_vec, look_vec, num_steps);
            }
            
            camera.position.set(positions[0].x, positions[0].y, positions[0].z);
            positions.shift(0);
            camera.lookAt(look_ats[0]);
            look_ats.shift(0);
            // indicat when the easing computation is done.
            return positions.length == 0;
        };
    }
}

export function jump_camera_to(tgt_vec, look_vec) {
    return function() {
        camera.position.set(tgt_vec.x, tgt_vec.y, tgt_vec.z);
        camera.lookAt(look_vec);
        return true;
    };
}

// TODO update this to return ar function that initialize on first as ease_translate_to does.
export function ease_arrow_from_to(arr, from_head_tail, to_head_tail, num_steps) {
    if (num_steps < 0) {
        throw "num_steps must be greater than 0";
    } else {
        let tail_positions = interpolate_vectors(from_head_tail[0], to_head_tail[0], num_steps);
        let head_positions = interpolate_vectors(from_head_tail[1], to_head_tail[1], num_steps);
        return function() {
            arr.update(tail_positions[0], head_positions[0]);
            tail_positions.shift(0);
            head_positions.shift(0);
            return (tail_positions.length == 0 ||
                    head_positions.length == 0 );
        };
    }
}


export function ease_translate_to(arr, v, num_steps) {
    // TODO rename update method to update_pos
    if (typeof arr.update === "undefined") throw "arr must have update method";
    if (num_steps < 0) throw "num_steps must be greater than 0";

    var tail_vecs = null; 
    var head_vecs = null;

    var new_tail = v.clone();
    var new_head = new_tail.clone().add(arr.head.clone().add(negate(arr.tail)));
    
    return function() {
        if (tail_vecs == null) {
            // initialize on first run.
            tail_vecs = interpolate_vectors(arr.tail, new_tail, num_steps);
            head_vecs = interpolate_vectors(arr.head, new_head, num_steps);
        }
        arr.update(tail_vecs[0], head_vecs[0]);
        tail_vecs.shift(0);
        head_vecs.shift(0);
        return (tail_vecs.length == 0 ||
                head_vecs.length == 0 );
    };
}

