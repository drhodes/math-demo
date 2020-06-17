
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

function AddArrow(tail, head, color, radius) {
    let arr = new FatArrow(color, radius);
    arr.add(scene);
    arr.update(tail, head);
    return arr;
}

function AddStep(step_name, latex, init, sequence_callback) {
    var step = new Step(step_name, latex, init, sequence_callback);
    steps.add(step);
    return step;
}

class Step {
    constructor(step_name, latex, init, sequence_callback) {
        this.node = document.createElement("div");
        this.node.setAttribute("id", step_name);
        this.node.setAttribute("class", "unselected");
        this.node.append(MathJax.tex2svg(latex, {scale: 200}));
        this.init = init;
        this.callback = _=> {
            this.node.setAttribute("class", "selected");
            init();
            return sequence_callback();
        };        
        this.node.addEventListener("click", this.callback);
    }

    select() { this.node.setAttribute("class", "selected"); }
    unselect() { this.node.setAttribute("class", "unselected"); }
    run() {
        this.callback();
    }        
}

class StepList {
    constructor() {
        MathJax.svgStylesheet();
        this.steps = [];
    }
    
    add(step) {
        steplist.appendChild(step.node);
        this.steps.push(step);
        //sequence_callback();
    }
}

let steps = new StepList();

class Label {
    // latex_img will eventually be latex source, but one step at a time.
    constructor(latex_img) {
        // MATH LABELS...
        var geometry = new THREE.BufferGeometry();
        var vertices = [];
        var textureLoader = new THREE.TextureLoader();
        var sprite = textureLoader.load(latex_img);
        vertices.push(0, 0, 0);

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        var material = new THREE.PointsMaterial({size:1,
                                             map:sprite,
                                             //depthTest: false,
                                             transparent: true, });
        this.particle = new THREE.Points(geometry, material);
        scene.add(this.particle);
    }

    set_position(x, y, z) { this.particle.position.set(x, y, z); }
    show() { this.particle.visible = true; }
    hide() { this.particle.visible = false; }
}

class Demo {
    constructor(){
        this.steps = arguments;
        this.step_done = true;
    }
}

// -----------------------------------------------------------------------------
function gram_schmidt() {
    // this is the only code the maker needs to worry about.
    add_coordinate_system();

    // load some labels off of disk.  Eventually, filenames will be
    // replaced with latex string, rendered in a browser canvas and
    // then mapped to an opengl texture.
    let u1 = new Label("./imgs/u_1.png");
    let e1 = new Label("./imgs/e_1.png");
    let u2 = new Label("./imgs/u_2.png");
    let e2 = new Label("./imgs/e_2.png");
    
    u2.hide();
    e2.hide();

    // this is silly and needs to change. 3 is one because of scaling,
    // vector length 1 is too short in the scene to see clearly what's
    // going on. Need to adjust the arrow dimensions and zoom the
    // camera closer so scaling factors don't need to be introduced.
    const one = 3;
    
    // Caution, for efficiency reason these three.js vectors are
    // potentially shared and mutable, this detail should be hidden
    // from makers.
    
    let origin = vec(0,0,0);
    let p1 = vec(7, .35, .67);
    let p2 = vec(1.12, 6, -1.34);
    let p3 = vec(2, 1, 5);
    
    let u1_arrow = AddArrow(origin, p1, COLOR_GRAY);
    let u2_arrow = AddArrow(origin, p2, COLOR_GRAY);
    let blue_arrow = AddArrow(origin, p3, COLOR_GRAY);
    
    let e1_arrow = AddArrow(vec(0,0,0), p1, COLOR_RED, .035);
    let e2_arrow = AddArrow(vec(0,0,0), p2, COLOR_GREEN, .035);

    // this bit of state needs to be managed by the Demo object, it
    // should be transparent to the maker.
    
    let done = true;

    /// ------------------------------------------------------------------    
    return new Demo(
        // ------------------------------------------------------------------
        // The anatomy of a step. 
        
        AddStep(
            // ------------------------------------------------------------------
            // First argument to AddStep: give the step a name
            "first-step",

            // ------------------------------------------------------------------
            // Second argument: provide latex to be displayed step list
            "\\mathbf{e}_1 = \\frac{\\mathbf{u}_1}{||\\mathbf{u}_1||}",

            // ------------------------------------------------------------------
            // Third argument is a function, specifically an initial
            // configuration of the actors declared above.  This is
            // necessary because people may select this step out of
            // order.  For a transition to make sense, the starting
            // point of the actors needs to be well defined, as well
            // as the end point.
            
            function() {                
                camera.position.set(8,8,8);                
                camera.lookAt(vec(3,0,0));

                
                u1_arrow.update(origin, p1);
                u1.set_position(u1_arrow.head_x() + 0,
                                u1_arrow.head_y() + 0,
                                u1_arrow.head_z() + .3);
                
                let x = u1_arrow.head.clone();
                x.multiplyScalar(.93);
                
                e1_arrow.update(origin, x);


                e1.set_position(e1_arrow.head_x() + 0,
                                e1_arrow.head_y() + 0,
                                e1_arrow.head_z() + .3);
                
            },

            function() {
                // ignore mouse clicks while the animation is running.
                // this should at the demo level.
                if (!done) return true; 
                
                // initialize the actors. need to take a much closer
                // look at what it means for a step to be "done". The
                // animation is done, yes, but all of these sequences
                // are running in parallel and they have not idea if a
                // sibling sequence has been stopped.  The Step
                // abstraction should oversee this and communicate to
                // the sequences, wrap up the complexity for Demo, so
                // Demo can kick off a new Step and stop the current step.

                // change the word "done" to "stop".
                done=false;


                
                let x = p1.clone();
                x.multiplyScalar(.4);
                sequence([
                    e1_arrow.ease_to(p1, x, 300),
                    _=>done=true
                ]);

                sequence([ _=> { e1.set_position(e1_arrow.head_x() - .5,
                                                 e1_arrow.head_y() + 0,
                                                 e1_arrow.head_z() + .3);
                                 return done;
                               }]);
                
                // camera
                sequence([
                    ease_camera_to(vec(3, 10, 3), vec(3,0,0), 300), 
                ]);

                // voice
                sequence([
                    function() {
                        speak({
                            en: "The normal vector e1 is created by dividing the u one vector by its magnitude",
                            zh: "通过将向量u1除以其长度来创建法线向量e1",
                            ru: "Нормальный вектор e1 создается делением вектора u one на его величину",
                            es: "El vector normal e1 se crea dividiendo el vector u uno por su magnitud",
                        });
                        return true;
                    },
                ]);
            }),

        AddStep(
            // ------------------------------------------------------------------
            // First argument to AddStep: give the step a name
            "step-2",

            // ------------------------------------------------------------------
            // Second argument: provide latex to be displayed step list
            "\\mathbf{u}_2 = \\mathbf{v}_2 - \\text{proj}_{u_1} (\\mathbf{v}_2)",

            // ------------------------------------------------------------------
            // Third argument is a function, specifically an initial
            // configuration of the actors declared above.  This is
            // necessary because people may select this step out of
            // order.  For a transition to make sense, the starting
            // point of the actors needs to be well defined, as well
            // as the end point.
            
            function() {
                u2.show();
                e2.show();
                camera.position.set(3,10,3);
                camera.lookAt(vec(3,0,0));
                u2_arrow.update(origin, p2); //u2_arrow.head);
                u2.set_position(u2_arrow.head_x() + 0,
                                u2_arrow.head_y() + 0,
                                u2_arrow.head_z() + .3);
                
                let x = u2_arrow.head.clone();
                x.multiplyScalar(.93);
                
                e2_arrow.update(origin, x);
                e2.set_position(e2_arrow.head_x() + 0,
                                e2_arrow.head_y() + 0,
                                e2_arrow.head_z() + .3);
            },

            function() {
                // ignore mouse clicks while the animation is running.
                // this should at the demo level.
                if (!done) return true; 
                
                // initialize the actors.
                done=false;
 
                let x = p2.clone();
                x.multiplyScalar(.4);
                
                sequence([
                    e2_arrow.ease_to(p2, x, 300),                    
                    _=>done=true
                ]);

                sequence([ _=> {
                    e2.set_position(e2_arrow.head_x() - 0.5,
                                    e2_arrow.head_y() + 0.0,
                                    e2_arrow.head_z() + 0.3);
                    return done;
                }]);
                
                // camera
                // sequence([
                //     ease_camera_to(vec(10, 3, 5), vec(0,3,0), 300), 
                // ]);

                // voice
                sequence([
                    function() {
                        speak({
                            en: "The normal vector e2 is created by dividing the u one vector by its magnitude",
                            zh: "通过将向量u1除以其长度来创建法线向量e2",
                            ru: "Нормальный вектор e2 создается делением вектора u one на его величину",
                            es: "El vector normal e2 se crea dividiendo el vector u uno por su magnitud",
                        });
                        return true;
                    },
                ]);
                return undefined;
            })
    );    
}

demo = gram_schmidt();
demo.steps[0].init();
console.log("loaded gram_schmidt");



