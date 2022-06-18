import Car from "../objects/Car";

class Race extends Phaser.Scene {
  private cars: Car[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("race");
  }

  init() {
    this.cars.push(new Car(this.matter.world, 100, 100, {}));
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.cars.forEach((car) => car.update(this.cursors));
    // this.cameras.main.pan(this.cars[0].x, this.cars[0].y, 10);
  }
}

export default Race;
