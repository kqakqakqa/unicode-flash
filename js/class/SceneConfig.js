class SceneConfig {
    #keys = ["text", "x", "y", "xAlign", "yAlign", "font", "fontSize", "fontColor", "visible", "custom"];
    configs = [];

    constructor(configs) {
        if (SceneConfig.instance) SceneConfig.instance = undefined;
        SceneConfig.instance = this;

        this.#setConfigs(configs);
    }

    // getConfig(id) {
    //     if (!this.#configs[id]) {
    //         this.#configs[id] = this.#newConfig()
    //     }
    //     return this.#configs[id];
    // }

    // getConfigs() {
    //     return this.#configs;
    // }

    // setConfig(id, config) {
    //     if (!config || !(config instanceof Object)) return;
    //     if (!this.#configs[id]) {
    //         this.#configs[id] = this.#newConfig()
    //     }
    //     for (let key of ["x", "y", "xAlign", "yAlign", "fontSize", "fontColor", "fontFamily", "visible", "custom"]) {
    //         this.#setConfigKey(id, config, key);
    //     }
    // }

    #setConfigs(configs) {
        if (!configs || !(configs instanceof Array)) return;
        let newConfigs = [];
        configs.forEach(config => {
            if (!config || !(config instanceof Object)) return;
            let newConfig = {};
            for (let key of this.#keys) {
                if (config[key]) {
                    newConfig[key] = config[key];
                }
            }
            newConfigs.push(newConfig);
        });
        return newConfigs;
    }

    // #setConfigKey(id, config, key) {
    //     if (config[key]) {
    //         this.#configs[id][key] = config[key];
    //     }
    // }

    // #newConfig() {
    //     return {
    //         text: "",
    //         x: 50,
    //         y: 50,
    //         xAlign: "middle",
    //         yAlign: "middle",
    //         font: "",
    //         fontSize: "",
    //         fontColor: "",
    //         visible: true,
    //         custom: ""
    //     };
    // }
}