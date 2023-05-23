import { createElement, createTimeString } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class ResultsPopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className:'popup_type_results' })
    this.eventEmiter = emiter;
    this.message = createElement('h2', 'popup__results-message');
    this.resetButton = createElement('button', 'popup__reset-btn');
    
    this.inner.append(this.message, this.resetButton);

    emiter.attach('win', this.handleWin.bind(this));
    emiter.attach('gameover', this.handleGameOver.bind(this));
  }

  handleWin({ time, moves }) {
    const fullTime = createTimeString(time);
    this.message.textContent = `Hooray! You found all mines\n in ${fullTime} and ${moves} moves!`
    this.open();
  }

  handleGameOver() {
    this.message.textContent = ':( Game over. Try again';
    this.open();
  }

  handleReset() {
    this.eventEmiter.emit('newgame');
    this.close();
  }

  addListeners() {
    super.addListeners();
    this.resetButton.addEventListener('click', () => this.handleReset());
  }
}
