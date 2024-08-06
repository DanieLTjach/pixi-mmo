import { CONTROLLER } from "../status.js";

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, id, isEnemy) {
        super(scene, x, y, isEnemy);
        this.name = id;
        this.health = 100;
        this.scene = scene;
        this.isEnemy = Boolean(isEnemy);
        if(isEnemy === true){
            this.setTexture('another_player');
        }
        else{
            this.setTexture('player');
        }
        scene.add.existing(this);
        this.x = x;
        this.y = y;
        this.mouseX = 0;
        this.mouseY = 0;
        this.look_angle = 0;
        this.pressedKeys = {up: false, down: false, left: false, right: false, attack: false};
        this.init();
    }

    init(){
        this.scene.events.on('update', this.update, this);
        this.scene.input.mouse.disableContextMenu();
        if(!this.isEnemy){
        this.text1 = this.scene.add.text(10, 10, this.health, { fontSize: '10px', fill: '#000' });
        }
        this.InputKeys = this.scene.input.keyboard.addKeys('W, A, S, D');
        console.log(this.name);
    }

    update() {
        if(!this.isEnemy){
            this.text1.setText(this.health);
            this.scene.input.on('pointermove', (pointer) => {
                this.mouseX = pointer.worldX;
                this.mouseY = pointer.worldY;
                this.look_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
                const angleDeg = Phaser.Math.RadToDeg(this.look_angle);
                if (-45 <= angleDeg && angleDeg <= 45) {
                    this.angle = 0;
                }
                if (45 < angleDeg && angleDeg <= 135) {
                    this.angle = 90;
                }
                if ((135 < angleDeg && angleDeg <= 180) || (-180 <= angleDeg && angleDeg <= -135)) {
                    this.angle = 180;
                }
                if (-135 < angleDeg && angleDeg <= -45) {
                    this.angle = -90;
                }
            });
            this.scene.input.on('pointerdown', (pointer) => {
                if(pointer.leftButtonDown()){
                    this.pressedKeys.attack = true;
                    this.look_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
                } 
            });
            this.scene.input.on('pointerup', (pointer) => {
                if(pointer.leftButtonReleased()){
                    this.pressedKeys.attack = false;
                }
            });
            if (this.InputKeys.W.isDown) {
                this.pressedKeys.up = true; 
            }else if(this.InputKeys.W.isUp){
                this.pressedKeys.up = false;
            }
            if (this.InputKeys.S.isDown) {
                this.pressedKeys.down = true;
            }else if(this.InputKeys.S.isUp){
                this.pressedKeys.down = false;
            }
            if (this.InputKeys.A.isDown) {
                this.pressedKeys.left = true;
            }else if(this.InputKeys.A.isUp){
                this.pressedKeys.left = false;
            }
            if (this.InputKeys.D.isDown) {
                this.pressedKeys.right = true;
            } else if(this.InputKeys.D.isUp){
                this.pressedKeys.right = false;
            }
            this.setPosition(this.x, this.y);
        }
    }
}

export default Player;