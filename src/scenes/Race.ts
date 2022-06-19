import { NeuralNetwork } from "../network";
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
  private bestCar!: Car;
  private carCount = 30;
  private bestScore = 0;

  constructor() {
    super("race");
  }

  init() {
    this.road = new Road(this.matter.world, route);
    this.road.create();

    for (let i = 0; i < this.carCount; i++) {
      this.cars.push(
        new Car(
          this.matter.world,
          -75,
          600,
          {
            collisionFilter: {
              category: this.matter.world.nextCategory(),
              mask: this.road.collisionGroup,
            },
          },
          "ai",
          new Sensor(this.matter.world, this.road.lines)
        )
      );
    }

    if (localStorage.getItem("bestAI")) {
      for (let i = 0; i < this.cars.length; i++) {
        const bestAI = JSON.parse(
          localStorage.getItem("bestAI") || ""
        ) as NeuralNetwork;
        this.cars[i].brain = bestAI;

        if (i != 0 && this.cars[i].brain) {
          NeuralNetwork.mutate(this.cars[i].brain as NeuralNetwork, 0.2);
        }
      }
    }

    this.bestCar = this.cars[0];
    this.cursors = this.input.keyboard.createCursorKeys();
    this.gui = new Gui(this);
    this.gui.create();

    this.setupCheckpointCollision();

    document.querySelector(".rerun")?.addEventListener("click", () => {
      localStorage.setItem("bestAI", JSON.stringify(this.bestCar?.brain));
      window.location.reload();
    });

    document.querySelector(".reset-ai")?.addEventListener("click", () => {
      localStorage.removeItem("bestAI");
      window.location.reload();
    });
  }

  update() {
    this.cars.forEach((car) => car.update(this.cursors));
    this.cameras.main.pan(this.bestCar.x, this.bestCar.y, 10);

    this.getBestBrain();
    this.gui.setScore(this.bestScore);
  }

  setupCheckpointCollision() {
    this.road.checkpoints.forEach((checkpoint) => {
      this.cars.forEach((car) => {
        const carBody = car.body as MatterJS.BodyType;

        if (carBody) {
          checkpoint.setOnCollideWith(
            carBody,
            (_: MatterJS.BodyType, collisionData: { id: string }) => {
              if (car.lastCheckpoint !== collisionData.id) {
                car.lastCheckpoint = collisionData.id;
                car.checkpointCount++;
              }
            }
          );
        }
      });
    });
  }

  getBestBrain() {
    this.cars.forEach((car) => {
      const points = car.checkpointCount * 100 + car.odometer;
      if (points > this.bestScore) {
        this.bestScore = points;
        this.bestCar = car;
        this.cars.forEach((car) => {
          car.setAlpha(0.1);
          car.sensor?.setSensorVisibility(false);
        });
        this.bestCar.setAlpha(1);
        this.bestCar.sensor?.setSensorVisibility(true);
      }
    });
  }
}

export default Race;
