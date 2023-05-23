import { createElement, createTimeString } from "../utills/utills.js";
import View from "./View.js";

export default class Scoreboard extends View {
  constructor({ container, emiter }) {
    super(container);
    this.eventEmiter = emiter;
    this.view = createElement('div', 'scoreboard');
    const scoreCard = this.createCard('0', 'score');
    const timerCard = this.createCard('00:00:00', 'time');
    const flagsCard = this.createCard(0, 'flags')
    this.view.append(scoreCard, timerCard, flagsCard)
    this._timerEl = timerCard.firstElementChild;
    this._scoreEl = scoreCard.firstElementChild;
    this._flagsEl = flagsCard.firstElementChild;
    this.bombsQty = null;

    emiter.attach('tick', (seconds) => this.changeTime(seconds));
    emiter.attach('changescore', (score) => this.score = score);
    emiter.attach('gamestart', (settings) => this.handleNewGame(settings));
    emiter.attach('changeflags', (qty) => this.flags = qty)
  }

  set timer(timeString) {
    this._timerEl.textContent = timeString;
  }

  set score(value) {
    this._scoreEl.textContent = value;
  }

  set flags(value) {
    this._flagsEl.textContent = `${value}/${this.bombsQty}`;
  }

  handleNewGame({ bombs, time, score, flagsQty }) {
    this.bombsQty = bombs;
    this.timer = createTimeString(time);
    this.score = score;
    this.flags = flagsQty;
  }

  createCard(value, type) {
    const card = createElement('div', 'scoreboard__item');
    card.innerHTML = `
      <span class="scoreboard__item-value">${value}</span>
      <div class="scoreboard__item-caption scoreboard__item-caption_type_${type}"></div>`;
    return card;
  }

  changeTime(time) {
    this.timer = createTimeString(time);
  }

  init() {
    this.render();
  }
}
