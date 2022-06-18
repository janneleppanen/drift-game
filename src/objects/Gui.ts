class Gui {
  private travelled!: Phaser.GameObjects.Text;
  private checkpoints!: Phaser.GameObjects.Text;

  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.travelled = this.scene.add.text(10, 10, ``).setScrollFactor(0);
    this.checkpoints = this.scene.add.text(10, 40, ``).setScrollFactor(0);
    this.setTravelled(0);
    this.setCheckpointCount(0);
  }

  public setTravelled(distance: number) {
    this.travelled.setText(`Travelled:   ${distance.toFixed(0)} meters`);
  }

  public setCheckpointCount(checkpoints: number) {
    this.checkpoints.setText(`Checkpoints: ${checkpoints.toFixed(0)}`);
  }
}

export default Gui;
