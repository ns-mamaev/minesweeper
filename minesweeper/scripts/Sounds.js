import { soundsState } from "../utills/constants.js";

export default class Sounds {
  constructor({ emitter }) {
    this.eventEmitter = emitter;
    this.handleGameover = this.handleGameover.bind(this);
    this.handleWin = this.handleWin.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    emitter.attach('soundchange', (state) => {
      if (state === soundsState.ON) {
        this.on();
      } else if (state === soundsState.OFF) {
        this.off();
      }
    })
  }

  on() {
    this.eventEmitter.attach('gameover', this.handleGameover);
    this.eventEmitter.attach('win', this.handleWin);
    this.eventEmitter.attach('open', this.handleOpen);
    localStorage.setItem('sounds', soundsState.ON);
  }

  off() {
    this.eventEmitter.detach('gameover', this.handleGameover);
    this.eventEmitter.detach('win', this.handleWin);
    this.eventEmitter.detach('open', this.handleOpen);
    localStorage.setItem('sounds', soundsState.OFF);
  }

  handleGameover() {
    this.lose.currentTime = 0;
    this.lose.play();
  }

  handleWin() {
    this.win.currentTime = 0;
    this.win.play();
  }

  handleOpen() {
    this.open.currentTime = 0;
    this.open.play();
  }

  init() {
    this.win = new Audio('./assets/sounds/win.mp3');
    this.lose = new Audio('./assets/sounds/lose.mp3');
    this.open = new Audio('./assets/sounds/click.mp3');
    const state = localStorage.getItem('sounds');
    if (!state || state === soundsState.ON) {
      this.on();
    }
  }
}
