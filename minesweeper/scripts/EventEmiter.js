export default class EventEmiter {
  constructor() {
    this.listeners = {};
  }

  checkEvent(event) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
  }

  attach(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  detach(event, callback) {
    this.checkEvent(event);
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  emit(event, ...args) {
    this.checkEvent(event);
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
