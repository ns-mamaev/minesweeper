export default class View {
  constructor(container) {
    this.container = container;
    this.view = null;
  }

  render() {
    this.container.append(this.view);
  }
}
