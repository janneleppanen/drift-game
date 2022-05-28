class Car {
  constructor(private size: number = 4) {}

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "tomato ";
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 100);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 0);
    ctx.lineTo(0, 0);
    ctx.fill();
  }
}

export default Car;
