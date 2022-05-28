import Controls from "./controls";

class Car {
  public controls: Controls = new Controls();
  public x: number = window.innerWidth / 2;
  public y: number = window.innerHeight / 2;

  public steering: number = 0.04;
  public angle: number = 0;
  public speed: number = 0;
  public acceleration: number = 0.2;
  public friction: number = 0.99;

  constructor() {}

  update() {
    if (this.controls.isPressing("ArrowUp")) {
      this.speed += this.acceleration;
    }
    if (this.controls.isPressing("ArrowDown")) {
      this.speed -= this.acceleration;
    }
    if (this.controls.isPressing("ArrowLeft")) {
      this.angle -= Math.min(this.steering, this.speed / 40);
    }
    if (this.controls.isPressing("ArrowRight")) {
      this.angle += Math.min(this.steering, this.speed / 40);
    }

    this.speed *= this.friction;
    this.y -= Math.cos(this.angle) * this.speed;
    this.x += Math.sin(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "tomato ";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.moveTo(-10, -20);
    ctx.lineTo(-10, 20);
    ctx.lineTo(10, 20);
    ctx.lineTo(10, -20);
    ctx.lineTo(-10, -20);
    ctx.fill();

    ctx.restore();
  }
}

export default Car;
