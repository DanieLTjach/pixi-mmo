// import  Phaser  from '../lib/phaser.js';
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import Player from "./player.js";
import { NEW_PLAYER, PLAYER_DISCONNECTED, PLAYER_MOVED, CURRENT_PLAYERS, PLAYER_IS_MOVING } from "../status.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: "Game" });
    }


    create() {
        this.startSocket();
        this.add.image(400, 300, 'background');
    }

    update(){
        if(this.player){
            const currentCoordinates = { x: this.player.x, y: this.player.y };
        }
        if(this.player && this.player.oldPosition && (this.player.x !== this.player.oldPosition.x || this.player.y !== this.player.oldPosition.y)){
            this.socket.emit(PLAYER_IS_MOVING, {key: this.player.key, ...currentCoordinates});
        }
    }

    startSocket() {
        this.socket = io("http://localhost:2020");
        this.addPlayer();
        this.otherPlayers = {};
        this.socket.on(
            NEW_PLAYER,
            function (playerInfo) {
              this.addEnemy(playerInfo);
            }.bind(this)
          );
      
          this.socket.on(
            CURRENT_PLAYERS,
            function (players) {
              Object.keys(players).forEach((key) => {
                if (!this.otherPlayers[key] && key !== this.player.key)
                  this.addEnemy(players[key]);
              });
            }.bind(this)
          );
      
          this.socket.on(
            PLAYER_MOVED,
            function (playerInfo) {
              const [name, key] = playerInfo.name.split(":");
              if (this.otherPlayers[key]) {
                this.otherPlayers[key].setPosition(playerInfo.x, playerInfo.y);
              }
            }.bind(this)
          );
      
          this.socket.on(
            PLAYER_DISCONNECTED,
            function (key) {
              this.enemyPlayers.getChildren().forEach(function (otherPlayer) {
                if (key === otherPlayer.key) {
                  otherPlayer.destroy();
                }
              });
            }.bind(this)
          );
        }

    startGame() {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }

    addEnemy(enemyPlayer){
        const [name, key] = enemyPlayer.name.split(":");
        this.enemy = new Player(this, 0, 0, enemyPlayer.name, 'another_player');
        this.otherPlayers[key] = this.enemy;
    }

    addPlayer() {
        this.player = new Player(this, 0, 0, 'Name:' + crypto.randomUUID(), 'player');
        console.log('Creating player ' + this.player.name);
        this.socket.emit(NEW_PLAYER, this.player);
        this.setCamera();
    }

    setCamera(){
        this.cameras.main.startFollow(this.player, 0, 0, false);
    }
}