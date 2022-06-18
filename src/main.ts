import "./style.css";

import RaceScene from "./scenes/race";

const DEBUG = true;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "matter",
    matter: {
      debug: {
        showCollisions: true,
      },
      gravity: { y: 0 },
    },
  },
  backgroundColor: "#444",
  scene: [RaceScene],
};

new Phaser.Game(config);
