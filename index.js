import Bootloader from "./modules/bootloader.js";
import Game from "./modules/game.js";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Bootloader, Game]
}

let game = new Phaser.Game(config);

