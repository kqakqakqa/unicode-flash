// preset/file ←(主动导出|主动导入)→ config
// edit ←(|触发updateConfig)→ config
// config (主动/自动applyConfig)→ scene/player

//`<div class="sceneComponent" style='transform: translateX(calc(0.5 * var(--sceneWidth) - 50%)) translateY(calc(0.5 * var(--sceneHeight) - 50%));'><span class="rawText">[bgBlock]</span><span class="text"></span></div>`



//{"left":"0","middle":"50%","right":"100%"}

//{"top":"0","middle":"50%","bottom":"100%"}



//--sceneComponent_xAlign

//--sceneComponent_yAlign



//--sceneComponent_x

//--sceneComponent_y





let charPlayer;
let config = {};

// config

const presetConfig = {
    sceneConfig: [
        {
            text: "[bgBlock]"
        },
        {
            text: "[charCode]",
            y: 20,
            font: ["Consolas", "monospace"]
        },
        {
            text: "[char]",
            font: ["\"思源宋体\"", "\"Noto Serif CJK SC\"", "\"天珩全字库TH-Tshyn-P0\"", "\"天珩全字库TH-Tshyn-P1\"", "\"天珩全字库TH-Tshyn-P2\"", "\"天珩全字库TH-Tshyn-P16\"", "system-ui", "sans-serif"],
            fontSize: 30
        },
    ],
    playerConfig: {
        startCode: 0x4f8b,
        endCode: 0x3ffff,
        fps: 30,
    },
};

const defaultSceneComponentConfig = {
    text: "",
    x: 50,
    y: 50,
    xAlign: "middle",
    yAlign: "middle",
    font: "",
    fontSize: "",
    fontColor: "",
    visible: true,
    custom: ""
};

const defaultPlayerConfig = {
    startCode: 0x4f8b,
    endCode: 0x3ffff,
    fps: 30,
};

function newSceneConfig(config) {
    if (!config || !(config instanceof Array)) return;
    let newConfig = [];
    config.forEach(component => {
        if (!component || !(component instanceof Object)) return;
        let newComponent = Object.create(defaultSceneComponentConfig);
        Object.assign(newComponent, component);
        newConfig.push(newComponent);
    });
    return newConfig;
}

function newPlayerConfig(config) {
    if (!config || !(config instanceof Object)) return;
    let newConfig = Object.create(defaultPlayerConfig);
    Object.assign(newConfig, config);
    return newConfig;
}

window.onload = () => {
    sceneAutoResize();
    initializeFlash();
};

// scene

function sceneAutoResize() {
    new ResizeObserver(es => {
        es.forEach(e => {
            document.documentElement.style.setProperty("--sceneMaxWidth", e.contentRect.width + "px");
            document.documentElement.style.setProperty("--sceneMaxHeight", e.contentRect.height + "px");
        });
    }).observe(document.querySelector("#sceneMaxSize"));
}

function initializeFlash() {
    config.sceneConfig = newSceneConfig(presetConfig.sceneConfig);
    config.playerConfig = newPlayerConfig(presetConfig.playerConfig)
    updateAndApplySceneConfig();
    updatePlayerConfig();
    applyPlayerConfig();
}

// resetButton

function sceneUpToDate() {
    document.body.classList.add("sceneUpToDate");
}

function sceneNotUpToDate() {
    document.body.classList.remove("sceneUpToDate");
}

// useredit → sceneconfig → scene
function updateAndApplySceneConfig() {
    // updateSceneConfig();
    applySceneConfig();
}

function updteSceneConfig() {

};

function applySceneConfig() {
    config.sceneConfig.forEach(componentConfig => {

    });
};

// useredit → playerconfig

function updatePlayerConfig() {
    let startCode = charCodeStringParser(document.querySelector("#input_startCode").value);
    let endCode = charCodeStringParser(document.querySelector("#input_endCode").value);
    let fps = parseInt(document.querySelector("#input_fps").value);
    if (fps <= 0) fps = 1;

    config.playerConfig.startCode = startCode;
    config.playerConfig.endCode = endCode;
    config.playerConfig.fps = fps;

    sceneNotUpToDate();
}

function charCodeStringParser(charCodeString) {
    let charCode = 0;
    if (new RegExp("^[0-9a-fA-F]{1,}$").test(charCodeString)) charCode = parseInt(`0x${charCodeString}`);
    return charCode;
}

// playerconfig → player

function applyPlayerConfig() {
    charPlayer = new CharPlayer({
        startCode: config.playerConfig.startCode,
        endCode: config.playerConfig.endCode,
        fps: config.playerConfig.fps,
        showChar: showChar
    });
    charPlayer.initialize();
    sceneUpToDate();
}

// scene

const altCodes = {
    "[charCode]": codePoint => `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
    "[char]": codePoint => (codePoint <= 0x10ffff) ? `${String.fromCodePoint(codePoint)}` : "",
    "[bgBlock]": codePoint => `<div style="height: var(--sceneHeight); width: var(--sceneWidth); background-color: ${getBgBlockColor(codePoint)}; user-select: none;"></div>`
};

const bgBlockColors = ["#dde", "#ded", "#def", "#dfe", "#edd", "#edf", "#eef", "#efe", "#fdd", "#fdf", "#fee", "#ffd", "#ddf", "#dee", "#dfd", "#dff", "#ede", "#eed", "#efd", "#eff", "#fde", "#fed", "#fef", "#ffe"];

function getBgBlockColor(codePoint) {
    let r = parseInt(codePoint / 8) % 24;
    return bgBlockColors[r];
}

function showChar(codePoint) {
    document.querySelectorAll(".sceneComponent").forEach(e => {
        let rawText = e.querySelector(".rawText").innerHTML;
        for (let altCode in altCodes) {
            rawText = rawText.replaceAll(altCode, altCodes[altCode](codePoint))
        }
        e.querySelector(".text").innerHTML = rawText;
    });
}

// player

function pauseContinueFlash() {
    if (!charPlayer) initializeFlash();
    if (!charPlayer.interval) charPlayer.play();
    else charPlayer.pause();
    sceneNotUpToDate();
}