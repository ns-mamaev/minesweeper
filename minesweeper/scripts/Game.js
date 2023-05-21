import { BOMB_TAG, aroundCellCoords } from "../utills/constants.js";
import { getRandomInt } from "../utills/utills.js";

export default class Game {
  constructor({ view, emiter }) {
    this.eventEmiter = emiter;
    this.view = view;
    this.firstMove = true;
    this.bombsCoords = [];
    emiter.attach('open', this.openCell.bind(this));
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
      const bombIndex = getRandomInt(0, this.xSize * this.ySize);
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
    if (this.firstMove) {
      const firstMoveIndex = y * this.xSize + x;
      this.setBombs(firstMoveIndex);
      this.firstMove = false;
    }
    const cellValue = this.field[y][x].value;
    this.field[y][x].opened = true;

    switch (cellValue) {
      case BOMB_TAG:
        this.handleGameOver(x, y);
        break;
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
  }

  handleGameOver(x, y) {
    const currentBombCoords = { x, y }
    this.eventEmiter.emit('gameover', this.bombsCoords, currentBombCoords);
  }

  handleOpenCell(x, y, value) {
    this.eventEmiter.emit('showCell', x, y, value);
  }

  start(gameSettings) {
    const { x, y, bombs } = gameSettings;
    this.xSize = x;
    this.ySize = y;
    this.fieldSize = x * y;
    this.bombsQty = bombs;
    this.createField(x, y);
    this.view.init(x, y);
  }
}
