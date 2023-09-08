import { gameSettings, soundsState, themes } from "../utills/constants.js";
import { createElement } from "../utills/utills.js";
import Popup from "./Popup.js";

export default class MenuPopup extends Popup {
  constructor({ container, emiter }) {
    super({ container, className:'popup_type_menu' })
    this.theme = localStorage.getItem('theme') || themes.LIGHT;
    this.sounds = localStorage.getItem('sounds') || soundsState.ON;

    this.emiter = emiter;
    this.emiter.attach('openmenu', () => this.open());
    
    this.content = createElement('div', 'menu');
    const difficulty = createElement('div', 'menu__difficulty');
    
    const heading = createElement('h2', 'popup__heading', 'Change difficulty');
    const difficultyButtons = Object
    .keys(gameSettings)
    .map((difficulty) => this.createGameButton(difficulty, gameSettings[difficulty]));
    const customDifficultyButton = this.createCustomGameCard();
    difficulty.append(...difficultyButtons, customDifficultyButton);
    const iconButtons = this.createIconButtons();
    this.content.append(heading, difficulty, iconButtons);

    this.inner.append(this.content);
  }

  createIconButtons() {
    const buttons = createElement('div', 'menu__icons');
    this.soundsBtn = createElement('button', [
      'menu__icon-btn',
      this.sounds === soundsState.ON ? 'menu__icon-btn_type_sound' : 'menu__icon-btn_type_mute',
    ]);
    this.themeBtn = createElement('button', [
      'menu__icon-btn',
      this.theme === themes.LIGHT ? 'menu__icon-btn_type_theme-light' : 'menu__icon-btn_type_theme-dark',
    ]);
    this.statsBtn = createElement('button', ['menu__icon-btn', 'menu__icon-btn_type_stats']);

    buttons.append(this.soundsBtn, this.themeBtn, this.statsBtn);

    return buttons;
  }

  createGameButton(difficulty, settings) {
    const { x, y, bombs } = settings;
    const btn = createElement('button', 'menu__difficulty-card');
    btn.addEventListener('click', () => {
      this.emiter.emit('newgame', settings);
      this.close();
    })
    btn.innerHTML = `
      <h3 class="menu__difficulty-heading">${difficulty}</h3>
      <p class="menu__difficulty-text">${x} x ${y}</p>
      <p class="menu__difficulty-text">${bombs} bombs</p>
    `;
    return btn;
  }

  createCustomGameCard() {
    const card = createElement('div', ['menu__difficulty-card', 'menu__difficulty-card_type_custom']);
    const heading = createElement('h3', 'menu__difficulty-heading', 'custom');
    const form = createElement('form', 'menu__difficulty-form');
    form.setAttribute('id', 'custom-game');
    form.innerHTML = `
      <label class="menu__difficulty-label">
        <input name="x" min="10" max="25" class="menu__difficulty-input" type="number" placeholder="10-25" required>
        x
      </label>
      <label class="menu__difficulty-label">
        <input name="y" min="10" max="25" class="menu__difficulty-input" type="number" placeholder="10-25" required>
        y
      </label>
      <label class="menu__difficulty-label">
        <input name="bombs" min="10" max="99" class="menu__difficulty-input" type="number" placeholder="10-99" required>
        💣
      </label>`;
    const button = createElement('button', 'menu__custom-difficulty-btn', 'start');
    button.setAttribute('form', 'custom-game');
    button.setAttribute('type', 'submit');

    card.append(heading, form, button);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const settings = {
        x: +form.elements.x.value,
        y: +form.elements.y.value,
        bombs: +form.elements.bombs.value,
      };
      this.emiter.emit('newgame', settings);
      this.close();
    })

    return card;
  };


  toggleSounds() {
    this.soundsBtn.classList.toggle('menu__icon-btn_type_sound');
    this.soundsBtn.classList.toggle('menu__icon-btn_type_mute');
    const newState = this.sounds === soundsState.ON ? soundsState.OFF : soundsState.ON;
    this.sounds = newState;
    this.emiter.emit('soundchange', newState);
  }

  toggleTheme() {
    this.themeBtn.classList.toggle('menu__icon-btn_type_theme-light');
    this.themeBtn.classList.toggle('menu__icon-btn_type_theme-dark');
    const newTheme = this.theme === themes.LIGHT ? themes.DARK : themes.LIGHT;
    this.theme = newTheme;
    this.emiter.emit('themechange', newTheme);
  }

  addListeners() {
    super.addListeners();
    this.soundsBtn.addEventListener('click', () => this.toggleSounds());
    this.themeBtn.addEventListener('click', () => this.toggleTheme());
    this.statsBtn.addEventListener('click', () => {
      this.emiter.emit('historyopen');
    })
  }
}
