import Sensor from "./Sensor";
import { NeuralNetwork } from "../network";

type Controls = {
  keysDown: string[];
};
type ControlType = "user" | "ai";

class Car extends Phaser.Physics.Matter.Image {
  public odometer = 0;
  public lastCheckpoint!: string;
  public checkpointCount = 0;
  public brain!: NeuralNetwork;
  public sensor?: Sensor;
  public damaged = false;

  private steering = 0.04;
  private acceleration = 0.001;
  private controls: Controls = {
    keysDown: [],
  };
  private controlType: ControlType;

  constructor(
    world: Phaser.Physics.Matter.World,
    x: number = 0,
    y: number = 0,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {},
    controlType: ControlType = "user",
    sensor?: Sensor
  ) {
    super(world, x, y, "car", undefined, {
      chamfer: {
        radius: 6,
      },
      mass: 1,
      label: "car",
      friction: 0.06,
      frictionAir: 0.06,
      ...options,
    });
    world.scene.add.existing(this);
    this.sensor = sensor;
    this.controlType = controlType;

    if (this.sensor) {
      const body = this.body as MatterJS.BodyType;
      this.sensor.create();
      this.sensor.attach(body);
      this.sensor.setSensorVisibility(false);
      this.brain = new NeuralNetwork([this.sensor.rayCount + 1, 6, 4]);
    }
  }

  public reset() {
    this.odometer = 0;
    this.lastCheckpoint = "";
    this.checkpointCount = 0;
    this.damaged = false;
    this.angle = 0;
  }

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.controls.keysDown = [];
    if (this.controlType === "ai") {
      this.useBrain();
    } else {
      this.useKeyboard(cursors);
    }

    if (!this.damaged) {
      this.move();
    }

    const body = this.body as MatterJS.BodyType;
    this.odometer += body.speed / 10;

    if (this.sensor) {
      this.sensor.update();
    }
  }

  private move() {
    const body = this.body as MatterJS.BodyType;
    const maxSteering = Math.min(this.steering, body.speed * 0.2);

    if (this.controls.keysDown.includes("ArrowUp")) {
      this.applyForce(
        new Phaser.Math.Vector2(
          Math.sin(this.rotation) * this.acceleration,
          Math.cos(this.rotation) * -this.acceleration
        )
      );
    }

    if (this.controls.keysDown.includes("ArrowDown")) {
      this.applyForce(
        new Phaser.Math.Vector2(
          (Math.sin(this.rotation) * -this.acceleration) / 2,
          (Math.cos(this.rotation) * this.acceleration) / 2
        )
      );
    }

    if (this.controls.keysDown.includes("ArrowLeft")) {
      this.setAngularVelocity(-maxSteering);
    }

    if (this.controls.keysDown.includes("ArrowRight")) {
      this.setAngularVelocity(maxSteering);
    }
  }

  private useBrain() {
    if (this.sensor && this.brain) {
      const offsets = this.sensor.readings.map((s) =>
        s === null ? 0 : 1 - s.offset
      );
      const body = this.body as MatterJS.BodyType;
      const speed = body.speed / 100;

      const outputs = NeuralNetwork.feedForward(
        [...offsets, speed],
        this.brain
      );

      if (!!outputs[0]) {
        this.controls.keysDown.push("ArrowUp");
      }
      if (!!outputs[1]) {
        this.controls.keysDown.push("ArrowDown");
      }
      if (!!outputs[2]) {
        this.controls.keysDown.push("ArrowLeft");
      }
      if (!!outputs[3]) {
        this.controls.keysDown.push("ArrowRight");
      }
    }
  }

  private useKeyboard(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.up?.isDown) {
      this.controls.keysDown.push("ArrowUp");
    }
    if (cursors.left?.isDown) {
      this.controls.keysDown.push("ArrowLeft");
    }
    if (cursors.right?.isDown) {
      this.controls.keysDown.push("ArrowRight");
    }
    if (cursors.space?.isDown) {
      this.controls.keysDown.push("ArrowDown");
    }
  }
}

export default Car;
