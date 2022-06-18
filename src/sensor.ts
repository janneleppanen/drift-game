import Road from "./objects/road";

class Sensors {
  public rayCount = 5;
  public rayLength = 400;
  public raySpread = Math.PI / 2;

  public graphics!: Phaser.GameObjects.Graphics;
  public target!: MatterJS.BodyType;
  public road!: Road;
  public readings: any = [];

  constructor(public scene: Phaser.Scene, road: Road) {
    this.road = road;
  }

  create() {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00aaaa);

    for (let i = 0; i < this.rayCount; i++) {
      const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);

      // TODO: Fix lerp to work with different spreads
      const vec = new Phaser.Math.Vector2(
        Math.sin(-this.raySpread / 2) * this.rayLength,
        Math.cos(-this.raySpread / 2) * this.rayLength
      ).lerp(
        new Phaser.Math.Vector2(
          Math.sin(this.raySpread / 2) * this.rayLength,
          Math.cos(this.raySpread / 2) * this.rayLength
        ),
        t
      );
      graphics.moveTo(0, 0);
      graphics.lineTo(vec.x, -vec.y);
    }
    graphics.stroke();
    this.graphics = graphics;
    console.log(this.graphics);
  }

  attach(body: MatterJS.BodyType) {
    this.target = body;
  }

  update() {
    if (this.target) {
      this.graphics.x = this.target.position.x;
      this.graphics.y = this.target.position.y;
      this.graphics.angle = (this.target.angle * 360) / (Math.PI * 2);
    }
    this.read();
  }

  read() {
    this.ra;
  }
}

export default Sensors;
