import View from "./View.js";

export default class Scoreboard extends View {
  constructor({ container }) {
    super(container);

    this.score = 0;
    this.timer = 0;
    this.bombsQty = 0;
  }

  init() {
    this.view = document.createElement('div');
    this.view.classList.add('scoreboard');
    this.view.innerHTML = `
    <div class="scoreboard__item">
      <span class="scoreboard__item-value">4</span>
      <div class="scoreboard__item-caption scoreboard__item-caption_type_score"></div>
    </div>
    <div class="scoreboard__item">
      <span class="scoreboard__item-value">02:12</span>
      <div class="scoreboard__item-caption scoreboard__item-caption_type_time"></div>
    </div>
    <div class="scoreboard__item">
      <span class="scoreboard__item-value">0 / 10</span>
      <div class="scoreboard__item-caption  scoreboard__item-caption_type_flags"></div>
    </div>
  `;

    this.render();
  }
}
