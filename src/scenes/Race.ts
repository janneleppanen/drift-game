import Car from "../objects/Car";
import Gui from "../objects/Gui";
import Road from "../objects/Road";
import Sensor from "../objects/Sensor";

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
  private gui!: Gui;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("race");
  }

  init() {
    this.road = new Road(this.matter.world, route);
    this.road.create();

    this.cars.push(
      new Car(
        this.matter.world,
        -75,
        600,
        {},
        "user",
        new Sensor(this.matter.world, this.road.lines)
      )
    );
    this.cursors = this.input.keyboard.createCursorKeys();
    this.gui = new Gui(this);
    this.gui.create();

    this.setupCheckpointCollision();
  }

  update() {
    this.cars.forEach((car) => car.update(this.cursors));
    this.cameras.main.pan(this.cars[0].x, this.cars[0].y, 10);

    this.gui.setTravelled(this.cars[0].odometer);
    this.gui.setCheckpointCount(this.cars[0].checkpointCount);
  }

  setupCheckpointCollision() {
    this.road.checkpoints.forEach((checkpoint) => {
      const car = this.cars[0];
      const carBody = this.cars[0].body as MatterJS.BodyType;
      checkpoint.setOnCollideWith(
        carBody,
        (_: MatterJS.BodyType, collisionData: { id: string }) => {
          if (car.lastCheckpoint !== collisionData.id) {
            car.lastCheckpoint = collisionData.id;
            car.checkpointCount++;
          }
        }
      );
    });
  }
}

export default Race;
