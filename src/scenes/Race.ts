import { NeuralNetwork } from "../network";
import Car from "../objects/Car";
import Gui from "../objects/Gui";
import Road from "../objects/Road";
import Sensor from "../objects/Sensor";

const AI_MUTATION_VARIATION = 0.1;
const CAR_COUNT = 30;

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
  private bestScore = 0;

  constructor() {
    super("race");
  }

  init() {
    this.road = new Road(this.matter.world, route);
    this.road.create();

    for (let i = 0; i < CAR_COUNT; i++) {
      const car = new Car(
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
      );
      car.setOnCollide(
        ({ bodyA, bodyB }: Phaser.Types.Physics.Matter.MatterCollisionData) => {
          if ([bodyA.label, bodyB.label].includes("wall")) {
            car.damaged = true;
            setTimeout(() => this.respawnCar(car), 1000);
          }
        }
      );
      this.cars.push(car);
    }

    if (localStorage.getItem("bestAI")) {
      for (let i = 0; i < this.cars.length; i++) {
        const bestAI = JSON.parse(
          localStorage.getItem("bestAI") || ""
        ) as NeuralNetwork;

        this.cars[i].brain = bestAI;

        if (i !== 0 && this.cars[i].brain) {
          NeuralNetwork.mutate(
            this.cars[i].brain as NeuralNetwork,
            AI_MUTATION_VARIATION
          );
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
      // setTimeout(() => window.location.reload(), 100);
    });

    document.querySelector(".reset-ai")?.addEventListener("click", () => {
      localStorage.removeItem("bestAI");
      // setTimeout(() => window.location.reload(), 100);
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
      const points = car.checkpointCount;
      if (points > this.bestScore) {
        this.bestScore = points;
        this.bestCar = car;
        this.cars.forEach((car) => {
          car.setAlpha(0.1);
          car.sensor?.setSensorVisibility(false);
          car.setTint(0xffffff);
        });

        this.bestCar.setTint(0x0099ff);
        this.bestCar.setAlpha(1);
        this.bestCar.sensor?.setSensorVisibility(true);
      }
    });
  }

  respawnCar(car: Car) {
    car.reset();
    car.setPosition(-75, 600);

    if (car !== this.bestCar) {
      car.brain = JSON.parse(JSON.stringify(this.bestCar.brain));
      NeuralNetwork.mutate(car.brain as NeuralNetwork, AI_MUTATION_VARIATION);
    }
  }
}

export default Race;
