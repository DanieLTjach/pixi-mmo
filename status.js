// Description: Status codes for the game server.

    export const NEW_PLAYER = 'new_player';
    export const PLAYER_DISCONNECTED = 'playerDisconnected';
    export const PLAYER_MOVED = 'playerMoved';
    export const CONTROLLER = {
        UP: 'PRESS_W',
        DOWN: 'PRESS_S',
        LEFT: 'PRESS_A',
        RIGHT: 'PRESS_D',
        ATTACK: 'PRESS_SPACE',
    }
    export const CURRENT_PLAYERS = 'current_players';

// Description: Links to the assets used in the game.

    export const ASSETS = {
        BACKGROUND: 'assets/sky.png',
        PLAYER: 'assets/player.png',
        ANOTHER_PLAYER: 'assets/another_player.png'
    };

    export const SCENE_CONFIG = {
        WIDTH: 800,
        HEIGHT: 600,
    }