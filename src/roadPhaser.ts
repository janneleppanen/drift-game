class Road {
  public polygon = new Phaser.Geom.Polygon([
    0, 100, 100, 0, 400, 200, 800, 0, 900, 100, 900, 900, 800, 1000, 100, 1000,
    0, 900,
  ]);
  public object?: Phaser.GameObjects.Graphics;

  constructor(public scene: Phaser.Scene) {}

  create() {
    const graphics = this.scene.add.graphics({ x: 100, y: 100 });
    graphics.lineStyle(2, 0x00aa00);
    graphics.strokePoints(this.polygon.points, true);
    graphics.lineStyle(2, 0xaa0000);
    graphics.strokePoints(setPolygonOffet(this.polygon, 100, 1).points, true);
    graphics.lineStyle(2, 0xaa0000);
    graphics.strokePoints(setPolygonOffet(this.polygon, 100, -1).points, true);

    this.object = graphics;
  }
}

function setPolygonOffet(polygon: Phaser.Geom.Polygon, width = 100, dir = 1) {
  const newPoints = polygon.points.map((point, index) => {
    const previous = polygon.points[(index + 1) % polygon.points.length];
    const next =
      polygon.points[
        (index + polygon.points.length - 1) % polygon.points.length
      ];

    const n1 = Phaser.Geom.Line.GetNormal(
      new Phaser.Geom.Line(0, 0, previous.x - point.x, previous.y - point.y)
    );
    const n2 = Phaser.Geom.Line.GetNormal(
      new Phaser.Geom.Line(0, 0, next.x - point.x, next.y - point.y)
    );
    const n3 = Phaser.Geom.Line.GetNormal(
      new Phaser.Geom.Line(0, 0, n1.x + n2.x, n1.y + n2.y)
    );
    const n4 = Phaser.Geom.Line.GetNormal(
      new Phaser.Geom.Line(point.x, point.y, next.x, next.y)
    );

    const distance = Phaser.Geom.Line.Length(
      new Phaser.Geom.Line(n3.x, n3.y, n4.x, n4.y)
    );
    const flip = distance < 1 ? -1 : 1;

    return new Phaser.Geom.Point(
      point.x + n3.x * width * flip * dir,
      point.y + n3.y * width * flip * dir
    );
  });

  return new Phaser.Geom.Polygon(newPoints);
}

export default Road;
