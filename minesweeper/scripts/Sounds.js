export default class Sounds {
  constructor({ emitter }) {
    this.eventEmitter = emitter;
    this.handleGameover = this.handleGameover.bind(this);
    this.handleWin = this.handleWin.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  on() {
    this.eventEmitter.attach('gameover', this.handleGameover);
    this.eventEmitter.attach('win', this.handleWin);
    this.eventEmitter.attach('open', this.handleOpen);
  }

  off() {
    this.eventEmitter.detach('gameover', this.handleGameover);
    this.eventEmitter.detach('win', this.handleWin);
    this.eventEmitter.detach('open', this.handleOpen);
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
    if (!state || state === '1') {
      this.on();
    }
  }
}
