export default class GameTimer {
  constructor({ emiter }) {
    this.eventEmiter = emiter;
    this.startTick = 0;
    this.time = 0;
    emiter.attach('firstmove', () => this.start());
    emiter.attach('pause', () => this.pause());
    emiter.attach('resume', () => this.start());
    emiter.attach('newgame', () => this.reset());
  }

  start() {
    this.startTick = new Date().getTime() - this.time * 1000;
    this.timer = setInterval(() => {
      const lastTick = new Date().getTime();
      const timerValue = lastTick - this.startTick;
      const seconds = Math.round(timerValue / 1000);
      this.time = seconds;
      this.eventEmiter.emit('tick', seconds);
    }, 1000)
  }

  pause() {
    clearInterval(this.timer);
  }

  reset() {
    clearInterval(this.timer);
    this.startTick = 0;
    this.time = 0;
    this.eventEmiter.emit('tick', 0);
  }
}
