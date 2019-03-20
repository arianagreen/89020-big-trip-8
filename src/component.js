import createElement from './create-element.js';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = ``;
  }

  getEndTime(start) {
    return new Date(Date.parse(start) + Math.random() * 2 * 60 * 60 * 1000);
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template`);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {}

  unbind() {}

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export default Component;