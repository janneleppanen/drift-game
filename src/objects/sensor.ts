import Road from "./road";

class Sensor extends Phaser.Physics.Matter.Factory {
  private x!: number;
  private y!: number;
  private ray: any;
  private ob: any;
  private road!: Road;
  private compoundBody!: any;

  constructor(scene: Phaser.Scene, road: Road) {
    super(scene.matter.world);
    this.road = road;
  }

  create() {
    this.ray = this.rectangle(0, 0, 2, 100, {
      isSensor: true,
      label: "sensor",
      isStatic: true,
      onCollideActiveCallback: (
        collisionData: Phaser.Types.Physics.Matter.MatterCollisionData
      ) => {
        // console.log(collisionData.collision.depth);
      },
    });
    // this.rays;

    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [this.ray],
      inertia: Infinity,
    });

    new Phaser.GameObjects.Group(this.scene, [this.ray]);
    console.log(this.compoundBody);
    // this.compoundBody.setExistingBody(compoundBody);

    console.log(this.ray);
    this.ray.bounds = {
      min: { x: 0, y: 0 },
      max: { x: 0, y: 0 },
    };
    this.ray.centerOfMass = { x: 0, y: 0 };
    this.ray.centerOffset = { x: 0, y: 0 };

    // console.log(this.compoundBody);

    this.ray.setOnCollideWith(
      this.road.walls[0],
      (
        otherBody: MatterJS.Body,
        collisionData: Phaser.Types.Physics.Matter.MatterCollisionData
      ) => {
        // console.log({ otherBody, collisionData });
      }
    );

    this.road.walls.forEach((wall) => {
      const a = this.ray.setOnCollideWith(wall, (...rest) => {
        // console.log(rest);
      });
      // console.log(a);
    });
    console.log(this.ray);

    this.world.on("collisionactive", function (event) {
      const sensorCollisions = event.source.pairs.collisionActive.map(
        ({ bodyA, bodyB, collision }) => {
          const is1 = bodyA.label === "wall" && bodyB.label === "sensor";
          const is2 = bodyA.label === "sensor" && bodyB.label === "wall";
          if (is1 || is2) {
            console.log(collision.depth);
          }
        }
      );
    });

    // MatterJS.Detector.collisions

    // const graphics = this.scene.add.graphics();
    // this.world.renderCollisions([this, this.road.walls[0]], graphics, 0x00ff00);
  }

  public update() {
    const b = this.ob;

    // this.ray.angle = b.angle;
    console.log(b);
    this.ray.position = { ...b.position };
    // this.ray.position.y = b.position.y;

    console.log(this.ray.position.x, b.position.x);
    // this.compoundBody.setX(b.position.x);
    // this.compoundBody.setY(b.position.y);

    // this.ray.angle += 0.001;
    // this.ray.rotate(0.1);
  }

  public attach(ob: any) {
    this.ob = ob;
  }
}

export default Sensor;
