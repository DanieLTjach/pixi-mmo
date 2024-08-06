import Bootloader from "./modules/bootloader.js";
import Game from "./modules/game.js";
import { SCENE_CONFIG } from "./status.js";

let config = {
    type: Phaser.AUTO,
    width: SCENE_CONFIG.WIDTH,
    height: SCENE_CONFIG.HEIGHT,
    scene: [Bootloader, Game]
}

let game = new Phaser.Game(config);

