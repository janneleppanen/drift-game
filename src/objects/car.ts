import Phaser from "phaser";
import Sensor from "../sensor";
// import Sensor from "./sensor";

class Car extends Phaser.Physics.Matter.Image {
  // private steering: number = 3.0;
  private steering: number = 0.04;
  private acceleration: number = 0.002;
  private friction = 0.06;
  private sensor!: any;

  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig
  ) {
    super(world, x, y, "car", undefined, {
      chamfer: {
        radius: 6,
      },
      mass: 1,
      ...options,
    });
    world.scene.add.existing(this);
    this.setFriction(this.friction, this.friction);
    this.sensor = new Sensor(world.scene);
    this.sensor.create();

    // this.s = new Sensor(world);
    // this.s.create();
    // this.s.attach(this);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const maxSteering = Math.min(this.steering, this.body.speed * 0.2);
    this.sensor.moveTo(this.body.position.x, this.body.position.y, this.angle);

    if (cursors.up?.isDown) {
      this.applyForce(
        new Phaser.Math.Vector2(
          Math.sin(this.rotation) * this.acceleration,
          Math.cos(this.rotation) * -this.acceleration
        )
      );
    }

    if (cursors.space?.isDown) {
      this.applyForce(
        new Phaser.Math.Vector2(
          (Math.sin(this.rotation) * -this.acceleration) / 2,
          (Math.cos(this.rotation) * this.acceleration) / 2
        )
      );
    }

    if (cursors.left?.isDown) {
      // this.setAngle((this.angle -= maxSteering));
      this.setAngularVelocity(-maxSteering);
    }

    if (cursors.right?.isDown) {
      this.setAngularVelocity(maxSteering);
      // this.setAngle((this.angle += maxSteering));
    }
  }
}

export default Car;
