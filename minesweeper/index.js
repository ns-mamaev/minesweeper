import Cell from './scripts/Cell.js';
import Field from './scripts/Field.js';
import Game from './scripts/Game.js';
import { gameSettings } from './utills/constants.js';

document.body.innerHTML = '<h1>minesweeper!</h1>';

const game = new Game({
  view: new Field({
    cell: Cell
  }),
});

game.start(gameSettings.easy);
