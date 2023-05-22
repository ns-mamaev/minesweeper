import { qtySuffixes } from "../utills/constants.js";
import View from "./View.js";

export default class Field extends View {
  constructor({ emiter, container }) {
    super(container);
    this.view = document.createElement('ul')
    this.view.classList.add('game-field');
    this.eventEmiter = emiter;
    this.container = container;
    emiter.attach('gameover', this.handleGameover.bind(this));
    emiter.attach('showCell', this.showCell.bind(this));
  }

  init(x, y) {
    const cells = [];
    this.view.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        const cell = document.createElement('li');
        cell.classList.add('game-field__cell');
        const coords = `${j}x${i}`;
        cell.setAttribute('data-coords', coords);
        
        cells.push(cell);
      }
    }
    this.view.append(...cells);

    this.render();
    this.addListeners();
  }

  findCell(x, y) {
    return this.view.querySelector(`[data-coords="${x}x${y}"]`);
  }

  handleGameover(bombsCoords, currentBombCoords) {
    const { x: currentX, y: currentY } = currentBombCoords;
    bombsCoords.forEach(({ x, y }) => {
      const cell = this.findCell(x, y);
      const bombClass = x === currentX && y === currentY
        ? 'game-field__cell_type_current-bomb'
        : 'game-field__cell_type_bomb';

      cell.classList.add(bombClass);
    });
  }

  showCell(x, y, content) {
    const cell = this.findCell(x, y);
    if (content) {
      cell.textContent = content;
      const classSufix = qtySuffixes[content] || qtySuffixes.more;
      cell.classList.add(`game-field__cell_qty_${classSufix}`);
    } else {
      cell.classList.add('game-field__cell_type_empty');
    }
    cell.classList.add('game-field__cell_type_opened');
  }

  addListeners() {
    this.view.addEventListener('click', (e) => {
      const cell = e.target.closest('.game-field__cell');
      if (cell && !cell.classList.contains('game-field__cell_type_opened')) {
        const [ x, y ] = cell.dataset.coords.split('x');
        this.eventEmiter.emit('open', +x, +y);
      }
    });
    this.view.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.game-field__cell');
      if (cell) {
        cell.classList.toggle('game-field__cell_type_flag');
      }
    })
  }
}
