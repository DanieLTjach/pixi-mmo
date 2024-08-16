class Object extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, x, y, texture, is_usable) {
        super(scene, x, y, texture, is_usable);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.is_usable = is_usable;
        this.x = x;
        this.y = y;
        this.button = {};
        this.body.setCollideWorldBounds(true);
        this.setTexture(texture).setOrigin(0, 0);
        this.object = scene.physics.add.staticGroup();
        this.init();
    }
    // In this class we will create the object and initialize it in another file
    init() {
        this.scene.events.on('update', this.update, this);
        this.button["usage"] = this.scene.add.rectangle(this.x + this.width/2, this.y - this.height/2, 10, 10, 0x6666ff);
        this.button["usage"].setVisible(false);
    }


    update() {

    }

    destroy() {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }

    can_use(){
        this.button["usage"].setVisible(true);
    }

    cannot_use(){
        this.button["usage"].setVisible(false);
    }
}

export default Object;
