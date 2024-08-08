import { CONTROLLER } from "../status.js";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, nickname, x, y, id, isEnemy) {
        super(scene, x, y, isEnemy ? 'another_player' : 'player');

        this.name = id;
        this.health = 100;
        this.scene = scene;
        this.isEnemy = Boolean(isEnemy);
        this.nickname = nickname;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        this.x = x;
        this.y = y;
        this.mouseX = 0;
        this.mouseY = 0;
        this.look_angle = 0;
        this.pressedKeys = { up: false, down: false, left: false, right: false, attack: false };

        this.init();
    }

    init() {
        this.scene.events.on('update', this.update, this);
        this.scene.input.mouse.disableContextMenu();
        this.nicknameText = this.scene.add.text(this.x - 20, this.y - 30, this.nickname, { fontSize: '10px', fill: '#000' }); 
        this.InputKeys = this.scene.input.keyboard.addKeys('W, A, S, D');
    }

    update() {
        if (!this.isEnemy) {
            this.nicknameText.setPosition(this.x - 20, this.y - 30);
            this.scene.input.on('pointerdown', (pointer) => {
                if (pointer.leftButtonDown()) {
                    this.pressedKeys.attack = true;
                    this.look_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
                } 
            });
            this.scene.input.on('pointerup', (pointer) => {
                if (pointer.leftButtonReleased()) {
                    this.pressedKeys.attack = false;
                }
            });
            if (this.InputKeys.W.isDown) {
                this.pressedKeys.up = true; 
                this.body.setVelocityY(-100);
            } else if (this.InputKeys.W.isUp) {
                this.pressedKeys.up = false;
                this.body.setVelocityY(0);
            }
            if (this.InputKeys.S.isDown) {
                this.pressedKeys.down = true;
                this.body.setVelocityY(100);
            } else if (this.InputKeys.S.isUp) {
                this.pressedKeys.down = false;
                this.body.setVelocityY(0);
            }
            if (this.InputKeys.A.isDown) {
                this.pressedKeys.left = true;
                this.body.setVelocityX(-100);
            } else if (this.InputKeys.A.isUp) {
                this.pressedKeys.left = false;
                this.body.setVelocityX(0);
            }
            if (this.InputKeys.D.isDown) {
                this.pressedKeys.right = true;
                this.body.setVelocityX(100);
            } else if (this.InputKeys.D.isUp) {
                this.pressedKeys.right = false;
                this.body.setVelocityX(0);
            }
            this.setPosition(this.x, this.y);
        }
    }
}

export default Player;
