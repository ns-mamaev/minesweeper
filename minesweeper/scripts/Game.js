import { BOMB_TAG, aroundCellCoords, gameSettings } from "../utills/constants.js";
import { getRandomInt } from "../utills/utills.js";

export default class Game {
  constructor({ emiter, settings = gameSettings.easy }) {
    this.eventEmiter = emiter;
    this.gameSettings = settings;
    this.firstMove = true;
    this.bombsCoords = [];
    this.openedCells = 0;
    emiter.attach('open', this.openCell.bind(this));
    emiter.attach('newgame', this.start.bind(this));
  }

  handleNewgame(settings) {
    if (settings) {
      this.gameSettings = settings;
    }
    this.start();
  }

  createField(x, y) {
    const field = [...Array(y)]
      .map(() => [...Array(x)].map(() => ({ value: 0, opened: false })));
    this.field = field;
  }

  bypassAround(x, y, callback) {
    for (const [deltaX, deltaY] of aroundCellCoords) {
      const nearbyCellY = y + deltaY;
      const nearbyCellX = x + deltaX;

      if (nearbyCellX > this.xSize - 1 || nearbyCellX < 0) continue;
      if (nearbyCellY > this.ySize - 1 || nearbyCellY < 0) continue;

      callback(nearbyCellX, nearbyCellY)
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

  openCell(x, y) {
    // user cannot lose the game on the first move - bombs set after first move
    if (this.firstMove) {
      const firstMoveIndex = y * this.xSize + x;
      this.setBombs(firstMoveIndex);
      this.firstMove = false;
      this.eventEmiter.emit('firstmove');
    }

    const cellValue = this.field[y][x].value;
    this.field[y][x].opened = true;
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

    this.checkWinning();
  }

  handleGameOver(x, y) {
    const currentBombCoords = { x, y }
    this.eventEmiter.emit('gameover', this.bombsCoords, currentBombCoords);
  }

  checkWinning() {
    if (this.fieldSize - this.openedCells <= this.bombsQty) {
      console.log('WIN!') 
    }
  }

  handleOpenCell(x, y, value) {
    this.eventEmiter.emit('showCell', x, y, value);
  }

  start() {
    const { x, y, bombs } = this.gameSettings;
    this.xSize = x;
    this.ySize = y;
    this.fieldSize = x * y;
    this.bombsQty = bombs;
    this.createField(x, y);

    this.eventEmiter.emit('gamestart', x, y);
  }
}
