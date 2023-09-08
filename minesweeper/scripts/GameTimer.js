export default class GameTimer {
  constructor({ emiter }) {
    this.eventEmiter = emiter;
    this.startTick = 0;
    this.time = localStorage.getItem('time') || 0;
    emiter.attach('timerstart', () => this.start());
    emiter.attach('pause', () => this.pause());
    emiter.attach('resume', () => this.start());
    emiter.attach('newgame', () => this.reset());
    emiter.attach('gameover', () => this.pause());
    emiter.attach('win', () => this.pause());
  }

  start() {
    this.startTick = new Date().getTime() - this.time * 1000;
    this.timer = setInterval(() => {
      const lastTick = new Date().getTime();
      const timerValue = lastTick - this.startTick;
      const seconds = Math.round(timerValue / 1000);
      this.time = seconds;
      this.eventEmiter.emit('tick', seconds);
      localStorage.setItem('time', this.time);
    }, 1000)
  }

  pause() {
    clearInterval(this.timer);
  }

  reset() {
    clearInterval(this.timer);
    this.startTick = 0;
    this.time = 0;
    localStorage.removeItem('time');
  }
}
