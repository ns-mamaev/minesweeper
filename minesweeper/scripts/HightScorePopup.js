import { createElement, createTimeString } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class HightScorePopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className: 'popup_type_history' });
    this.eventEmitter = emiter;
    this.history = [];
    this.stub = null;
    const heading = createElement('h2', 'popup__heading', 'Hight score');
    this.table = createElement('ul', 'history');
    const tableHeading = this.createRow({
      size: 'size',
      bombs: 'bombs',
      moves: 'moves', 
      time: 'time',
    });
    this.addRow(tableHeading);
    this.inner.append(heading, this.table);
    this.restoreData();

    emiter.attach('historyopen', this.open.bind(this));
    emiter.attach('win', this.handleWin.bind(this));

    this.open();
  }

  restoreData() {
    const stored = JSON.parse(localStorage.getItem('hightscore'));
    if (stored) {
      this.history = stored;
      this.history.forEach(data => {
        const row = this.createRow(this.transformData(data));
        this.addRow(row);
      });
    } else {
      this.stub = createElement(
        'p',
        'history__stub',
        'This is a table of your wins. you haven\'t won yet'
        );
      this.inner.append(this.stub);
    }
  }

  createRow(data) {
    const { size, bombs, moves, time } = data;
    const row = createElement('li', 'history__item');
    row.innerHTML = `
      <span class='history__column history__column_type_size'>${size}</span>
      <span class='history__column history__column_type_bombs'>${bombs}</span>
      <span class='history__column history__column_type_moves'>${moves}</span>
      <span class='history__column history__column_type_time'>${time}</span>
    `;
    return row;
  }

  transformData(data) {
    const { x, y, time, ...rest } = data;
    const size = `${x}x${y}`
    const timeStr = createTimeString(time);
    return { size, time: timeStr, ...rest };
  }

  addRow(row) {
    this.table.appendChild(row);
  }

  removeRow(index) {
    this.table.children[index + 1].remove();
  }

  handleWin(data) {
    if (this.stub) {
      this.stub.remove();
      this.stub = null;
    }
    this.history.push(data);
    const row = this.createRow(this.transformData(data));
    this.addRow(row);
    if (this.history.length > 10) {
      this.history.shift();
      this.removeRow(1);
    }
    localStorage.setItem('hightscore', JSON.stringify(this.history))
  }
}
