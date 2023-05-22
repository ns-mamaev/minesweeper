import { createElement, createTimeString } from "../utills/utills.js";
import View from "./View.js";

export default class Scoreboard extends View {
  constructor({ container, emiter }) {
    super(container);
    this.eventEmiter = emiter
    this.score = 0;
    this.bombsQty = 0;
    this.view = createElement('div', 'scoreboard');
    const scoreCard = this.createCard(this.score, 'score');
    const timerCard = this.createCard('00:00:00', 'time');
    const flagsCard = this.createCard(this.bombsQty, 'flags')
    this.view.append(scoreCard, timerCard, flagsCard)
    this._timer = timerCard.firstElementChild;

    emiter.attach('tick', (seconds) => this.changeTime(seconds));
  }

  set timer(timeString) {
    this._timer.textContent = timeString;
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
