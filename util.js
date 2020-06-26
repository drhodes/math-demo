

export function vec(x,y,z) {
    return new THREE.Vector3(x,y,z);
}


export function negate(v) {
    return vec(-v.x, -v.y, -v.z);
}


export function enforce_interface(obj, method_name) {
    if (typeof obj[method_name] === "undefined") {
        throw "obj must have method: " + method_name;
    }
}

export function show(...objs) {
    objs.forEach(obj => {
        enforce_interface(obj, "show");
        obj.show();
    });
}

export function hide(...objs) {
    objs.forEach(obj => {
        enforce_interface(obj, "hide");
        obj.hide();
    });
}


