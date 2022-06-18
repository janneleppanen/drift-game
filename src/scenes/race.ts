import Phaser from "phaser";
import Car from "../objects/car";
import Road from "../objects/road";
import Sensor from "../objects/sensor";

class Race extends Phaser.Scene {
  private car!: Phaser.Physics.Matter.Image;
  private road!: Road;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("race");
  }

  preload() {
    this.load.image("car", "src/assets/car.png");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const { width, height } = this.scale;
    this.road = new Road(this.matter.world);
    this.road.create();
    this.car = new Car(
      this.matter.world,
      -50,
      400,
      {},
      new Sensor(this, this.road)
    );
  }

  update() {
    this.car.update(this.cursors);
    this.cameras.main.pan(this.car.x, this.car.y, 0);
  }
}

export default Race;
