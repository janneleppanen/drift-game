import "./style.css";
import Phaser from "phaser";
import Preloader from "./scenes/Preloader";
import Race from "./scenes/Race";

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
  scene: [Preloader, Race],
};

new Phaser.Game(config);
