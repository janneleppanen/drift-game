class Gui {
  private travelled!: Phaser.GameObjects.Text;

  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.travelled = this.scene.add.text(10, 10, ``).setScrollFactor(0);
    this.setTravelled(0);
  }

  public setTravelled(distance: number) {
    this.travelled.setText(`Travelled: ${distance.toFixed(0)} meters`);
  }
}

export default Gui;
