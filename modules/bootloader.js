import { ASSETS } from '../status.js';

export default class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "Bootloader" });
    }


    preload(){
        this.load.image('background', ASSETS.BACKGROUND);
        this.load.image('player', ASSETS.PLAYER);
        this.load.image('another_player', ASSETS.ANOTHER_PLAYER);
        this.load.image('something', ASSETS.SOMETHING);
        this.load.on(
            "complete",
            () => {
              this.scene.start("Game");
            },
            this
          );
    }
}