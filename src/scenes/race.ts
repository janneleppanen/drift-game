import "phaser";
import Car from "../car";
import Road from "../road";

let frame = 0;
class RoadScene extends Phaser.Scene {
  public car: Car;
  public road: Road;
  public hit?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "RoadScene" });
    this.car = new Car(this);
    this.road = new Road(this);
  }

  create(): void {
    this.car.create();
    this.road.create();
    this.cameras.main.zoom = 1;

    this.g = this.add.graphics();
    this.g.moveTo(-50, -50);
    this.g.lineTo(50, 50);
    this.g.moveTo(-50, 50);
    this.g.lineTo(50, -50);
    this.g.stroke();
    // Phaser.Geom.GetRaysFromPointToPolygon
  }

  update(time): void {
    const carLine = new Phaser.Geom.Line(
      this.car.points[0].x,
      this.car.points[0].y,
      this.car.points[1].x,
      this.car.points[1].y
    );
    const roadLine = new Phaser.Geom.Line(
      this.road.points[2].x,
      this.road.points[2].y,
      this.road.points[1].x,
      this.road.points[1].y
    );
    // const i = Phaser.Geom.Intersects.GetLineToPolygon(carLine, this.road);
    let i = new Phaser.Math.Vector3(0, 0, 10);
    this.road.points.forEach((point, index) => {
      const lastPoint = this.road.points[(index + 1) % this.road.points.length];
      if (frame === 100) {
        console.log({ point, lastPoint, carLine, i });
      }
      i = Phaser.Geom.Intersects.GetLineToLine(
        carLine,
        new Phaser.Geom.Line(lastPoint.x, lastPoint.y, point.x, point.y),
        i
      );
    });

    if (i && this.hit) {
      console.log({
        i,
        carLine,
        roadLine,
      });
      this.hit.x = i.x;
      this.hit.y = i.y;
    }

    this.car.update();
    if (this.car.object) {
      this.cameras.main.pan(this.car.object.x, this.car.object.y, 1);
    }

    frame++;
  }
}

export default RoadScene;
