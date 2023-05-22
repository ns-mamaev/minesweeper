import { createElement } from "../utills/utills.js";
import View from "./View.js";

export default class Popup extends View {
  constructor({ container, className }) {
    super(container);
    this.view = createElement('div', ['popup', className, 'popup_opened'])
    this.inner = createElement('div', 'popup__inner');
    this.closeBtn = createElement('button', 'popup__close-btn')
    this.inner.append(this.closeBtn);
    this.view.append(this.inner);
    this.handlePressEsc = this.handlePressEsc.bind(this);
  }

  open() {
    this.view.classList.add('popup_opened');
    window.addEventListener('keydown', this.handlePressEsc);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.view.classList.remove('popup_opened');
    window.removeEventListener('keydown', this.handlePressEsc);
    document.body.style.overflow = '';
  }

  handleClick(e) {
    console.log('click')
    if (e.target === this.closeBtn || e.target === this.view) {
      this.close();
    }
  }

  handlePressEsc(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }
  
  addListeners() {
    this.view.addEventListener('click', (e) => this.handleClick(e))
  }

  init() {
    this.addListeners();
    this.render();
  }
}
