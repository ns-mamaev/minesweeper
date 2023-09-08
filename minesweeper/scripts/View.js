export default class View {
  constructor(container) {
    this.container = container;
    this.view = null;
    this.lastView = null;
  }

  render() {
    if (this.lastView) {
      this.lastView.replaceWith(this.view);
    } else {
      this.container.append(this.view);
    }
    this.lastView = this.view;
  }
}
