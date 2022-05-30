import "phaser";

import RoadScene from "./scenes/road";

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
  scene: [RoadScene],
};

new Phaser.Game(config);
