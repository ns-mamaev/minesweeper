import { createElement } from "../utills/utills.js";
import View from "./View.js";

export default class Controls extends View {
  constructor({ container, emiter }) {
    super(container);
    this.eventEmiter = emiter
    this.menuBtn = this.createButton('menu', 'menu');
    this.pauseBtn = this.createButton('pause', 'pause');
    this.resetBtn = this.createButton('reset', 'reset');
    this.blockBtns();
    this.view = createElement('div', 'controls');
    this.view.append(this.menuBtn, this.pauseBtn, this.resetBtn);

    emiter.attach('firstmove', () => this.unblockBtns());
    emiter.attach('newgame', () => this.blockBtns());
    emiter.attach('gameover', () => this.pauseBtn.disabled = true);
    emiter.attach('win', () => this.pauseBtn.disabled = true);
  }

  createButton(caption, type) {
    const el = createElement('button', ['controls__button', `controls__button_type_${type}`])
    el.innerHTML = `
      <div class="controls__img"></div>
      ${caption}`;
    return el;
  }

  unblockBtns() {
    this.resetBtn.removeAttribute('disabled');
    this.pauseBtn.removeAttribute('disabled');
  }

  blockBtns() {
    this.resetBtn.setAttribute('disabled', true);
    this.pauseBtn.setAttribute('disabled', true);
  }

  handleMenuBtn() {
    this.eventEmiter.emit('openmenu');
  }

  handleResetBtn() {
    this.eventEmiter.emit('newgame');
    this.blockBtns();
  }

  handlePauseBtn(e) {
    const btnClasses = e.currentTarget.classList
    if (btnClasses.contains('controls__button_type_pause')) {
      // shold pause
      btnClasses.remove('controls__button_type_pause');
      btnClasses.add('controls__button_type_play');
      this.eventEmiter.emit('pause');
    } else {
      btnClasses.remove('controls__button_type_play');
      btnClasses.add('controls__button_type_pause');
      this.eventEmiter.emit('resume');
    }
  }

  addListeners() {
    this.menuBtn.addEventListener('click', () => this.handleMenuBtn());
    this.pauseBtn.addEventListener('click', (e) => this.handlePauseBtn(e));
    this.resetBtn.addEventListener('click', () => this.handleResetBtn());
  }

  init() {
    this.addListeners();
    this.render();
  }
}
