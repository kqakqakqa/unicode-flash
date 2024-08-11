// preset/file ←(主动导出|主动导入)→ config
// edit ←(|触发updateConfig)→ config
// config (主动/自动applyConfig)→ scene/player

// window.addEventListener("beforeunload", e => {
//     e.preventDefault();
// });

let charPlayer;
let config = {};

window.onload = () => {
    sceneAutoResize();
    initializeFlash();
};

// config

const presetConfig = {
    sceneConfig: [
        {
            text: "[bgBlock]"
        },
        {
            text: "[charCode]",
            y: 20,
            fonts: ["Consolas", "monospace"]
        },
        {
            text: "[char]",
            fonts: ["\"思源宋体\"", "\"Noto Serif CJK SC\"", "\"天珩全字库TH-Tshyn-P0\"", "\"天珩全字库TH-Tshyn-P1\"", "\"天珩全字库TH-Tshyn-P2\"", "\"天珩全字库TH-Tshyn-P16\"", "sans-serif"],
            textSize: 30
        },
    ],
    playerConfig: {
        startCode: 0x4f8b,
        endCode: 0x3ffff,
        fps: 30,
    },
};

const defaultComponentConfig = {
    text: "",
    x: 50,
    y: 50,
    xAlign: "middle",
    yAlign: "middle",
    fonts: [],
    textSize: "",
    textColor: "",
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
        let newComponent = Object.create(defaultComponentConfig);
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
    // document.body.classList.add("sceneUpToDate");
    document.querySelector("#button_resetFlash").disabled = true;
}

function sceneNotUpToDate() {
    // document.body.classList.remove("sceneUpToDate");
    document.querySelector("#button_resetFlash").disabled = false;
}

// useredit → sceneconfig → scene
function updateAndApplySceneConfig() {
    updateSceneConfig();
    applySceneConfig();
}

function updateSceneConfig() {

};

const defaultComponentHtml = '<div class="component"><span class="rawText"></span><span class="text"></span></div>';
const componentXAlignMap = { "left": "0", "middle": "50%", "right": "100%" };
const componentYAlignMap = { "top": "0", "middle": "50%", "bottom": "100%" };

function applySceneConfig() {
    document.querySelector("#scene").innerHTML = "";
    config.sceneConfig.forEach(componentConfig => {
        let component = new DOMParser().parseFromString(defaultComponentHtml, "text/html").body.firstChild;

        component.querySelector(".rawText").innerHTML = (componentConfig.text || defaultComponentConfig.text);
        component.style.setProperty("--component_x", (componentConfig.x ?? defaultComponentConfig.x) / 100);
        component.style.setProperty("--component_y", (componentConfig.y ?? defaultComponentConfig.y) / 100);
        component.style.setProperty("--component_xAlign", componentXAlignMap[componentConfig.xAlign || defaultComponentConfig.xAlign]);
        component.style.setProperty("--component_yAlign", componentYAlignMap[componentConfig.yAlign || defaultComponentConfig.yAlign]);
        component.style.setProperty("font-family", fontFamilyArrayToFontFamilyString(componentConfig.fonts || defaultComponentConfig.fonts));
        component.style.setProperty("font-size", (componentConfig.textSize || defaultComponentConfig.textSize) + "em");
        component.style.setProperty("color", (componentConfig.textColor || defaultComponentConfig.textColor));
        if (!(componentConfig.visible || defaultComponentConfig.visible)) component.style.setProperty("display", "none");

        document.querySelector("#scene").appendChild(component);
    });
};

const fontFamilyGenericName = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "math", "emoji", "fangsong"];

function fontFamilyArrayToFontFamilyString(fonts) {
    let fontsString = "";
    fonts.forEach(rawFont => {
        let font = rawFont;
        if (!fontFamilyGenericName.includes(rawFont)) {
            font = font.replaceAll(/^["'](.*)["']$/g, "$1"); // 去除头尾引号
            font = font.replaceAll(/["']/g, "\\$1"); // 转义中间引号
        }
        if (fontsString) fontsString += ", ";
        fontsString += font;
    });
    return fontsString;
}

// useredit → playerconfig

function updatePlayerConfig() {
    let startCode = charCodeStringToCharCode(document.querySelector("#input_startCode").value);
    let endCode = charCodeStringToCharCode(document.querySelector("#input_endCode").value);
    let fps = parseInt(document.querySelector("#input_fps").value);
    if (!fps > 0) fps = 1;

    config.playerConfig.startCode = startCode;
    config.playerConfig.endCode = endCode;
    config.playerConfig.fps = fps;

    sceneNotUpToDate();
}

function charCodeStringToCharCode(charCodeString) {
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
    document.querySelectorAll(".component").forEach(e => {
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