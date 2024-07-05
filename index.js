const { Application, Assets, Container, Sprite } = PIXI;
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("http://192.168.31.74:2020");

const players = {};

(async () =>
    {
        const app = new Application();
        await app.init({ background: '#1099bb', resizeTo: window });
        document.body.appendChild(app.canvas);

        const container = new Container();
    
        app.stage.addChild(container);

        socket.on('init', (data) => {
            for (const id in data.players) {
                createPlayer(id, app);
            }
        });

        socket.on('newPlayer', (data) => {
            createPlayer(data.id, app);
      });

        socket.on('playerMoved', (data) => {
          if (players[data.id]) {
              players[data.id].x = data.x;
              players[data.id].y = data.y;
              
          }
      });

        socket.on('playerDisconnected', (data) => {
          if (players[data.id]) {
              app.stage.removeChild(players[data.id]);
              delete players[data.id];
          }
      });

      attack(app);
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
    

        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;


    })();

    function attack(app){
        console.log('attack');
        const texture = Assets.load('FireAttack.gif');
        const attack = new Sprite(texture);
        attack.x = 50;
        attack.y = 50;
        app.stage.addChild(attack);
    }

    async function createPlayer(id, app) {
        console.log('createPlayer', id);
        const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
        const bunny = new Sprite(texture);
        bunny.x = 0;
        bunny.y = 0;
        players[id] = bunny;
        app.stage.addChild(bunny);
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp' || event.code === 'KeyW') {
          players[socket.id].y -= 5;
      } else if (event.key === 'ArrowDown' || event.code === 'KeyS') {
          players[socket.id].y += 5;
      } else if (event.key === 'ArrowLeft' || event.code === 'KeyA') {
          players[socket.id].x -= 5;
      } else if (event.key === 'ArrowRight' || event.code === 'KeyD') {
          players[socket.id].x += 5;
      }

      socket.emit('move', { x: players[socket.id].x, y: players[socket.id].y });
  });
