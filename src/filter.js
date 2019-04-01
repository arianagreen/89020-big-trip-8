import Component from './component.js';
import utils from './utils.js';
// import {createFilterElement} from './create-element.js';
// import createElement from './create-element.js';

class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._state.isChecked = data.isChecked;

    this._onFilter = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    typeof this._onFilter === `function` && this._onFilter(evt);
  }

  get template() {
    return `<input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" ${this._state.isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${this._name}">${utils.capitalizeFirstLetter(this._name)}</label>`;
  }

  // render() {
  //
  //
  //   this.element = fragment;
  //   this.bind();
  //   return this._element;
  // }

  bind() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }


}

export default Filter;
