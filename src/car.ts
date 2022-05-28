import Controls from "./controls";

class Car {
  public x: number = 0;
  public y: number = 0;
  public controls: Controls = new Controls();

  constructor(private size: number = 4) {}

  update() {
    if (this.controls.isPressing("ArrowUp")) {
      this.y -= 10;
    }
    if (this.controls.isPressing("ArrowDown")) {
      this.y += 10;
    }
    if (this.controls.isPressing("ArrowLeft")) {
      this.x -= 10;
    }
    if (this.controls.isPressing("ArrowRight")) {
      this.x += 10;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "tomato ";
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.moveTo(0, 0);
    ctx.lineTo(0, 100);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 0);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.restore();
  }
}

export default Car;
