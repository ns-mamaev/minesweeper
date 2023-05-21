import Game from './scripts/Game.js';
import { gameSettings } from './utills/constants.js';

document.body.innerHTML = '<h1>minesweeper!</h1>';

const game = new Game();
game.start(gameSettings.hard);
