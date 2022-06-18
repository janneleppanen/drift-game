import { getPolygonOffet } from "../utils";

class Road extends Phaser.Physics.Matter.Factory {
  public route: Phaser.Math.Vector2[] = [];
  public walls: Phaser.Physics.Matter.Sprite[] = [];
  public lines: Phaser.Math.Vector2[][] = [];

  constructor(
    world: Phaser.Physics.Matter.World,
    route: Phaser.Math.Vector2[]
  ) {
    super(world);
    this.route = route;
  }

  create() {
    this.walls.push(...this.drawWalls(getPolygonOffet(this.route, 200, 1)));
    this.walls.push(...this.drawWalls(getPolygonOffet(this.route, 40, -1)));
  }

  private drawWalls(points: Phaser.Math.Vector2[]) {
    return points.map((point, index) => {
      const nextPoint = points[(index + 1) % points.length];
      const vec = new Phaser.Math.Vector2(
        point.x - nextPoint.x,
        point.y - nextPoint.y
      );
      const width = vec.length();
      const angle = vec.angle();
      const mid = point.clone().lerp(nextPoint, 0.5);

      this.lines.push([point, nextPoint]);

      const sprite = this.scene.add.tileSprite(mid.x, mid.y, width, 20, "tyre");
      const wall = this.scene.matter.add.gameObject(sprite, {
        isStatic: true,
        angle,
        label: "wall",
      }) as Phaser.Physics.Matter.Sprite;
      return wall;
    });
  }
}

export default Road;
