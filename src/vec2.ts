class Vec2 {
  constructor(public x: number, public y: number) {}

  distance() {}

  static normalize(x: number, y: number) {
    const len = Math.sqrt(x * x + y * y);
    return new Vec2(x / len, y / len);
  }
}

export default Vec2;
