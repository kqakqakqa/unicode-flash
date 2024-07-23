let charPlayer;
let displayComponentsConfig;
let defaultComponentsConfig = {
    charCode: {
        x: 50,
        y: 50,
        xAlign: "center",
        yAlign: "center",
        fontSize: 10,
        fontColor: "#000000",
        fontFamily: "",
        visible: true,
        custom: ""
    },
    char: {
        x: 50,
        y: 50,
        xAlign: "center",
        yAlign: "center",
        fontSize: 10,
        fontColor: "#000000",
        fontFamily: "",
        visible: true,
        custom: ""
    },
};

window.onload = () => {

    displayComponentsConfig = new DisplayComponentsConfig()
    displayComponentsConfig.setConfigs(defaultComponentsConfig);

    new ResizeObserver(es => {
        es.forEach(e => {
            document.documentElement.style.setProperty("--displayEditPanelContainerSizeFactor", `calc(min((${e.contentRect.width}px) / 29.7, (${e.contentRect.height}px) / 21))`)
        })
    }).observe(document.getElementById("displayPanelMaxSize"));

    initializeFlash();
}

function initializeFlash() {
    let startCode = charCodeStringParser(document.getElementById("input_startCode").value);
    let endCode = charCodeStringParser(document.getElementById("input_endCode").value);
    let fps = parseInt(document.getElementById("input_fps").value);
    if (fps <= 0) fps = 1;

    charPlayer = new CharPlayer({
        startCode: startCode,
        endCode: endCode,
        fps: fps,
        showChar: showChar
    });

    flashConfigApplied();
}

function charCodeStringParser(charCodeString) {
    let charCode = 0;
    if (new RegExp("^[0-9a-fA-F]{1,}$").test(charCodeString)) charCode = parseInt(`0x${charCodeString}`);
    return charCode;
}

function showChar(codePoint) {
    document.getElementById("charCode").innerHTML = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
    document.getElementById("char").innerHTML = (codePoint <= 0x10ffff) ? `${String.fromCodePoint(codePoint)}` : "";
}

function pauseContinueFlash() {
    if (!charPlayer) initializeFlash();
    if (!charPlayer.interval) charPlayer.play();
    else charPlayer.pause();
    flashConfigChanged();
}

function flashConfigChanged() {
    document.getElementById("button_initializeFlash").classList.remove("display-none");
}

function flashConfigApplied() {
    charPlayer.initialize();
    document.getElementById("button_initializeFlash").classList.add("display-none");
}

async function startEndEditDisplayPanel() {
    if (document.body.classList.contains("displayPanelEditing")) {
        document.getElementById("editPanel").addEventListener('transitionend', e => {
            e.target.classList.add("display-none");
        }, { once: true });
        document.body.classList.remove("displayPanelEditing");
    }
    else {
        document.getElementById("editPanel").classList.remove("display-none");
        await new Promise(requestAnimationFrame);
        document.body.classList.add("displayPanelEditing");
    }
}

function displayComponentOnClick(e) {
    if (document.body.classList.contains("displayPanelEditing")) {
        for (let old of document.querySelectorAll(".displayComponent.editing")) {
            old.classList.remove("editing")
        };
        e.target.classList.add("editing");
        editingDisplayComponent(e.target.id);
    }
    e.stopPropagation();
}

function editingDisplayComponent(id) {
    let displayComponentEditing = null;
    let componentEditingConfig;
    if (id == "displayPanel") {
        displayComponentEditing = null;
    }
    else {
        displayComponentEditing = id;
        componentEditingConfig = displayComponentsConfig.getConfig(displayComponentEditing);
    }
    showDisplayComponentConfig(displayComponentEditing, componentEditingConfig);
}

function showDisplayComponentConfig(id, config) {
    if (!id) {
        document.getElementById("editPanel").innerHTML = "请选择展示框中的部件";
    }
    else {
        document.getElementById("editPanel").innerHTML = id + "<br />" + JSON.stringify(config);
    }
}