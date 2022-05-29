import Vec2 from "./vec2";

export const lerp = (A: number, B: number, t: number) => {
  return A + (B - A) * t;
};

export interface Intersection extends Vec2 {
  offset: number;
}

export function getIntersection(
  A: Vec2,
  B: Vec2,
  C: Vec2,
  D: Vec2
): Intersection | null {
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

export function polysIntersect(poly1: Vec2[], poly2: Vec2[]) {
  return poly1.find((_, index1) => {
    return !!poly2.find((_, index2) => {
      return getIntersection(
        poly1[index1],
        poly1[(index1 + 1) % poly1.length],
        poly2[index2],
        poly2[(index2 + 1) % poly2.length]
      );
    });
  });
}
