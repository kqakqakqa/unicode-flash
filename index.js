// preset/file ←(主动导出|主动导入)→ config
// edit ←(|触发updateConfig)→ config
// config (主动/自动applyConfig)→ scene/flash

// window.addEventListener("beforeunload", e => {
//     e.preventDefault();
// });

const flashConfig = { updateScene: updateScene };
const sceneConfig = {};

const customTemplate = {
  html: `<!-- 在这里编写HTML代码 -->

<div style="display: flex; flex-direction: column; justify-content: center; height:100%;">
  <!-- 设置了元素的data-custom-func属性之后，元素的内容会被替换成对应函数的执行结果 -->
  <div data-custom-func="char"
    style="align-self: center; font-size: 30rem; font-family: 自定义字体1, 自定义字体2, 思源黑体, sans-serif;"></div>
  <div data-custom-func="codePoint" style="font-size: 3rem; margin-left: 5%; font-family: 'Press Start 2P', monospace"></div>
  <div data-custom-func="自定义1" style="font-size: 3rem; margin-left: 5%;"></div>
</div>

<style>
  body {
    margin: 0;
  }
</style>

<style>
  @font-face {
    /* 字体名称 */
    font-family: "自定义字体1";
    /* 要加载的字体文件 */
    src: url(font1.ttf);
  }

  @font-face {
    font-family: "自定义字体2";
    src: url(font2.woff2);
  }
</style>`,
  js: `return {
  // 在这里编写JavaScript代码

  "自定义1": function (码位) {
    if (码位 === 0x4f8b) {
      return '这个字符是“例”'
    } else {
      return '这个字符不是“例”'
    }
  },
  // 可以添加更多自定义函数，函数应当满足：输入一个number，输出一个string

}`,
  systemJs: `return {
  // 内置的自定义函数
  codePoint: codePoint, // 获取字符的码位，格式为"U+0000"
  char: char, // 获取字符本身，如果码位大于U+10FFFF则为空字符串
}

function codePoint(pt) {
  return \`U+\${pt?.toString(16)?.toUpperCase()?.padStart(4, "0")}\`;
}

function char(pt) {
  return (pt <= 0x10ffff) ? \`\${String.fromCodePoint(pt)}\` : "";
}`,
}

// const defaultFlashConfig = {
//   startCodePoint: 0x4f8b,
//   endCodePoint: 0x3ffff,
//   fps: 30,
// };

window.onload = () => {
  applySceneConfig();
  applyFlashConfig();
  flash.reset(flashConfig);
  updateScene(flash.currentCodePoint);

  new ResizeObserver(entry => {
    scaleSceneToWrapper();
  }).observe(document.querySelector("#scene-wrapper"));
};

// scene

function applySceneConfig() {
  const customJs = getMonacoEditorByElement(document.querySelector('#monaco-editor-js'))?.getValue() ?? customTemplate.js;
  const customFuncs = new Function(customJs)();
  const systemJs = customTemplate.systemJs;
  const systemFuncs = new Function(systemJs)();
  sceneConfig.funcs = Object.assign({}, systemFuncs, isPlainObject(customFuncs) ? customFuncs : {});

  const iframe = document.querySelector('#scene-wrapper > iframe');
  sceneConfig.width = document.querySelector("#input_width").value;
  sceneConfig.height = document.querySelector("#input_height").value;
  iframe.style.width = sceneConfig.width + "px";
  iframe.style.height = sceneConfig.height + "px";
  scaleSceneToWrapper();

  const html = getMonacoEditorByElement(document.querySelector('#monaco-editor-html'))?.getValue() ?? customTemplate.html;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
}

function applyAndUpdateScene() {
  applySceneConfig();
  updateScene(flash.currentCodePoint);
}

function isPlainObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

function scaleSceneToWrapper() {
  const wrapper = document.querySelector("#scene-wrapper");
  const iframe = document.querySelector("#scene-wrapper > iframe");

  const scaleX = wrapper.clientWidth / sceneConfig.width;
  const scaleY = wrapper.clientHeight / sceneConfig.height;
  const scale = Math.min(scaleX, scaleY); // 保持比例铺满

  iframe.style.transform = `scale(${scale})`;
}

function updateScene(codePoint) {
  const iframe = document.querySelector("#scene-wrapper > iframe");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const elements = iframeDoc.querySelectorAll('[data-custom-func]');
  elements.forEach(e => {
    const funcName = e.dataset.customFunc;
    const func = sceneConfig.funcs[funcName];

    if (typeof func === 'function') {
      try {
        e.innerHTML = func(codePoint);
      } catch (err) {
        console.error(`执行函数 ${funcName} 时出错：`, err);
      }
    } else {
      console.error(`未找到函数 ${funcName}`);
    }
  });
}

// flash

let flash = {
  reset({ startCodePoint, endCodePoint, fps, updateScene }) {
    this.stop?.();

    flash = {
      startCodePoint: startCodePoint,
      endCodePoint: endCodePoint,
      fps: fps,
      updateScene: updateScene,
      reset: this.reset,
      currentCodePoint: startCodePoint,

      play() {
        this.interval = setInterval(() => {
          this.updateScene(this.currentCodePoint);
          if (this.currentCodePoint >= this.endCodePoint) this.stop();
          else this.currentCodePoint += 1;
        }, 1000 / this.fps);
      },

      pause() {
        clearInterval(this.interval);
        this.interval = undefined;
      },

      stop() {
        clearInterval(this.interval);
        this.interval = undefined;
      },

    };
  },
};

function playPauseFlash() {
  // if (!flash) initializeFlash();
  if (!flash.interval) flash.play();
  else flash.pause();
  // sceneNotUpToDate();
}

function applyFlashConfig() {
  let startCodePoint = codePointStrTocodePoint(document.querySelector("#input_startCodePoint").value);
  let endCodePoint = codePointStrTocodePoint(document.querySelector("#input_endCodePoint").value);
  let fps = parseInt(document.querySelector("#input_fps").value);
  if (!fps > 0) fps = 1;

  flashConfig.startCodePoint = startCodePoint;
  flashConfig.endCodePoint = endCodePoint;
  flashConfig.fps = fps;

  // sceneNotUpToDate();
}

function applyAndResetFlash() {
  applyFlashConfig();
  flash.reset(flashConfig);
  updateScene(flash.currentCodePoint);
}

function codePointStrTocodePoint(ptStr) {
  let pt = 0;
  if (new RegExp("^[0-9a-fA-F]{1,}$").test(ptStr)) pt = parseInt(`0x${ptStr}`);
  return pt;
}