const { Application, Assets, Container, Sprite } = PIXI;

export class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.player = null;
    }

    async joinGame(game) {
        const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
        this.player = new Sprite(texture);
        this.player.x = 0;
        this.player.y = 0;
        game.addChild(this.player);
    }

    editCoord(x, y) {
        this.player.x = x;
        this.player.y = y;
    }
}