


export class Step {
    constructor(config, /*name, latex, init, animate*/) {
        this.node = document.createElement("div");
        this.node.setAttribute("id", config.step_name);
        this.node.setAttribute("class", "unselected");
        this.node.append(MathJax.tex2svg(config.latex, {scale: 200}));
        this.init = config.init;
        this.callback = _=> {
            this.node.setAttribute("class", "selected");
            config.init();
            return config.animate();
        };        
        this.node.addEventListener("click", this.callback);
    }

    select() { this.node.setAttribute("class", "selected"); }
    unselect() { this.node.setAttribute("class", "unselected"); }
    run() { this.callback(); }        
}

export function AddStep(step_name, latex, init, sequence_callback) {
    var step = new Step(step_name, latex, init, sequence_callback);
    steps.add(step);
    return step;
}

export class StepList {
    constructor() {
        MathJax.svgStylesheet();
        this.steps = [];
    }
    
    add(step) {
        steplist.appendChild(step.node);
        this.steps.push(step);
    }
}



let steps = new StepList();
