import "phaser";

const keyCodes = Phaser.Input.Keyboard.KeyCodes;

type KeyMap = {
  [key: string]: Phaser.Input.Keyboard.Key;
};

class Car {
  public speed = 0;
  public acceleration = 0.2;
  public friction = 0.99;
  public steering = 0.02;
  public drifting = 0;
  public maxSpeed = 5;

  public polygon = new Phaser.Geom.Polygon([
    -10, -20, -10, 20, 10, 20, 10, -20,
  ]);
  public keys?: KeyMap;
  public object?: Phaser.GameObjects.Graphics;

  constructor(public scene: Phaser.Scene) {}

  create() {
    // Graphics
    const graphics = this.scene.add.graphics({ x: 100, y: 100 });
    graphics.lineStyle(2, 0x00aa00);
    graphics.beginPath();
    graphics.moveTo(this.polygon.points[0].x, this.polygon.points[0].y);
    this.polygon.points.forEach((point) => {
      graphics.lineTo(point.x, point.y);
    });
    graphics.closePath();
    graphics.strokePath();

    this.object = graphics;

    this.keys = {
      UP: this.scene.input.keyboard.addKey(keyCodes.UP),
      LEFT: this.scene.input.keyboard.addKey(keyCodes.LEFT),
      RIGHT: this.scene.input.keyboard.addKey(keyCodes.RIGHT),
      DOWN: this.scene.input.keyboard.addKey(keyCodes.DOWN),
    };
  }

  update() {
    if (!this.object) return;

    this.calculateSpeed();
    this.calculateDrifting();

    this.object.x +=
      Math.sin(this.object.rotation - this.drifting) * this.speed;
    this.object.y -=
      Math.cos(this.object.rotation - this.drifting) * this.speed;
  }

  calculateSpeed() {
    if (!this.object) return;

    if (this.keys?.UP.isDown) {
      this.speed += this.acceleration;
    }
    if (this.keys?.DOWN.isDown) {
      this.speed -= this.acceleration;
    }
    if (this.keys?.LEFT.isDown) {
      this.object.rotation -= Math.min(this.steering, this.speed / 40);
    }
    if (this.keys?.RIGHT.isDown) {
      this.object.rotation += Math.min(this.steering, this.speed / 40);
    }

    this.speed *= this.friction;
    this.speed = Math.min(this.speed, this.maxSpeed);
    this.speed = Math.max(this.speed, -this.maxSpeed / 2);
  }

  calculateDrifting() {
    if (this.keys?.UP.isDown && this.keys?.LEFT.isDown && this.speed > 0) {
      this.drifting -= 0.02;
    } else if (
      this.keys?.UP.isDown &&
      this.keys?.RIGHT.isDown &&
      this.speed > 0
    ) {
      this.drifting += 0.02;
    } else {
      this.drifting *= this.friction * this.friction;
    }

    this.drifting *= this.friction;
  }
}

export default Car;
