var global_utterer = new SpeechSynthesisUtterance();
global_utterer.lang = 'en';

function set_global_utterer_language(language) {
    global_utterer.lang = language;
}
function set_global_utterer_text(msg) {
    global_utterer.text = msg;
}

function change_language() {
    var language = document.getElementById("voice").value;
    console.log(language);
    set_global_utterer_language(language);
}

export function speak(msg_map) {
    // 
    // let text = msg_map[global_utterer.lang];
    // set_global_utterer_text(text);
    // window.speechSynthesis.speak(global_utterer);
}


