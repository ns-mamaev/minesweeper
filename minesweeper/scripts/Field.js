import { qtySuffixes } from "../utills/constants.js";
import { createElement } from "../utills/utills.js";
import View from "./View.js";

export default class Field extends View {
  constructor({ emiter, container }) {
    super(container);
    this.view = createElement('ul', 'game-field');
    this.pauseStub = createElement('div', 'game-field__stub', 'Game paused')
    this.eventEmiter = emiter;
    this.container = container;
    emiter.attach('gameover', this.handleGameover.bind(this));
    emiter.attach('win', () => this.removeListeners());
    emiter.attach('showCell', this.showCell.bind(this));
    emiter.attach('pause', this.handlePause.bind(this));
    emiter.attach('resume', this.handleResume.bind(this));
    emiter.attach('gamestart', this.init.bind(this));

    this.clickCell = this.clickCell.bind(this);
  }

  init({ x, y, openedCells }) {
    const cells = [];
    // remove old fild
    this.removeListeners();
    this.view.innerHTML = '';

    this.view.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    for (let i = 0; i < y; i++) {
      const row = [];
      for (let j = 0; j < x; j++) {
        const cell = document.createElement('li');
        cell.classList.add('game-field__cell');
        const coords = `${j}x${i}`;
        cell.setAttribute('data-coords', coords);
        row.push(cell);
      }
      cells.push(row);
    }
    const flatCells = cells.flat(1)
    this.view.append(...flatCells);
    this.cells = cells;

    openedCells.forEach(([x, y, value]) => {
      this.showCell(x, y, value);
    })

    this.render();
    this.addListeners();
  }

  handleGameover(bombsCoords, currentBombCoords) {
    this.removeListeners();
    const { x: currentX, y: currentY } = currentBombCoords;
    bombsCoords.forEach(([ x, y ]) => {
      const cell = this.cells[y][x];
      const bombClass = x === currentX && y === currentY
        ? 'game-field__cell_type_current-bomb'
        : 'game-field__cell_type_bomb';

      cell.classList.add(bombClass);
    });
  }

  showCell(x, y, content) {
    const cell = this.cells[y][x];
    if (content) {
      cell.textContent = content;
      const classSufix = qtySuffixes[content] || qtySuffixes.more;
      cell.classList.add(`game-field__cell_qty_${classSufix}`);
    } else {
      cell.classList.add('game-field__cell_type_empty');
    }
    cell.classList.add('game-field__cell_type_opened');
  }

  handlePause() {
    this.view.replaceWith(this.pauseStub);
  }

  handleResume() {
    this.pauseStub.replaceWith(this.view);
  }

  clickCell(e) {
    const cell = e.target.closest('.game-field__cell');
    if (cell && !cell.classList.contains('game-field__cell_type_opened')) {
      const [ x, y ] = cell.dataset.coords.split('x');
      if (e.type === 'click' && !cell.classList.contains('game-field__cell_type_flag')) {
        this.eventEmiter.emit('open', +x, +y);
      }
      if (e.type === 'contextmenu') {
        e.preventDefault();
        this.eventEmiter.emit('flag', +x, +y);
        cell.classList.toggle('game-field__cell_type_flag')
      }
    }
  }

  addListeners() {
    this.view.addEventListener('click', this.clickCell);
    this.view.addEventListener('contextmenu', this.clickCell);
  }

  removeListeners() {
    this.view.removeEventListener('click', this.clickCell);
    this.view.removeEventListener('contextmenu', this.clickCell)
  }
}
