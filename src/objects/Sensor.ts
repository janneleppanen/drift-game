import { Intersection, getIntersection, lerp } from "../utils";

class Sensor {
  public length = 200;
  public rayCount = 5;
  public readings: Intersection[] = [];
  public rays: Phaser.GameObjects.Graphics[] = [];
  public spread = Math.PI / 2;
  public hitIndicators: Phaser.GameObjects.Graphics[] = [];

  private world!: Phaser.Physics.Matter.World;
  private attachedTo!: MatterJS.BodyType;
  private lines: Phaser.Math.Vector2[][] = [];

  constructor(
    world: Phaser.Physics.Matter.World,
    lines: Phaser.Math.Vector2[][]
  ) {
    this.world = world;
    this.lines = lines;
  }

  create() {
    for (let i = 0; i < this.rayCount; i++) {
      const graphics = this.world.scene.add.graphics();
      const angle = lerp(
        -this.spread / 2,
        this.spread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
      );

      graphics.moveTo(0, 0);
      graphics.lineStyle(1, 0xffffff);
      graphics.lineTo(
        Math.sin(angle) * this.length,
        -Math.cos(angle) * this.length
      );
      graphics.stroke();

      this.rays.push(graphics);
    }

    for (let i = 0; i < this.rayCount; i++) {
      const graphics = this.world.scene.add.graphics();
      graphics.fillCircle(0, 0, 5);
      this.hitIndicators.push(graphics);
    }
  }

  attach(body: MatterJS.BodyType) {
    this.attachedTo = body;
  }

  update() {
    if (this.attachedTo) {
      this.rays.forEach((ray) => {
        ray.setPosition(this.attachedTo.position.x, this.attachedTo.position.y);
        ray.setRotation(this.attachedTo.angle);
      });
    }

    this.read();
  }

  private read() {
    this.rays.forEach((ray, i) => {
      this.readings[i] = null;

      this.lines.forEach((line) => {
        const angle = lerp(
          -this.spread / 2,
          this.spread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        );
        const x = ray.x + Math.sin(angle + this.attachedTo.angle) * this.length;
        const y = ray.y - Math.cos(angle + this.attachedTo.angle) * this.length;

        const intersection = getIntersection(
          line[0],
          line[1],
          new Phaser.Math.Vector2(ray.x, ray.y),
          new Phaser.Math.Vector2(x, y)
        );

        if (intersection && !this.readings[i]) {
          this.readings[i] = intersection;
        } else if (
          intersection &&
          this.readings[i] &&
          this.readings[i].offset < intersection.offset
        ) {
          this.readings[i] = intersection;
        }
      });
    });

    this.hitIndicators.forEach((indicator, i) => {
      const intersection = this.readings[i];
      if (intersection) {
        indicator.setPosition(intersection.x, intersection.y);
        indicator.setVisible(true);
      } else {
        indicator.setVisible(false);
      }
    });
  }

  setSensorVisibility(visible: boolean) {
    this.rays.forEach((ray) => ray.setVisible(visible));
    this.hitIndicators.forEach((indicator) => indicator.setVisible(visible));
  }
}

export default Sensor;
