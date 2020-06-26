import {vec, negate, show, hide} from "./util.js";
import {scene, camera, sequence} from "./demo.js";
import {AddSegment} from "./segment.js";
import {Arrow} from "./arrow.js";
import {Label} from "./label.js";
import * as color from "./color.js";
import {ease_camera_to,
        ease_translate_to,
        ease_arrow_head_to,
        ease_segment_shift_by,
       } from "./easing.js";
import {StepList, Step, AddStep} from "./step.js";
import {speak} from "./utter.js";
import {AddArrow} from "./arrow.js";

function add_coordinate_system() {
    AddSegment(vec(10, 0, 0), vec(-100, 0, 0), 0xFFAAAA);
    AddSegment(vec(0, 10, 0), vec(0, -100, 0), 0xAAFFAA);
    AddSegment(vec(0, 0, 10), vec(0, 0, -100), 0xAAAAFF);
}

class Demo {
    constructor(){
        this.steps = arguments;
        this.step_done = true;
    }
}

// -----------------------------------------------------------------------------
function gram_schmidt() {
    // this is the only code the designer needs to worry about.
    add_coordinate_system();

    // load some labels from disk.  Eventually, filenames will be
    // replaced with latex string, rendered in a browser canvas and
    // then mapped to an opengl texture.
    let u1_label = new Label("./imgs/u_1.png");
    let v1_label = new Label("./imgs/v_1.png");
    let u2_label = new Label("./imgs/u_2.png");
    let v2_label = new Label("./imgs/v_2.png");
    let proj_v2_u1_label = new Label("./imgs/proj_v2_u1.png", 3.5);
    
    // factor this into the demo class.
    function hide_all_labels() {
        hide(u2_label, v2_label, u1_label, v1_label, proj_v2_u1_label);
    }
    
    // Caution, for efficiency reason these three.js vectors are
    // potentially shared and mutable, this detail should be hidden
    // from designers.
    
    let origin = vec(0,0,0);
    let p1 = vec(4, 0.35, .67);
    let p2 = vec(2, 3, 1);
    let p3 = vec(1, 1, 6);
    
    let proj_v2_u1 = AddArrow(origin, vec(1,1,1), color.GREEN, .044);
    let u1_arrow = AddArrow(origin, p1, color.GRAY, .034);
    let u2_arrow = AddArrow(origin, p2, color.GRAY);
    let v1_arrow = AddArrow(vec(0,0,0), p1, color.RED, .035);
    let v2_arrow = AddArrow(vec(0,0,0), p2, color.GRAY, .035);
    let v3_arrow = AddArrow(origin, p3, color.GRAY, .035);

    function hide_all_arrows() {
        hide(u1_arrow, u2_arrow, v1_arrow, v2_arrow, v3_arrow, proj_v2_u1);
    }

    let proj_segment = AddSegment(origin, origin, color.GRAY);
    let u1_segment = AddSegment(origin, p1, color.GRAY);
    
    /// ------------------------------------------------------------------    
    return new Demo(
        AddStep({
            name: "u1=v1",
            latex: "\\mathbf{u}_1 = \\mathbf{v}_1",
            
            // ------------------------------------------------------------------
            // Set the stage.  Users may select steps out of order.
            // For a transition to make sense, the starting point of
            // the actors needs to be well defined, as well as the end
            // point.
            init: function() {
                hide_all_labels();
                hide_all_arrows();
                show(v1_arrow, v2_arrow, v3_arrow);
                show(v1_label, v2_label, u1_label, u1_arrow);

                sequence( ease_camera_to(vec(10, 10, 8), vec(0,0,3), 10) );
                
                v1_label.to_arrow_tip(v1_arrow);
                let x = v1_arrow.head.clone();
                x.multiplyScalar(2);

                u1_arrow.update(origin, x);
                u1_label.to_arrow_tip(u1_arrow);
                v2_label.to_arrow_tip(v2_arrow);                
            },
            
            animate: function() {
                // ignore mouse clicks while the animation is running.
                // this should at the demo level.
                // if (!done) return true;                
                let done = false;
                // initialize the actors. need to take a much closer
                // look at what it means for a step to be "done". The
                // animation is done, yes, but all of these sequences
                // are running in parallel and they have not idea if a
                // sibling sequence has been stopped.  The Step
                // abstraction should oversee this and communicate to
                // the sequences, wrap up the complexity for Demo, so
                // Demo can kick off a new Step and stop the current step.

                // change the word "done" to "stop".
                // TODO: this bit of state needs to be managed by the Demo object, it
                // should be transparent to the designer.
                done=false;
                sequence(
                    u1_arrow.ease_head_to(p1, 100),
                    function() { done = true; },
                );
                
                sequence(function() {
                    let v = u1_arrow.head.clone();
                    v.multiplyScalar(1.05);
                    u1_label.set_position(v);
                    return done;
                });
                
                sequence(v1_arrow.ease_opacity(1, 0, 100));
                sequence(v1_label.ease_opacity(1, 0, 100));
               
                // camera
                sequence(ease_camera_to(vec(3, 10, 10), vec(3,0,0), 100));

                // voice
                sequence(function() {
                    speak({
                        en: "let vector u sub one equal vector v sub one",
                        es: "Hacer que el vector u sub 1 sea igual al vector v sub 1",
                        ja: "「ベクトルu sub 1をベクトルv sub 1と等しくする",
                        zh: "",
                        ru: "",
                    });
                    return true;
                });
            }
        }), 

        // ------------------------------------------------------------------
        AddStep({
            name: "proj_u1",            
            latex: "\\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2)",
            
            init: function() {
                hide_all_labels();
                hide_all_arrows();                
                show(u1_label, v2_arrow, v2_label);
                
                v2_arrow.update(origin, p2);
                v2_label.to_arrow_tip(v2_arrow);                
            },
            
            animate: function() {
                show(v2_arrow, u1_arrow, proj_v2_u1, u1_label, proj_v2_u1_label);
                v2_arrow.update(origin, p2);
                
                let proj = v2_arrow.projectOnto(u1_arrow);
                proj_v2_u1.update_head(p2);
                proj_segment.update_points(p2, proj);
                
                sequence( v1_arrow.ease_opacity(1, 0, 60)); 
                sequence( proj_v2_u1.ease_head_to(proj, 60),
                          function() {
                              sequence( u1_arrow.ease_opacity(1, 0, 20)); 
                              u1_arrow.hide();
                              return true;
                          });
                sequence( v2_arrow.ease_opacity(1, .5, 20));
                
                let proj1 = proj.clone().multiplyScalar(1.0);
                proj1.z += .2;
                sequence( proj_v2_u1_label.ease_from_to(p2, proj1, 60), );
                sequence( ease_camera_to(vec(-1, 6, 7), proj1, 20), );
            }
        }), 

        // ------------------------------------------------------------------
        AddStep({
            name: "v2-proj_u1",            
            latex: "\\mathbf{v}_2-\\text{proj}_{\\mathbf{u}_1}(\\mathbf{v}_2)",
            
            init: function() {
                hide_all_labels();
                hide_all_arrows();                
                show(v2_arrow, u2_arrow, u1_arrow, proj_v2_u1);
                show(u1_label, v2_label, proj_v2_u1_label);
            },
            
            animate: function() {
                let shift_vec = negate(proj_v2_u1.toVector3());
                let slow = 60;
                let fast = 10;
                sequence( 
                    // move the projection segment to the origin
                    ease_segment_shift_by(proj_segment, shift_vec, slow),
                    // move the projection vector up to head of v1
                    ease_camera_to(vec(-3.1, -1.5, 10), origin , slow),
                    //u2_arrow.ease_head_to(proj_segment.hw, 10),
                    proj_v2_u1.ease_translate(p2.clone().add(negate(proj_v2_u1.head)), slow),
                    u2_arrow.ease_head_to(p2.clone().add(negate(proj_v2_u1.head)), slow),
                    proj_v2_u1_label.ease_opacity(1, 0, slow),
                    _=> {
                        proj_v2_u1_label.hide();
                        u2_label.to_arrow_tip(u2_arrow, slow);
                        u1_arrow.show();
                        return true;
                    },
                    u2_label.ease_opacity(0, 1, slow),
                    v2_label.ease_opacity(1, 0, slow),
                    v2_arrow.ease_opacity(1, 0, slow),
                    proj_v2_u1.ease_opacity(1, 0, 10),
                    ease_camera_to(vec(5 , 5, 5), origin , 50),
                    ease_camera_to(vec(5 , -5, 5), origin , 50),
                    ease_camera_to(vec(-2, -1, 12), origin , 50),
                );
                // fade in u1
            }
        }), // addstep
    );
}

let demo = gram_schmidt();
demo.steps[0].init();
console.log("loaded gram_schmidt");

