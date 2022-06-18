export const lerp = (A: number, B: number, t: number) => {
  return A + (B - A) * t;
};

export function getPolygonOffet(
  points: Phaser.Math.Vector2[],
  width = 100,
  dir = 1
) {
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

export type Intersection = { x: number; y: number; offset: number } | null;

export function getIntersection(
  A: Phaser.Math.Vector2,
  B: Phaser.Math.Vector2,
  C: Phaser.Math.Vector2,
  D: Phaser.Math.Vector2
): Intersection {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}
