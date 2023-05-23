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
    emiter.attach('tick', this.handleTick.bind(this));

    this.initState();
  }

  handleNewgame(settings) {
    if (settings) {
      this.gameSettings = settings;
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    }
    this.clearGame();
    this.start();
  }

  handleTick(time) {
    this.time = time;
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

      if (nearbyCellX > this.gameSettings.x - 1 || nearbyCellX < 0) continue;
      if (nearbyCellY > this.gameSettings.y - 1 || nearbyCellY < 0) continue;

      callback(nearbyCellX, nearbyCellY);
    }
  }

  setBombs(firstMoveIndex) {
    const bombsIndexes = new Set();
    let rest = this.gameSettings.bombs;
    while (rest) {
      const bombIndex = getRandomInt(0, this.fieldSize);
      const shouldCreateBomb = !bombsIndexes.has(bombIndex) && bombIndex !== firstMoveIndex;
      if (shouldCreateBomb) {
        bombsIndexes.add(bombIndex);
        rest--;
      }
    }
    bombsIndexes.forEach(index => {
      const y = Math.floor(index / this.gameSettings.x);
      const x = index - this.gameSettings.x * y;

      // set bomb
      this.field[y][x].value = BOMB_TAG;
      this.bombsCoords.push([ x, y ]);

      // count bombs
      this.bypassAround(x, y, (nearbyCellX, nearbyCellY) => {
        const isBomb = this.field[nearbyCellY][nearbyCellX].value === BOMB_TAG;
        if (!isBomb) {
          this.field[nearbyCellY][nearbyCellX].value++;
        }
      })
    })

    this.digits = [];

    this.field.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.value && cell.value !== BOMB_TAG) {
          this.digits.push([ j, i, cell.value ]);
        }
      })
    })

    localStorage.setItem('digits', JSON.stringify(this.digits));
    localStorage.setItem('bombsCoords', JSON.stringify(this.bombsCoords));
  }

  handleFirstMove(x, y) {
    const firstMoveIndex = y * this.gameSettings.x + x;
    this.setBombs(firstMoveIndex);
    this.firstMove = false;
    localStorage.setItem('hasSavedGame', 1);
    // this.values =
    this.eventEmiter.emit('firstmove');
  }

  handlePlayerMove(x, y) {
     // user cannot lose the game on the first move - bombs set after first move
    if (this.firstMove) {
      this.handleFirstMove(x, y);
    }
    this.moves++;
    this.eventEmiter.emit('changescore', this.moves);
    this.openCell(x, y);
    localStorage.setItem('openedCells', JSON.stringify(this.openedCells));
    localStorage.setItem('moves', this.moves);
  }

  openCell(x, y) {
    const cell = this.field[y][x];
    const { value: cellValue, flag } = cell;

    this.openedCells.push([ x, y, cellValue ])

    if (flag) {
      return;
    }
    cell.opened = true;

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
    };
    this.checkWinning();
  }

  flagCell(x, y) {
    const cell = this.field[y][x];
    if (cell.flag) {
      this.flags--;
      cell.flag = false;
      debugger;
      this.flagCoords = this.flagCoords.filter(coord => coord[0] !== x || coord[1] !== y);
    } else {
      this.flags++
      cell.flag = true;
      this.flagCoords.push([x, y]);
    }
    localStorage.setItem('flagCoords', JSON.stringify(this.flagCoords));
    this.eventEmiter.emit('changeflags', this.flags);
  }

  handleGameOver(x, y) {
    const currentBombCoords = { x, y }
    this.eventEmiter.emit('gameover', this.bombsCoords, currentBombCoords);
    this.clearGame();
  }

  checkWinning() {
    if (this.fieldSize - this.openedCells.length <= this.gameSettings.bombs) {
      const stats = {
        time: this.time,
        moves: this.moves,
        ...this.gameSettings
      };
      this.clearGame();
      this.eventEmiter.emit('win', stats);
    }
  }

  handleOpenCell(x, y, value) {
    this.eventEmiter.emit('showCell', x, y, value);
  }

  start() {
    const { x, y, bombs } = this.gameSettings;
    this.createField(x, y);

    this.restoreGame();
    const settings = {
      x,
      y,
      bombs,
      openedCells: this.openedCells,
      flags: this.flagCoords,
    }
    this.eventEmiter.emit('gamestart', settings);
  }

  initState() {
    this.moves = 0;
    this.flags = 0;
    this.time = 0;
    this.fieldSize = this.gameSettings.x * this.gameSettings.y;
    this.flagCoords = [];
    this.bombsCoords = [];
    this.openedCells = [];
    this.digits = [];
    this.firstMove = true;
  }

  clearGame() {
    this.initState();
    localStorage.removeItem('moves'); //+
    localStorage.removeItem('flags');
    localStorage.removeItem('flagsCoords')
    localStorage.removeItem('time'); 
    localStorage.removeItem('digits');
    localStorage.removeItem('bombsCoords'); //+
    localStorage.removeItem('openedCells'); //+
    localStorage.removeItem('hasSavedGame'); //+
  }

  restoreGame() {
    const hasSavedGame = localStorage.getItem('hasSavedGame');
    if (!hasSavedGame) {
      return;
    }
    this.moves = localStorage.getItem('moves') || 0;
    this.flags = localStorage.getItem('flags') || 0;
    this.time = localStorage.getItem('time') || 0;
    this.bombsCoords = JSON.parse(localStorage.getItem('bombsCoords'));
    this.bombsCoords.forEach(([x, y]) => {
      this.field[y][x].value = BOMB_TAG;
    })
    this.openedCells = JSON.parse(localStorage.getItem('openedCells'));
    this.openedCells.forEach(([x, y]) => {
      this.field[y][x].opened = true;
    });
    this.digits = JSON.parse(localStorage.getItem('digits'));
    this.digits.forEach(([x, y, value]) => {
      this.field[y][x].value = value;
    })
    this.flagCoords = JSON.parse(localStorage.getItem('flagCoords')) || [];
    this.flagCoords.forEach(([x, y]) => {
      this.field[y][x].flag = true;
    })
    this.firstMove = false;
  }

}
