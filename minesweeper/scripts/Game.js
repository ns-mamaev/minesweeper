import { BOMB_TAG, aroundCellCoords, gameSettings } from "../utills/constants.js";
import { getRandomInt } from "../utills/utills.js";

export default class Game {
  constructor({ emiter, settings = gameSettings.easy }) {
    this.eventEmiter = emiter;
    const storedSettings = JSON.parse(localStorage.getItem('gameSettings'));
    this.gameSettings = storedSettings || settings;
    emiter.attach('open', this.handlePlayerMove.bind(this));
    emiter.attach('newgame', this.handleNewgame.bind(this));
    emiter.attach('flag', this.flagCell.bind(this));
  }

  handleNewgame(settings) {
    if (settings) {
      this.gameSettings = settings;
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    }
    this.start();
  }

  createField(x, y) {
    const field = [...Array(y)]
      .map(() => [...Array(x)].map(() => ({ value: 0, opened: false, flag: false })));
    this.field = field;
  }

  bypassAround(x, y, callback) {
    for (const [deltaX, deltaY] of aroundCellCoords) {
      const nearbyCellY = y + deltaY;
      const nearbyCellX = x + deltaX;

      if (nearbyCellX > this.xSize - 1 || nearbyCellX < 0) continue;
      if (nearbyCellY > this.ySize - 1 || nearbyCellY < 0) continue;

      callback(nearbyCellX, nearbyCellY);
    }
  }

  setBombs(firstMoveIndex) {
    const bombsIndexes = new Set();
    let rest = this.bombsQty;
    while (rest) {
      const bombIndex = getRandomInt(0, this.fieldSize);
      const shouldCreateBomb = !bombsIndexes.has(bombIndex) && bombIndex !== firstMoveIndex;
      if (shouldCreateBomb) {
        bombsIndexes.add(bombIndex);
        rest--;
      }
    }
    bombsIndexes.forEach(index => {
      const y = Math.floor(index / this.xSize);
      const x = index - this.xSize * y;

      // set bomb
      this.field[y][x].value = BOMB_TAG;
      this.bombsCoords.push({ x, y });

      // count bombs
      this.bypassAround(x, y, (nearbyCellX, nearbyCellY) => {
        const isBomb = this.field[nearbyCellY][nearbyCellX].value === BOMB_TAG;
        if (!isBomb) {
          this.field[nearbyCellY][nearbyCellX].value++;
        }
      })
    })
  }

  handlePlayerMove(x, y) {
     // user cannot lose the game on the first move - bombs set after first move
    if (this.firstMove) {
      const firstMoveIndex = y * this.xSize + x;
      this.setBombs(firstMoveIndex);
      this.firstMove = false;
      this.eventEmiter.emit('firstmove');
    }
    this.moves++;
    this.eventEmiter.emit('changescore', this.moves);
    this.openCell(x, y);
  }

  openCell(x, y) {
    const cell = this.field[y][x];
    const { value: cellValue, flag } = cell;
    if (flag) {
      return;
    }
    cell.opened = true;
    this.openedCells++;

    switch (cellValue) {
      case BOMB_TAG:
        this.handleGameOver(x, y);
        return;
      case 0:
        this.handleOpenCell(x, y);
        this.bypassAround(x, y, (nearbyCellX, nearbyCellY) => {
          const { value, opened } = this.field[nearbyCellY][nearbyCellX];
          const shouldOpen = value !== BOMB_TAG && !opened;
          if (shouldOpen) {
            this.openCell(nearbyCellX, nearbyCellY)
          }
        })
        break;
      default:
        this.handleOpenCell(x, y, cellValue);
        break;
    }
    // this.saveCellState(x, y);
    this.checkWinning();
  }

  flagCell(x, y) {
    const cell = this.field[y][x];
    if (cell.flag) {
      this.flags--;
      cell.flag = false;
    } else {
      this.flags++
      cell.flag = true;
    }
    this.eventEmiter.emit('changeflags', this.flags);
  }

  handleGameOver(x, y) {
    const currentBombCoords = { x, y }
    this.eventEmiter.emit('gameover', this.bombsCoords, currentBombCoords);
  }

  checkWinning() {
    if (this.fieldSize - this.openedCells <= this.bombsQty) {
      this.eventEmiter.emit('win');
    }
  }

  handleOpenCell(x, y, value) {
    this.eventEmiter.emit('showCell', x, y, value);
  }

  // keep game in LS
  // saveCellState(x, y) {
  //   localStorage.setItem(`cell${x}x${y}`, JSON.stringify(this.field[y][x]));
  // }

  // clearStoredGame() {
  // }

  // restoreGame() {

  // }

  start() {
    const { x, y, bombs } = this.gameSettings;
    this.firstMove = true;
    this.bombsCoords = [];
    this.openedCells = 0;
    this.moves = 0;
    this.flags = 0;
    this.xSize = x;
    this.ySize = y;
    this.fieldSize = x * y;
    this.bombsQty = bombs;
    this.createField(x, y);

    this.eventEmiter.emit('gamestart', { x, y, bombs });
  }
}
