import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import Objects from "./object.js";
import { NEW_PLAYER, PLAYER_DISCONNECTED, PLAYER_MOVED, CONTROLLER, CURRENT_PLAYERS, SCENE_CONFIG, SERVER, CURRENT_OBJECTS, PLAYER_CAN_USE, PLAYER_CANNOT_USE, PLAYER_USE_OBJECT} from "../status.js";

export default class Game extends Phaser.Scene {
    playersGroup;
    players = {};
    objects_list = {};
    text_list = {};
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

        this.addEnemy("enemy1", 300, 300);
        this.addEnemy("enemy2", 500, 500);
    }

    update() {
        if (this.players[this.socket.id] && this.players[this.socket.id].pressedKeys) {
            this.socket.emit(CONTROLLER, {name: this.players[this.socket.id].name, keys: this.players[this.socket.id].pressedKeys});
        }
    }

    startSocket() {
        this.socket = io(SERVER.URL);

        this.socket.on("connect", () => {
            this.addCurrentPlayer(this.socket.id, this.socket.id, (SCENE_CONFIG.WIDTH / 2) + Math.round(Math.random() * 10), (SCENE_CONFIG.HEIGHT / 2) + Math.round(Math.random() * 10));
            this.current_player_name = this.socket.id;
            console.log(this.current_player_name);
        });

        this.socket.on(CURRENT_OBJECTS, (data) => {
            for (const object of data.objects) {
                this.objects_list[object.name] = new Objects(this, object.x, object.y, object.texture, object.is_usable);
            }
        });

        this.socket.on(CURRENT_PLAYERS, (data) => {
            console.log(data);
            for (const [key, value] of Object.entries(data.players)) {
                if (key === this.socket.id) continue;
                this.addPlayer(key, key, value.x, value.y);
            }
        });

        this.socket.on(NEW_PLAYER, (data) => {
            if (data.name != this.socket.id) {
                this.addPlayer(data.name, data.name, data.x, data.y);
            }
        });

        this.socket.on(PLAYER_DISCONNECTED, (data) => {
            if (this.players[data.name]) {
                this.players[data.name].nicknameText.destroy();
                this.players[data.name].destroy();
                delete this.players[data.name];
            }
        });

        this.socket.on(PLAYER_MOVED, (data) => {
            if (this.players[data.name]) {
                this.players[data.name].x = data.x;
                this.players[data.name].y = data.y;
                this.players[data.name].nicknameText.setPosition(data.x - 20, data.y - 30);
            }
        });

        this.socket.on(PLAYER_CAN_USE, (data) => {
            if(data.player_name === this.socket.id){
                this.objects_list[data.object_name].can_use();
            }
        });

        this.socket.on(PLAYER_CANNOT_USE, (data) => {
            for (const [key] of Object.entries(this.objects_list)) {
                this.objects_list[key].cannot_use();
            }   
        });
        
        this.socket.on(PLAYER_USE_OBJECT, (data) => {
            if(data.player_name === this.socket.id){
                // Do something
            }
        });
    }

    startGame() {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    addPlayer(nickname, key, x, y) {
        const name = key;
        const player = new Player(this, nickname, x, y, name, true);
        this.players[key] = player;
        this.playersGroup.add(player);

        this.physics.add.collider(player, this.something);
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
        console.log(newPlayer.width);
        this.socket.emit("add_player", { x: newPlayer.x, y: newPlayer.y, size: { width: newPlayer.width, height: newPlayer.height } });
        this.addCamera(key);

        this.physics.add.collider(newPlayer, this.something);
        newPlayer.body.setCollideWorldBounds(true);
    }

    addEnemy(nickname, x, y) {
        const enemy = new Enemy(this, nickname, x, y, `enemy_${nickname}`);
        this.players[`enemy_${nickname}`] = enemy;
        this.playersGroup.add(enemy);
        this.physics.add.collider(enemy, this.something);
        enemy.body.setCollideWorldBounds(true);
    }


    addCamera(name) {
        this.player_camera.startFollow(this.players[name], true);
    }
}
