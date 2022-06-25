class Exhaust extends Phaser.GameObjects.Particles.ParticleEmitter {
  constructor(scene: Phaser.Scene, follow: any) {
    const manager = scene.add.particles("dust");

    super(manager, {
      lifespan: { min: 200, max: 400 },
      speed: { min: 20, max: 40 },
      scale: { start: 0.7, end: 3 },
      rotate: { min: 0, max: 360 },
      alpha: { start: 0.4, end: 0 },
      angle: 100,
      quantity: 1,
      follow,
    });

    manager.addEmitter(this);
  }
}

export default Exhaust;
