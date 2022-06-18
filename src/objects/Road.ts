import { getPolygonOffet } from "../utils";

class Road extends Phaser.Physics.Matter.Factory {
  public route: Phaser.Math.Vector2[] = [];
  public walls: Phaser.Physics.Matter.Sprite[] = [];
  public lines: Phaser.Math.Vector2[][] = [];
  public checkpoints: MatterJS.BodyType[] = [];

  constructor(
    world: Phaser.Physics.Matter.World,
    route: Phaser.Math.Vector2[]
  ) {
    super(world);
    this.route = route;
  }

  create() {
    this.walls.push(...this.createWalls(getPolygonOffet(this.route, 200, 1)));
    this.walls.push(...this.createWalls(getPolygonOffet(this.route, 40, -1)));
    this.checkpoints = this.createCheckPoints();
  }

  private createWalls(points: Phaser.Math.Vector2[]) {
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

  private createCheckPoints() {
    return this.walls.slice(0, this.walls.length / 2).map((point, index) => {
      const otherPoint = this.walls[index + this.walls.length / 2];
      const midPoint = new Phaser.Math.Vector2(point.x, point.y).lerp(
        otherPoint,
        0.5
      );

      const vec = new Phaser.Math.Vector2(
        point.x - otherPoint.x,
        point.y - otherPoint.y
      );

      return this.scene.matter.add.rectangle(
        midPoint.x,
        midPoint.y,
        vec.length(),
        10,
        {
          label: "checkpoint",
          isStatic: true,
          isSensor: true,
          angle: vec.angle(),
        }
      );
    });
  }
}

export default Road;
