import Car from "./car";
import { getIntersection, Intersection, lerp } from "./utils";
import Vec2 from "./vec2";

class CarSensor {
  public rayCount = 5;
  public raySpread = Math.PI;
  public rayLength = 200;

  constructor(public car: Car, public obstacles: Vec2[][]) {}

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const rayStart = new Vec2(this.car.x, this.car.y);
      const rayEnd = new Vec2(
        this.car.x + Math.sin(rayAngle) * this.rayLength,
        this.car.y + Math.cos(rayAngle) * this.rayLength
      );
      let intersection: Intersection | null = null;

      this.obstacles.forEach((obstacle) => {
        obstacle.forEach((point, index) => {
          const nextPoint = obstacle[(index + 1) % obstacle.length];
          const i = getIntersection(rayStart, rayEnd, point, nextPoint);
          if (i) {
            intersection = i;
            rayEnd.x = intersection.x;
            rayEnd.y = intersection.y;
          }
        });
      });

      if (intersection) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(rayEnd.x, rayEnd.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "orange";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rayStart.x, rayStart.y);
      ctx.lineTo(rayEnd.x, rayEnd.y);
      ctx.stroke();
    }
  }
}

export default CarSensor;
