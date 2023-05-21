export default class Field {
  constructor({ emiter }) {
    const view = document.createElement('ul')
    view.classList.add('game-field');

    this.view = view;
    this.eventEmiter = emiter;
    emiter.attach('gameover', this.showGameover.bind(this));
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

  render() {
    document.body.append(this.view);
  }

  showGameover(bombsCoords, currentBombCoords) {
    const { x: currentX, y: currentY } = currentBombCoords;
    console.log(currentBombCoords)
    bombsCoords.forEach(({ x, y }) => {
      const cell = this.view.querySelector(`[data-coords="${x}x${y}"]`);
      const bombClass = x === currentX && y === currentY
        ? 'game-field__cell_type_current-bomb'
        : 'game-field__cell_type_bomb';

      cell.classList.add(bombClass);
    });
    
  }

  addListeners() {
    this.view.addEventListener('click', (e) => {
      const cell = e.target.closest('.game-field__cell');
      if (cell) {
        const [ x, y ] = cell.dataset.coords.split('x');
        this.eventEmiter.emit('open', +x, +y);
      }
    });
  }
}
