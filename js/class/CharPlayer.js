class CharPlayer {
    constructor(config) {
        if (CharPlayer.instance) CharPlayer.instance.stop();

        this.startCode = config.startCode;
        this.endCode = config.endCode;
        this.fps = config.fps;
        this.showChar = config.showChar;

        CharPlayer.instance = this;
    }

    initialize() {
        this.currentCode = this.startCode;
        this.showChar(this.currentCode);
    }

    play() {
        this.interval = setInterval(() => {
            this.showChar(this.currentCode);
            if (this.currentCode >= this.endCode) this.stop();
            this.currentCode += 1;
        }, 1000 / this.fps);
    }

    pause() {
        clearInterval(this.interval);
        this.interval = undefined;
    }

    stop() {
        clearInterval(this.interval);
        CharPlayer.instance = undefined;
    }
}