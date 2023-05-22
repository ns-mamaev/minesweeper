import View from "./View.js";

export default class Controls extends View {
  constructor({ container }) {
    super(container);

    this.score = 0;
    this.timer = 0;
    this.bombsQty = 0;
  }

  init() {
    this.view = document.createElement('div');
    this.view.classList.add('controls');
    this.view.innerHTML = `
    <button class="controls__button">
      <div class="controls__img controls__img_type_menu"></div>
      menu
    </button>
    <button class="controls__button">
      <div class="controls__img controls__img_type_pause"></div>
      pause
    </button>
    <button class="controls__button">
      <div class="controls__img controls__img_type_reset"></div>
      reset
    </button>
  `;

    this.render();
  }
}
