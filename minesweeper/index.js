import EventEmiter from './scripts/EventEmiter.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import Scoreboard from './scripts/Scoreboard.js';
import { gameSettings } from './utills/constants.js';
import { createElement } from './utills/utills.js';

const layout = createElement('main', 'main');
document.body.appendChild(layout);

const scoreboard = new Scoreboard({ container: layout });
scoreboard.init();

const eventEmiter = new EventEmiter();
const fieldView = new Field({
  emiter: eventEmiter,
  container: layout,
});

const game = new Game({
  view: fieldView,
  emiter: eventEmiter,
});

game.start(gameSettings.easy);
