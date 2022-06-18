import Car from "../objects/Car";
import Road from "../objects/Road";

const route = [
  new Phaser.Math.Vector2(0, 100),
  new Phaser.Math.Vector2(100, 0),
  new Phaser.Math.Vector2(400, 200),
  new Phaser.Math.Vector2(800, 0),
  new Phaser.Math.Vector2(900, 100),
  new Phaser.Math.Vector2(700, 500),
  new Phaser.Math.Vector2(900, 900),
  new Phaser.Math.Vector2(800, 1000),
  new Phaser.Math.Vector2(100, 1000),
  new Phaser.Math.Vector2(0, 900),
];

class Race extends Phaser.Scene {
  private cars: Car[] = [];
  private road!: Road;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("race");
  }

  init() {
    this.road = new Road(this.matter.world, route);
    this.cars.push(new Car(this.matter.world, 0, 600, {}));
    this.road.create();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.cars.forEach((car) => car.update(this.cursors));
    this.cameras.main.pan(this.cars[0].x, this.cars[0].y, 10);
  }
}

export default Race;
