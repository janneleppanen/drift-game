class Road extends Phaser.Physics.Matter.Factory {
  private route = [
    new Phaser.Math.Vector2(0, 100),
    new Phaser.Math.Vector2(100, 0),
    new Phaser.Math.Vector2(400, 200),
    new Phaser.Math.Vector2(800, 0),
    new Phaser.Math.Vector2(900, 100),
    new Phaser.Math.Vector2(900, 900),
    new Phaser.Math.Vector2(800, 1000),
    new Phaser.Math.Vector2(100, 1000),
    new Phaser.Math.Vector2(0, 900),
  ];

  constructor(world: Phaser.Physics.Matter.World) {
    super(world);
  }

  create() {
    this.drawWalls(getPolygonOffet(this.route, 200, 1));
    this.drawWalls(getPolygonOffet(this.route, 40, -1));
  }

  drawWalls(points: Phaser.Math.Vector2[]) {
    points.forEach((point, index) => {
      const nextPoint = points[(index + 1) % points.length];
      const vec = new Phaser.Math.Vector2(
        point.x - nextPoint.x,
        point.y - nextPoint.y
      );
      const width = vec.length();
      const angle = vec.angle();
      const mid = point.clone().lerp(nextPoint, 0.5);

      this.rectangle(mid.x, mid.y, width, 10, {
        isStatic: true,
        angle,
      });
    });
  }
}

function getPolygonOffet(points: Phaser.Math.Vector2[], width = 100, dir = 1) {
  const newPoints = points.map((point, index) => {
    const previous = points[(index + 1) % points.length];
    const next = points[(index + points.length - 1) % points.length];

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

    return new Phaser.Math.Vector2(
      point.x + n3.x * width * flip * dir,
      point.y + n3.y * width * flip * dir
    );
  });

  return newPoints;
}

export default Road;
