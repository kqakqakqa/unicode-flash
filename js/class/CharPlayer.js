let charPlayer = {
  new(config) {
    this.stop?.();

    this = {
      startCode: config.startCode,
      endCode: config.endCode,
      fps: config.fps,
      showChar: config.showChar,
      interval: undefined,

      new: this.new,

      initialize() {
        this.currentCode = this.startCode;
        this.showChar(this.currentCode);
      },

      play() {
        this.interval = setInterval(() => {
          this.showChar(this.currentCode);
          if (this.currentCode >= this.endCode) this.stop();
          else this.currentCode += 1;
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