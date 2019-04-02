import createElement from './create-element.js';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template`);
  }

  render() {
    // const potentialElement = createElement(this.template);
    // if (potentialElement.firstChild.nodeName === `INPUT`) {
    //   this._element = document.createDocumentFragment();
    //   for (const child of potentialElement.childNodes) {
    //     this._element.appendChild(child);
    //   }
    // } else {
    //   this._element = potentialElement;
    // }
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
