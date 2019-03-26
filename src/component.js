import createElement from './create-element.js';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  getTotalPrice() {
    this._totalPrice = this._price;
    for (const offer of this._offers) {
      if (offer.isChecked) {
        this._totalPrice += offer.price;
      }
    }
    return this._totalPrice;
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

  update() {}
}

export default Component;
