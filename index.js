const { Application, Assets, Container, Text, Sprite } = PIXI;
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("http://localhost:2020");

const players = {};
const player = {
    id: "",
    x: 0,
    y: 0,
    sprite: null,
    camera: {
        x: 0,
        y: 0
    }
};

const worldSize = 5000;


(async () => {
    const app = new Application();
    await app.init({ background: '#1099bb', width: 640, height: 360 });
    document.body.appendChild(app.canvas);

    const WorldContainer = new Container();
    app.stage.addChild(WorldContainer);

    const CameraContainer = new Container({isRenderGroup: true});
    WorldContainer.addChild(CameraContainer);
    app.stage.addChild(CameraContainer);
    socket.on('init', (data) => {
        console.log(`Connected to server with id: ${socket.id}`);
        player.id = socket.id;
       
        player.y = data.players[socket.id].x;
        player.y = data.players[socket.id].y;
        CameraContainer.x = player.x + app.renderer.width / 2 - 26;
        CameraContainer.y = player.y + app.renderer.height / 2 - 37;
        console.log(data.players[socket.id]);
        // add current player to the camera container
        createPlayer(socket.id, CameraContainer);
        for (const id in data.players) {
            if (id == socket.id) continue;
            createPlayer(id, WorldContainer);
        }
    });

    socket.on('newPlayer', (data) => {
        createPlayer(data.id, WorldContainer);
    });

    socket.on('playerMoved', (data) => {
        if (players[data.id]) {
            players[data.id].x = data.x;
            players[data.id].y = data.y;
            console.log("id:" + data.id + "x: " + data.x + " y: " + data.y);
        }
    });

    socket.on('playerDisconnected', (data) => {
        if (players[data.id]) {
            app.stage.removeChild(players[data.id]);
            delete players[data.id];
        }
    });


    WorldContainer.x = app.screen.width / 2;
    WorldContainer.y = app.screen.height / 2;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.code === 'KeyW') {
            player.y -= 5;
        } else if (event.key === 'ArrowDown' || event.code === 'KeyS') {
            player.y += 5;
        } else if (event.key === 'ArrowLeft' || event.code === 'KeyA') {
            player.x -= 5;
        } else if (event.key === 'ArrowRight' || event.code === 'KeyD') {
            player.x += 5;
        }
        console.log("x: " + player.x + " y: " + player.y + "CameraX: " + CameraContainer.x + "CameraY: " + CameraContainer.y);
        CameraContainer.x = player.x + app.renderer.width / 2 - 26;
        CameraContainer.y = player.y + app.renderer.height / 2 - 37;
        socket.emit('move', { x: player.x, y: player.y });
    });

    // app.ticker.add(() => {
    //     const screenWidth = app.renderer.width;
    //     const screenHeight = app.renderer.height;

    //     const targetX = (player.x / screenWidth) * (worldSize - screenWidth);
    //     const targetY = (player.y / screenHeight) * (worldSize - screenHeight);

    //     CameraContainer.x += (-targetX - CameraContainer.x) * 0.1;
    //     CameraContainer.y += (-targetY - CameraContainer.y) * 0.1;
    // });
})();


async function createPlayer(id, app) {
    console.log('createPlayer', id);
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    console.log(bunny);
    bunny.x = 0;
    bunny.y = 0;
    if (id == socket.id) {
        player.sprite = bunny;
    }
    bunny.rotation = id == socket.id ? 0 : Math.PI;
    players[id] = bunny;
    app.addChild(bunny);
}



