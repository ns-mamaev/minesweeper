import { createElement } from "../utills/utills.js";
import View from "./View.js";

export default class Controls extends View {
  constructor({ container, emiter }) {
    super(container);
    this.emiter = emiter
    this.score = 0;
    this.timer = 0;
    this.bombsQty = 0;
    this.menuBtn = this.createButton('menu', 'menu');
    this.pauseBtn = this.createButton('pause', 'pause');
    this.resetBtn = this.createButton('reset', 'reset');
    this.view = createElement('div', 'controls');
    this.view.append(this.menuBtn, this.pauseBtn, this.resetBtn);
  }

  createButton(caption, type) {
    const el = createElement('button', ['controls__button', `controls__button_type_${type}`])
    el.innerHTML = `
      <div class="controls__img"></div>
      ${caption}`;
    return el;
  }

  handleMenuBtn() {
    this.emiter.emit('openmenu');
  }


  addListeners() {
    this.menuBtn.addEventListener('click', () => this.handleMenuBtn());
  }

  init() {
    this.addListeners();
    this.render();
  }
}
