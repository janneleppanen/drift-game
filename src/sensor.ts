class Sensors {
  public rayCount = 5;
  public rayLength = 400;
  public raySpread = Math.PI / 2;

  public graphics!: Phaser.GameObjects.Graphics;

  constructor(public scene: Phaser.Scene) {}

  create() {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00aaaa);

    for (let i = 0; i < this.rayCount; i++) {
      const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      console.log(t);
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
  }

  moveTo(x: number, y: number, angle: number) {
    this.graphics.x = x;
    this.graphics.y = y;
    this.graphics.angle = angle;
  }
}

export default Sensors;
