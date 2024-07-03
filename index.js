const { Application, Assets, Container, Sprite } = PIXI;
import { Player } from './player.js';

(async () =>
    {
        // Create a new application
        const app = new Application();
    
        // Initialize the application
        await app.init({ background: '#1099bb', resizeTo: window });
    
        // Append the application canvas to the document body
        document.body.appendChild(app.canvas);
    
        // Create and add a container to the stage
        const container = new Container();
    
        app.stage.addChild(container);
        
        const player1 = new Player('Player1', 1);
        player1.joinGame(container);
        const player2 = new Player('Player2', 2);
        player2.joinGame(container);
    
        // Move the container to the center
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
    
        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        let keys = {};

        window.addEventListener("keydown", (e) => {
            keys[e.code] = true;
        });
        
        window.addEventListener("keyup", (e) => {
            keys[e.code] = false;
        });
        
        // Update the sprite position based on keyboard input
        app.ticker.add(() => {
            if (keys["ArrowUp"]) {
                player1.editCoord(player1.player.x, player1.player.y - 5);
            }
            if (keys["ArrowDown"]) {
                player1.editCoord(player1.player.x, player1.player.y + 5);
            }
            if (keys["ArrowLeft"]) {
                player1.editCoord(player1.player.x - 5, player1.player.y);
            }
            if (keys["ArrowRight"]) {
                player1.editCoord(player1.player.x + 5, player1.player.y);
            }
            if (keys["KeyW"]) {
                player2.editCoord(player2.player.x, player2.player.y - 5);
            }
            if (keys["KeyS"]) {
                player2.editCoord(player2.player.x, player2.player.y + 5);
            }
            if (keys["KeyA"]) {
                player2.editCoord(player2.player.x - 5, player2.player.y);
            }
            if (keys["KeyD"]) {
                player2.editCoord(player2.player.x + 5, player2.player.y);
            }
        });
    })();