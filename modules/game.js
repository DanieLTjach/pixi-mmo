import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Player from "./player.js";
import { NEW_PLAYER, PLAYER_DISCONNECTED, PLAYER_MOVED, CONTROLLER, CURRENT_PLAYERS, SCENE_CONFIG, SERVER } from "../status.js";

export default class Game extends Phaser.Scene {
    playersGroup;
    players = {};
    player_camera;
    current_player_name = 0;

    constructor() {
        super({ key: "Game" });
    }

    create() {
        this.physics.world.setBounds(0, 0, SCENE_CONFIG.WIDTH, SCENE_CONFIG.HEIGHT);

        this.playersGroup = this.physics.add.group();

        this.startSocket();
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.cameras.main.setBounds(0, 0, SCENE_CONFIG.WIDTH, SCENE_CONFIG.HEIGHT);
        this.player_camera = this.cameras.add(0, 0, SCENE_CONFIG.WIDTH, SCENE_CONFIG.HEIGHT);
        this.text = this.add.text(10, 10, "x , y", { fontSize: '10px', fill: '#000' });

        // Создание статической группы объектов
        this.something = this.physics.add.staticGroup();
        this.something.create(400, 400, 'something');

        // Добавление коллизии между игроками и статическими объектами
        this.physics.add.collider(this.playersGroup, this.something);
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
            }
        }
        this.physics.add.collider(this.playersGroup, this.something);
    }

    startSocket() {
        this.socket = io(SERVER.URL);
        this.socket.on("connect", () => {
            this.addCurrentPlayer(this.socket.id, this.socket.id, (SCENE_CONFIG.WIDTH / 2) + Math.round(Math.random() * 10), (SCENE_CONFIG.HEIGHT / 2) + Math.round(Math.random() * 10));
            this.current_player_name = this.socket.id;
            console.log(this.current_player_name);
        });
        this.socket.on(CURRENT_PLAYERS, (data) => {
            for (const [key, value] of Object.entries(data.players)) {
                if (key === this.socket.id) continue;
                this.addPlayer(key, key, value.x, value.y);
            }
        });
        this.socket.on(NEW_PLAYER, (data) => {
            if (data.name != this.socket.id) {
                console.log(data);
                this.addPlayer(data.name, data.name, data.x, data.y);
            }
        });
        this.socket.on(PLAYER_MOVED, (data) => {
            if (this.players[data.name]) {
                this.players[data.name].x = data.x;
                this.players[data.name].y = data.y;
                this.players[data.name].angle = data.angle;
                if (data.name === this.current_player_name) {
                    this.text.x = data.x - SCENE_CONFIG.WIDTH / 2;
                    this.text.y = data.y - SCENE_CONFIG.HEIGHT / 2;
                    this.text.setText(data.x + " , " + data.y);
                }
            }
        });
        this.socket.on(PLAYER_DISCONNECTED, (data) => {
            if (this.players[data.name]) {
                this.players[data.name].destroy();
                delete this.players[data.name];
            }
        });
    }

    startGame() {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    addPlayer(nickname, key, x, y) {
        const name = key;
        const player = new Player(this, x, y, name, true);
        this.players[key] = player;
        this.playersGroup.add(player);

        // Добавление коллизии между игроками и статическими объектами
        this.physics.add.collider(player, this.something);
        // Добавление коллизии между игроком и границами мира
        player.body.setCollideWorldBounds(true);
    }

    addCurrentPlayer(nickname, key, x, y) {
        if (!key || this.players[key]) {
            console.error("Invalid or duplicate player key:", key);
            return;
        }
        const newPlayer = new Player(this, nickname, x, y, key, false);
        this.players[key] = newPlayer;
        this.playersGroup.add(newPlayer);
        this.socket.emit("add_player", { x: newPlayer.x, y: newPlayer.y });
        this.addCamera(key);

        // Добавление коллизии между текущим игроком и статическими объектами
        this.physics.add.collider(newPlayer, this.something);
        // Добавление коллизии между игроком и границами мира
        newPlayer.body.setCollideWorldBounds(true);
    }

    addCamera(name) {
        this.player_camera.startFollow(this.players[name], true);
    }
}
