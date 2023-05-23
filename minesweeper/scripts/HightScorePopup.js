import { createElement, createTimeString } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class HightScorePopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className: 'popup_type_history' });
    this.eventEmitter = emiter;
    this.history = [];
    const heading = createElement('h2', 'popup__heading', 'High score');
    this.table = createElement('ul', 'history');
    const tableHeading = this.createRow({
      size: 'size',
      bombs: 'bombs',
      moves: 'moves', 
      time: 'time',
    });
    this.addRow(tableHeading);
    this.restoreData();

    this.inner.append(heading, this.table);

    emiter.attach('historyopen', this.open.bind(this));
    emiter.attach('win', this.handleWin.bind(this));
    this.open();
  }

  restoreData() {
    const stored = JSON.parse(localStorage.getItem('hightscore'));
    if (stored) {
      this.history = stored;
      this.history.forEach(data => {
        const row = this.createRow(data);
        this.addRow(row);
      })
    }
  }

  createRow(data) {
    const { size, bombs, moves, time } = data;
    const row = createElement('li', 'history__item');
    row.innerHTML = `
      <span class='history__item-size'>${size}</span>
      <span class='history__item-bombs'>${bombs}</span>
      <span class='history__item-moves'>${moves}</span>
      <span class='history__item-moves'>${time}</span>
    `;
    return row;
  }

  addRow(row) {
    this.table.appendChild(row);
  }

  removeRow(index) {
    this.table.children[index + 1].remove();
  }

  handleWin(data) {
    this.history.push(data);
    const { x, y, time, ...rest } = data;
    const size = `${x}x${y}`
    const timeStr = createTimeString(time);
    const row = this.createRow({ size, time: timeStr, ...rest });
    this.addRow(row);
    if (this.history.length > 10) {
      this.history.shift();
      this.removeRow(1);
    }
    localStorage.setItem('hightscore', JSON.stringify(this.history))
  }
}
