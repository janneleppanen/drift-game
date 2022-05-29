import Car from "./car";
import { lerp } from "./utils";

class CarSensor {
  public rayCount = 5;
  public raySpread = Math.PI;
  public rayLength = 200;

  constructor(public car: Car) {}

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      ctx.strokeStyle = "orange";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.car.x, this.car.y);
      ctx.lineTo(
        this.car.x + Math.sin(rayAngle) * this.rayLength,
        this.car.y + Math.cos(rayAngle) * this.rayLength
      );
      ctx.stroke();
    }
  }
}

export default CarSensor;
