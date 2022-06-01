import "phaser";

import RaceScene from "./scenes/race";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  backgroundColor: "#444",
  scene: [RaceScene],
};

new Phaser.Game(config);
