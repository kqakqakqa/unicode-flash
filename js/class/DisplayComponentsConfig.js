class DisplayComponentsConfig {
    #configs = {};
    constructor() {
        if (DisplayComponentsConfig.instance) DisplayComponentsConfig.instance = undefined;
        DisplayComponentsConfig.instance = this;
    }

    getConfig(id) {
        if (!this.#configs[id]) {
            this.#configs[id] = this.#newConfig()
        }
        return this.#configs[id];
    }

    getConfigs() {
        return this.#configs;
    }

    setConfig(id, config) {
        if (!config || !(config instanceof Object)) return;
        if (!this.#configs[id]) {
            this.#configs[id] = this.#newConfig()
        }
        for (let key of ["x", "y", "xAlign", "yAlign", "fontSize", "fontColor", "fontFamily", "visible", "custom"]) {
            this.#setConfigKey(id, config, key);
        }
    }

    setConfigs(configs) {
        if (!configs || !(configs instanceof Object)) return;
        for (let id of Object.keys(configs)) {
            this.setConfig(id, configs[id]);
        }
    }

    #setConfigKey(id, config, key) {
        if (config[key]) {
            this.#configs[id][key] = config[key];
        }
    }

    #newConfig() {
        return {
            x: 50,
            y: 50,
            xAlign: "center",
            yAlign: "center",
            fontSize: 10,
            fontColor: "#000000",
            fontFamily: "",
            visible: true,
            custom: ""
        };
    }
}