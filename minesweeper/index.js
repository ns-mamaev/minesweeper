import Controls from './scripts/Controls.js';
import EventEmiter from './scripts/EventEmiter.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import MenuPopup from './scripts/MenuPopup.js';
import Scoreboard from './scripts/Scoreboard.js';
import { gameSettings } from './utills/constants.js';
import { createElement } from './utills/utills.js';

const layout = createElement('main', 'main');

const scoreboard = new Scoreboard({ container: layout });
const controls = new Controls({ container: layout });
const menuPopup = new MenuPopup({ container: document.body })

const eventEmiter = new EventEmiter();
const fieldView = new Field({
  emiter: eventEmiter,
  container: layout,
});

const game = new Game({
  view: fieldView,
  emiter: eventEmiter,
});

document.body.appendChild(layout);
scoreboard.init();
game.start(gameSettings.easy);
controls.init();
menuPopup.init();
