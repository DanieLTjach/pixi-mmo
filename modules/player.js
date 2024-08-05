class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, id, isEnemy) {
        super(scene, x, y, isEnemy);
        this.name = id;
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
        this.oldPosition = { x: x, y: y };
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
        if(!this.isEnemy){
            this.oldPosition = { x: this.x, y: this.y };
            if (this.InputKeys.W.isDown) {
                this.y -= 1;
            }else if (this.InputKeys.S.isDown) {
                this.y += 1;
            }else if (this.InputKeys.A.isDown) {
                this.x -= 1;
            }else if (this.InputKeys.D.isDown) {
                this.x += 1;
            }
            this.setPosition(this.x, this.y);
        }
    }
}

export default Player;