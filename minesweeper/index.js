import EventEmiter from './scripts/EventEmiter.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import { gameSettings } from './utills/constants.js';

document.body.innerHTML = '<h1>minesweeper!</h1>';

const eventEmiter = new EventEmiter();
const fieldView = new Field({
  emiter: eventEmiter,
});

const game = new Game({
  view: fieldView,
  emiter: eventEmiter,
});

game.start(gameSettings.easy);
