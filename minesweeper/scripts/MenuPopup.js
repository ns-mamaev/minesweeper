import { gameSettings } from "../utills/constants.js";
import { createElement } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class MenuPopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className:'popup_type_menu' })
    this.emiter = emiter;
    this.emiter.attach('openmenu', () => this.open());
    
    this.content = createElement('div', 'menu');
    const difficulty = createElement('div', 'menu__difficulty');
    
    const heading = createElement('h2', 'menu__heading', 'Change difficulty');
    const difficultyButtons = Object
    .keys(gameSettings)
    .map((difficulty) => this.createGameButton(difficulty, gameSettings[difficulty]));
    difficulty.append(...difficultyButtons);
    
    this.content.append(heading, difficulty);

    this.inner.append(this.content);
  }

  createGameButton(difficulty, settings) {
    const { x, y, bombs } = settings;
    const btn = createElement('button', 'menu__difficulty-btn')
    btn.innerHTML = `
      <h3>${difficulty}</h3>
      <p>${x} x ${y}</p>
      <p>${bombs} bombs</p>
    `;
    return btn;
  }
}
