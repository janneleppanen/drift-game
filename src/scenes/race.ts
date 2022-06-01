import "phaser";
import Car from "../carPhaser";
import Road from "../roadPhaser";

class RoadScene extends Phaser.Scene {
  public car: Car;
  public road: Road;
  public g?: Phaser.GameObjects.Graphics;
  public r?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "RoadScene" });
    this.car = new Car(this);
    this.road = new Road(this);
  }

  create(): void {
    this.car.create();
    this.road.create();
    this.cameras.main.zoom = 0.8;

    this.g = this.add.graphics();
    this.g.moveTo(-50, -50);
    this.g.lineTo(50, 50);
    this.g.lineTo(-50, 50);
    this.g.lineTo(50, -50);
    this.g.stroke();
    // Phaser.Geom.GetRaysFromPointToPolygon

    this.r = this.add.graphics();
    this.r.strokeRect(-50, -50, 100, 100);
  }

  update(): void {
    const line = new Phaser.Geom.Line(
      this?.car?.object?.x,
      this?.car?.object?.y,
      this?.car?.object?.x + 10,
      this?.car?.object?.y + 10
    );
    const rect = new Phaser.Geom.Rectangle(
      this.car.object.x,
      this.car.object.y,
      10,
      0
    );
    // const o = Phaser.Geom.Intersects.GetLineToPoints(
    //   line,
    //   this.road.polygon.points
    // );
    // const o = Phaser.Geom.Intersects.GetLineToPolygon(line, this.road.polygon);

    // if (o) {
    //   console.log(o);
    //   this.g.x = o.x;
    //   this.g.y = o.y;
    // }
    this.r.rotation += 0.01;

    const i = Phaser.Geom.Intersects.RectangleToRectangle(
      this.car.object,
      this.r
    );

    if (i) {
      this.g.x = i.x;
      this.g.y = i.y;
    }

    this.car.update();
    if (this.car.object) {
      this.cameras.main.pan(this.car.object.x, this.car.object.y, 1);
    }
  }
}

export default RoadScene;
