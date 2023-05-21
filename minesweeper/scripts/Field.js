export default class Field {
  constructor() {
    const view = document.createElement('ul')
    view.classList.add('game-field');

    this.view = view;
  }

  init(x, y) {
    const cells = [];
    this.view.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        const cell = document.createElement('li');
        cell.classList.add('game-field__cell');
        cell.setAttribute('data-coord', i);
        cell.setAttribute('data-x', j);
        
        cells.push(cell);
      }
    }
    this.view.append(...cells);

    this.render();
  }

  render() {
    document.body.append(this.view);
  }

}
