import "phaser";
import Car from "../carPhaser";

class RoadScene extends Phaser.Scene {
  public car: Car;

  constructor() {
    super({ key: "RoadScene" });
    this.car = new Car(this);
  }

  create(): void {
    this.car.create();
  }

  update(): void {
    this.car.update();
  }
}

export default RoadScene;
