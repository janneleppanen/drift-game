class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("car", "src/assets/car.png");
  }

  create() {
    this.scene.start("race");
  }
}

export default Preloader;
