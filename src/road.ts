import Vec2 from "./vec2";

class Road {
  public width = 100;
  public points: Vec2[] = [
    new Vec2(150, 150),
    new Vec2(1000, 100),
    new Vec2(1200, 300),
    new Vec2(1000, 500),
    new Vec2(200, 500),
  ];
  public innerPoints: Vec2[] = [];
  public outerPoints: Vec2[] = [];

  constructor() {
    this.points.forEach((point, index) => {
      const previous = this.points[(index + 1) % this.points.length];
      const next =
        this.points[(index + this.points.length - 1) % this.points.length];
      const normal1 = Vec2.normalize(
        previous.x - point.x,
        previous.y - point.y
      );
      const normal2 = Vec2.normalize(next.x - point.x, next.y - point.y);
      const normal3 = Vec2.normalize(
        normal2.x - normal1.x * -1,
        normal2.y - normal1.y * -1
      );

      this.innerPoints.push(
        new Vec2(
          point.x + normal3.x * this.width,
          point.y + normal3.y * this.width
        )
      );

      this.outerPoints.push(
        new Vec2(
          point.x - normal3.x * this.width,
          point.y - normal3.y * this.width
        )
      );
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // outer
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.moveTo(this.outerPoints[0].x, this.outerPoints[0].y);
    this.outerPoints.forEach((_, index) => {
      const nextPoint = this.outerPoints[(index + 1) % this.outerPoints.length];
      ctx.lineTo(nextPoint.x, nextPoint.y);
    });
    ctx.fillStyle = "#999";
    ctx.fill();
    ctx.stroke();

    // inner
    ctx.beginPath();
    ctx.moveTo(this.innerPoints[0].x, this.innerPoints[0].y);
    this.innerPoints.forEach((_, index) => {
      const nextPoint = this.innerPoints[(index + 1) % this.innerPoints.length];
      ctx.lineTo(nextPoint.x, nextPoint.y);
    });
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();

    // middle
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((_, index) => {
      const nextPoint = this.points[(index + 1) % this.points.length];
      ctx.lineTo(nextPoint.x, nextPoint.y);
    });
    ctx.stroke();
  }
}

export default Road;
