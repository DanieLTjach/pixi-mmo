// import  Phaser  from '../lib/phaser.js';
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Player from "./player.js";
import { NEW_PLAYER, PLAYER_DISCONNECTED, PLAYER_MOVED, CONTROLLER, CURRENT_PLAYERS, SCENE_CONFIG} from "../status.js";

export default class Game extends Phaser.Scene {
    players = {};
    current_player_name = 0;
    constructor() {
        super({ key: "Game" });
    }


    create() {
        this.startSocket();
        this.add.image(SCENE_CONFIG.HEIGHT, SCENE_CONFIG.WIDTH, 'background');
    }

    update() {
        if (this.players[this.socket.id] && this.players[this.socket.id].pressedKeys) {
            if (this.players[this.socket.id].pressedKeys.up === true) {
                this.socket.emit(CONTROLLER.UP, { name: this.players[this.socket.id].name });
            } 
            if (this.players[this.socket.id].pressedKeys.down === true) {
                this.socket.emit(CONTROLLER.DOWN, { name: this.players[this.socket.id].name });
            }
            if (this.players[this.socket.id].pressedKeys.left === true) {
                this.socket.emit(CONTROLLER.LEFT, { name: this.players[this.socket.id].name });
            }
            if (this.players[this.socket.id].pressedKeys.right === true) {
                this.socket.emit(CONTROLLER.RIGHT, { name: this.players[this.socket.id].name });
            }
            if (this.players[this.socket.id].pressedKeys.attack === true) {
                this.players[this.socket.id].pressedKeys.attack = false;
                console.log(this.players[this.socket.id].look_angle);
            }
        }
        

    }

    startSocket() {
        this.socket = io("http://localhost:2020");
        this.socket.on("connect", () => {
            this.addCurrentPlayer(this.socket.id, (SCENE_CONFIG.WIDTH / 2) + Math.round(Math.random() * 10), (SCENE_CONFIG.HEIGHT / 2) + Math.round(Math.random() * 10));
            this.current_player_name = this.socket.id;
            console.log(this.current_player_name)
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
                this.addPlayer(data.name, data.x, data.y);
            }
        });
        this.socket.on(PLAYER_MOVED, (data) => {
            this.players[data.name].x = data.x;
            this.players[data.name].y = data.y;
            this.players[data.name].angle = data.angle;
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

    addCurrentPlayer(key, x, y) {
        if (!key || this.players[key]) {
            console.error("Invalid or duplicate player key:", key);
            return;
        }
        const newPlayer = new Player(this, x, y, key, false);
        this.players[key] = newPlayer;
        this.socket.emit("add_player", { x: newPlayer.x, y: newPlayer.y });
    }
}