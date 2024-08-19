import { CONTROLLER } from "../status.js";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, nickname, x, y, id) {
        super(scene, x, y, 'another_player');

        this.health = 100;
        this.scene = scene;
        this.nickname = nickname;
        this.id = id;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);

        this.x = x;
        this.y = y;


        this.moveSpeed = 50;

        this.init();
    }

    init() {
        this.scene.events.on('update', this.update, this);
        this.nicknameText = this.scene.add.text(this.x - 20, this.y - 30, this.nickname, { fontSize: '10px', fill: '#ff0000' });
    }

    update() {
        this.nicknameText.setPosition(this.x - 20, this.y - 30);

        this.moveToPlayer();
    }

    moveToPlayer() {
        const player = this.scene.players[this.scene.current_player_name];
        if (player) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
            this.body.setVelocityX(Math.cos(angle) * this.moveSpeed);
            this.body.setVelocityY(Math.sin(angle) * this.moveSpeed);
        }
    }
    /* takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    } */
}

export default Enemy;
