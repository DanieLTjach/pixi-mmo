class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, id, texture) {
        super(scene, x, y, texture);
        this.name = id;
        this.scene = scene;
        scene.add.existing(this);
        this.x = x;
        this.y = y;
        this.init();
    }

    init(){
        this.scene.events.on('update', this.update, this);
        this.InputKeys = this.scene.input.keyboard.addKeys('W, A, S, D');
        console.log(this.name);
    }

    get key(){
        return this.name.split(':')[1];
    }

    update() {
        if (this.InputKeys.W.isDown) {
            this.y -= 1;
        }
        if (this.InputKeys.S.isDown) {
            this.y += 1;
        }
        if (this.InputKeys.A.isDown) {
            this.x -= 1;
        }
        if (this.InputKeys.D.isDown) {
            this.x += 1;
        }
        this.setPosition(this.x, this.y);
    }
}

export default Player;