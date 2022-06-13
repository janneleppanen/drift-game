class Sensor extends Phaser.Physics.Matter.Factory {
  private x!: number;
  private y!: number;
  private ray: any;
  private ob: any;

  constructor(world: Phaser.Physics.Matter.World) {
    super(world);
  }

  create() {
    this.ray = this.rectangle(0, 400, 100, 1, {
      isSensor: true,
    });
  }

  public update() {
    const b = this.ob.body;

    this.ray.position.x = b.position.x;
    this.ray.position.y = b.position.y;
    this.ray.angle = b.angle;
  }

  public attach(ob: any) {
    this.ob = ob;
  }
}

export default Sensor;
