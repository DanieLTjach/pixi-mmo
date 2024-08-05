// import  Phaser  from '../lib/phaser.js';
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Player from "./player.js";
import { NEW_PLAYER, PLAYER_DISCONNECTED, PLAYER_MOVED, CURRENT_PLAYERS, PLAYER_IS_MOVING } from "../status.js";

export default class Game extends Phaser.Scene {
    players = {};

    constructor() {
        super({ key: "Game" });
    }


    create() {
        this.startSocket();
        this.add.image(400, 300, 'background');
    }

    update() {
        const currentCoordinates = { x: this.player?.x ?? 0, y: this.player?.y ?? 0 };

        if (this.player && this.player.oldPosition && (this.player.x !== this.player.oldPosition.x || this.player.y !== this.player.oldPosition.y)) {
            this.socket.emit(PLAYER_IS_MOVING, { name: this.player.name, ...currentCoordinates });
        }

    }

    startSocket() {
        this.socket = io("http://localhost:2020");
        this.socket.on("connect", () => {
            //! BUG - coordinates shouold't be string
            this.addCurrentPlayer(this.socket.id, Math.round(Math.random() * 10), Math.round(Math.random() * 10)); // Добавление текущего игрока
        });
        this.socket.on(CURRENT_PLAYERS, (data) => {
            for (const [key, value] of Object.entries(data.players)) {
                if (key === this.socket.id) continue;
                this.addPlayer(key, value.x, value.y);
            }
        });
        this.socket.on(NEW_PLAYER, (data) => {
            if (data.name != this.socket.id) {
                console.log(data);
                this.addPlayer(data.name, data.data.x, data.data.y);
            }
        });
        this.socket.on(PLAYER_MOVED, (data) => {
            this.players[data.name].x = data.data.x;
            this.players[data.name].y = data.data.y;
        });
        this.socket.on(PLAYER_DISCONNECTED, (data) => {
            this.players[data.name].destroy();
            delete this.players[data.name];
        });
    }

    startGame() {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    addPlayer(key, x, y) {
        const name = key
        this.players[key] = new Player(this, x, y, name, true);
    }

    addCurrentPlayer(name, x, y) {
        this.player = new Player(this, x, y, name, false);
        this.socket.emit("add_player", { x: this.player.x, y: this.player.y });
        this.setCamera();
    }

    setCamera() {
        this.cameras.main.startFollow(this.player, 0, 0, false);
    }
}