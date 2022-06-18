class Car extends Phaser.Physics.Matter.Image {
  private steering: number = 0.04;
  private acceleration: number = 0.002;

  constructor(
    world: Phaser.Physics.Matter.World,
    x: number = 0,
    y: number = 0,
    options: Phaser.Types.Physics.Matter.MatterBodyConfig = {}
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
  }

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors) {
      this.move(cursors);
    }
  }

  private move(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const body = this.body as MatterJS.BodyType;
    const maxSteering = Math.min(this.steering, body.speed * 0.2);

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
      this.setAngularVelocity(-maxSteering);
    }

    if (cursors.right?.isDown) {
      this.setAngularVelocity(maxSteering);
    }
  }
}

export default Car;
