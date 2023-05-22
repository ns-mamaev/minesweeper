import Controls from './scripts/Controls.js';
import EventEmiter from './scripts/EventEmiter.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import GameTimer from './scripts/GameTimer.js';
import MenuPopup from './scripts/MenuPopup.js';
import Scoreboard from './scripts/Scoreboard.js';
import WinPopup from './scripts/WinPopup.js';
import { gameSettings } from './utills/constants.js';
import { createElement } from './utills/utills.js';


const eventEmiter = new EventEmiter();
const layout = createElement('main', 'main');

const scoreboard = new Scoreboard({ container: layout, emiter: eventEmiter });
const controls = new Controls({ container: layout, emiter: eventEmiter });
const menuPopup = new MenuPopup({ container: document.body, emiter: eventEmiter });
const winPopup = new WinPopup({ container: document.body, emiter: eventEmiter });
const timer = new GameTimer({ emiter: eventEmiter });

const fieldView = new Field({
  emiter: eventEmiter,
  container: layout,
});

const game = new Game({ emiter: eventEmiter });

document.body.appendChild(layout);
scoreboard.init();
game.start(gameSettings.easy);
controls.init();
menuPopup.init();
winPopup.init();
console.log(eventEmiter)
