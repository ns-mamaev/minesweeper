import { themes } from "../utills/constants.js";

export default class ThemeSwitcher {
  constructor({ emitter, rootElement }) {
    this.eventEmiter = emitter;
    this.state = localStorage.getItem('theme') || themes.LIGHT;
    this.root = rootElement;
    emitter.attach('themechange', (newTheme) => this.changeTheme(newTheme));
  }

  changeTheme(newTheme) {
    this.root.classList.remove(this.state);
    this.root.classList.add(newTheme);
    this.state = newTheme;
    localStorage.setItem('theme', newTheme);
  }

  init() {
    this.root.classList.add(this.state);
  }
}
