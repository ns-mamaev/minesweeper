import Controls from './scripts/Controls.js';
import EventEmiter from './scripts/EventEmiter.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import GameTimer from './scripts/GameTimer.js';
import MenuPopup from './scripts/MenuPopup.js';
import Scoreboard from './scripts/Scoreboard.js';
import Sounds from './scripts/Sounds.js';
import ThemeSwitcher from './scripts/ThemeSwitcher.js';
import ResultsPopup from './scripts/ResultsPopup.js';
import HightScorePopup from './scripts/HightScorePopup.js';
import { createElement } from './utills/utills.js';


const eventEmiter = new EventEmiter();
const layout = createElement('main', 'main');

const scoreboard = new Scoreboard({ container: layout, emiter: eventEmiter });
const controls = new Controls({ container: layout, emiter: eventEmiter });
const menuPopup = new MenuPopup({ container: document.body, emiter: eventEmiter });
const resultsPopup = new ResultsPopup({ container: document.body, emiter: eventEmiter });
const hightScorePopup = new HightScorePopup({ container: document.body, emiter: eventEmiter });
const timer = new GameTimer({ emiter: eventEmiter });
const sounds = new Sounds({ emitter: eventEmiter });
const themeSwitcher = new ThemeSwitcher({ emitter: eventEmiter, rootElement: document.body });

const fieldView = new Field({
  emiter: eventEmiter,
  container: layout,
});

const game = new Game({ emiter: eventEmiter });

document.body.appendChild(layout);
scoreboard.init();
game.start();
controls.init();
menuPopup.init();
resultsPopup.init();
hightScorePopup.init();
sounds.init();
themeSwitcher.init();
