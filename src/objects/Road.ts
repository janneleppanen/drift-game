import { getPolygonOffet } from "../utils";

class Road extends Phaser.Physics.Matter.Factory {
  public route: Phaser.Math.Vector2[] = [];
  public walls: Phaser.Physics.Matter.Sprite[] = [];
  public lines: Phaser.Math.Vector2[][] = [];
  public checkpoints: MatterJS.BodyType[] = [];
  public collisionGroup = 0;

  constructor(
    world: Phaser.Physics.Matter.World,
    route: Phaser.Math.Vector2[]
  ) {
    super(world);
    this.route = route;
    this.collisionGroup = world.nextCategory();
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

      return this.scene.matter.add.gameObject(sprite, {
        isStatic: true,
        angle,
        label: "wall",
        collisionFilter: {
          category: this.collisionGroup,
        },
      }) as Phaser.Physics.Matter.Sprite;
    });
  }

  private createCheckPoints() {
    const checkpoints: MatterJS.BodyType[] = [];

    this.lines.slice(0, this.walls.length / 2).map((point, index) => {
      const otherPoint = this.lines[index + this.walls.length / 2];

      const checkpointsPerSection = 4;
      for (let i = 0; i < checkpointsPerSection; i++) {
        const t = (1 / checkpointsPerSection) * i;
        const outerPoint = point[0].clone().lerp(point[1], t);
        const innerPoint = otherPoint[0].clone().lerp(otherPoint[1], t);
        const midPoint = outerPoint.clone().lerp(innerPoint, 0.5);

        const vec = new Phaser.Math.Vector2(
          outerPoint.x - innerPoint.x,
          outerPoint.y - innerPoint.y
        );

        const checkpoint = this.scene.matter.add.rectangle(
          midPoint.x,
          midPoint.y,
          vec.length(),
          10,
          {
            label: "checkpoint",
            isStatic: true,
            isSensor: true,
            angle: vec.angle(),
            collisionFilter: {
              category: this.collisionGroup,
            },
          }
        );

        checkpoints.push(checkpoint);
      }
    });

    return checkpoints;
  }
}

export default Road;
