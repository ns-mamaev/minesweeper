import { aroundCellCoords } from "../utills/constants.js";
import { getRandomInt } from "../utills/utills.js";

export default class Game {
  constructor() {
  }

  createField(x, y) {
    const field = [...Array(y)].map(() => [...Array(x)].map(() => 0));
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
      this.field[y][x] = 'B';

      // count bombs
      for (const [deltaX, deltaY] of aroundCellCoords) {
        const nearbyCellY = y + deltaY;
        const nearbyCellX = x + deltaX;

        if (nearbyCellX > this.xSize - 1 || nearbyCellX < 0) continue;
        if (nearbyCellY > this.ySize - 1 || nearbyCellY < 0) continue;

        const isBomb = this.field[nearbyCellY][nearbyCellX] === 'B';

        if (!isBomb) {
          this.field[nearbyCellY][nearbyCellX]++;
        }
      }
    })
    console.log(this.field);
  }

  start(gameSettings) {
    console.log('game started!')
    const { x, y, bombs } = gameSettings;
    this.xSize = x;
    this.ySize = y;
    this.fieldSize = x * y;
    this.bombsQty = bombs;
    this.createField(x, y);
    this.setBombs();
  }
}

