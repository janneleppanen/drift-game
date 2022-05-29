import CarSensor from "./carSensor";
import Controls from "./controls";
import Road from "./road";
import { polysIntersect } from "./utils";
import Vec2 from "./vec2";

class Car {
  public controls: Controls = new Controls();
  public x: number = window.innerWidth / 2;
  public y: number = window.innerHeight / 2;
  public width: number = 20;
  public height: number = 40;

  public steering: number = 0.04;
  public angle: number = 0;
  public speed: number = 0;
  public acceleration: number = 0.2;
  public friction: number = 0.99;
  public maxSpeed: number = 6;

  public deltaX: number = 0;
  public deltaY: number = 0;

  public drifting: number = 0;
  public polygon: Vec2[] = [];
  public sensor: CarSensor;
  public broken = false;
  public odometer = 0;

  constructor(public road: Road) {
    this.sensor = new CarSensor(this, [road.innerPoints, road.outerPoints]);
  }

  update() {
    if (this.broken) return;

    this.calculateSpeed();
    this.calculateDrifting();
    this.polygon = this.createPolygon();

    this.deltaX = Math.sin(this.angle + this.drifting) * this.speed;
    this.deltaY = Math.cos(this.angle + this.drifting) * this.speed;

    this.x += this.deltaX;
    this.y += this.deltaY;

    this.odometer += this.speed;

    this.checkCrash();
    this.sensor.update();

  }

  calculateSpeed() {
    if (this.controls.isPressing("ArrowUp")) {
      this.speed += this.acceleration;
    }
    if (this.controls.isPressing("ArrowDown")) {
      this.speed -= this.acceleration;
    }
    if (this.controls.isPressing("ArrowLeft")) {
      this.angle += Math.min(this.steering, this.speed / 40);
    }
    if (this.controls.isPressing("ArrowRight")) {
      this.angle -= Math.min(this.steering, this.speed / 40);
    }

    this.speed *= this.friction;
    this.speed = Math.min(this.speed, this.maxSpeed);
    this.speed = Math.max(this.speed, -this.maxSpeed / 2);
  }

  calculateDrifting() {
    if (
      this.controls.isPressing("ArrowUp") &&
      this.controls.isPressing("ArrowLeft") &&
      this.speed > 0
    ) {
      this.drifting -= 0.02;
    } else if (
      this.controls.isPressing("ArrowUp") &&
      this.controls.isPressing("ArrowRight") &&
      this.speed > 0
    ) {
      this.drifting += 0.02;
    } else {
      this.drifting *= this.friction * this.friction;
    }

    this.drifting *= this.friction;
  }

  checkCrash() {
    [this.road.innerPoints, this.road.outerPoints].forEach((obstacle) => {
      const i = polysIntersect(obstacle, this.polygon);
      if (i) {
        this.broken = true;
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.save();
    ctx.fillStyle = this.broken ? "gray" : "tomato";
    ctx.strokeStyle = "black";

    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.lineTo(this.polygon[0].x, this.polygon[0].y);
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    // this.drawForces(ctx);
    this.sensor.draw(ctx);
  }

  drawForces(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "green";

    ctx.moveTo(0, 0);
    ctx.lineTo(this.deltaX * 10, this.deltaY * 10);

    ctx.stroke();
    ctx.restore();
  }

  private createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push(
      new Vec2(
        this.x - Math.sin(this.angle - alpha) * rad,
        this.y - Math.cos(this.angle - alpha) * rad
      )
    );

    points.push(
      new Vec2(
        this.x - Math.sin(this.angle + alpha) * rad,
        this.y - Math.cos(this.angle + alpha) * rad
      )
    );

    points.push(
      new Vec2(
        this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
        this.y - Math.cos(Math.PI + this.angle - alpha) * rad
      )
    );

    points.push(
      new Vec2(
        this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
        this.y - Math.cos(Math.PI + this.angle + alpha) * rad
      )
    );

    return points;
  }
}

export default Car;
