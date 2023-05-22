import { createElement } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class WinPopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className:'popup_type_win' })
    this.eventEmiter = emiter;
    this.congrats = createElement('h2');
    this.inner.append(this.congrats);
    emiter.attach('win', () => this.handleWin());
  }

  handleWin() {
    this.congrats.textContent = 'Congratulations!'
    this.open();
  }
}
