class Gui {
  private score!: Phaser.GameObjects.Text;

  private scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.score = this.scene.add.text(10, 10, ``).setScrollFactor(0);
    this.setScore(0);
  }

  public setScore(score: number) {
    this.score.setText(`Best score:   ${score.toFixed(0)}`);
  }
}

export default Gui;
