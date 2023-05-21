import { BOMB_TAG, aroundCellCoords } from "../utills/constants.js";
import { getRandomInt } from "../utills/utills.js";

export default class Game {
  constructor({ view }) {
    this.view = view;
  }

  createField(x, y) {
    const field = [...Array(y)]
      .map(() => [...Array(x)].map(() => ({ value: 0, opened: false })));
    this.field = field;
  }

  setBombs() {
    const bombsIndexes = new Set();
    let rest = this.bombsQty;
    while (rest) {
      const bombIndex = getRandomInt(0, this.xSize * this.ySize);
      if (!bombsIndexes.has(bombIndex)) {
        bombsIndexes.add(bombIndex);
        rest -= 1;
      }
    }

    bombsIndexes.forEach(index => {
      const y = Math.floor(index / this.xSize);
      const x = index - this.xSize * y;

      // set bomb
      this.field[y][x].value = BOMB_TAG;

      // count bombs
      for (const [deltaX, deltaY] of aroundCellCoords) {
        const nearbyCellY = y + deltaY;
        const nearbyCellX = x + deltaX;

        if (nearbyCellX > this.xSize - 1 || nearbyCellX < 0) continue;
        if (nearbyCellY > this.ySize - 1 || nearbyCellY < 0) continue;

        const isBomb = this.field[nearbyCellY][nearbyCellX].value === BOMB_TAG;

        if (!isBomb) {
          this.field[nearbyCellY][nearbyCellX].value++;
        }
      }
    })
    console.log(this.field);
  }

  openCell(x, y) {
    const cellValue = this.field[y][x].value;
    switch (cellValue) {
      case BOMB_TAG:
        this.handleGameOver();
        break;
      case 0:
        this.openEmptyCell();
      default:
        break;
    }
  }

  handleGameOver() {
    console.log('Хана, проиграл!')
  }

  openEmptyCell() {

  }
  

  start(gameSettings) {
    console.log('game started!')
    const { x, y, bombs } = gameSettings;
    this.xSize = x;
    this.ySize = y;
    this.fieldSize = x * y;
    this.bombsQty = bombs;
    this.createField(x, y);
    this.view.init(x, y);
    this.setBombs();
  }
}

