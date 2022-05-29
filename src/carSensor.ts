import Car from "./car";
import { getIntersection, Intersection, lerp } from "./utils";
import Vec2 from "./vec2";

class CarSensor {
  public rayCount = 5;
  public raySpread = Math.PI;
  public rayLength = 200;
  public rays: Vec2[][];
  public readings: (Intersection | undefined)[];

  constructor(public car: Car, public obstacles: Vec2[][]) {
    this.rays = [];
    this.readings = [];
  }

  update() {
    this.castRays();
    this.readings = [];

    this.readings = this.rays.map((ray) => {
      return this.getReading(ray, this.obstacles);
    });
  }

  private castRays() {
    this.rays = [];

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

      this.rays.push([rayStart, rayEnd]);
    }
  }

  private getReading(ray: Vec2[], obstacles: Vec2[][]) {
    let touches: Intersection[] = [];

    obstacles.forEach((obstacle) => {
      obstacle.forEach((point, index) => {
        const nextPoint = obstacle[(index + 1) % obstacle.length];
        const touch = getIntersection(ray[0], ray[1], point, nextPoint);

        if (touch) {
          touches.push(touch);
        }
      });
    });

    if (touches.length === 0) {
      return undefined;
    }

    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((touch) => touch.offset === minOffset);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rays.forEach((ray, index) => {
      let rayEnd: Vec2 = ray[1];

      if (this.readings[index]) {
        const reading = this.readings[index] as Intersection;
        rayEnd = new Vec2(reading?.x, reading.y);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(rayEnd.x, rayEnd.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "orange";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(rayEnd.x, rayEnd.y);
      ctx.stroke();
    });
  }
}

export default CarSensor;
