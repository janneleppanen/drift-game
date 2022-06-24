class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("car", "src/assets/car.png");
    this.load.image("tyre", "src/assets/tyre.png");
    this.load.image("dust", "src/assets/dust.png");
  }

  create() {
    this.scene.start("race");
  }
}

export default Preloader;
