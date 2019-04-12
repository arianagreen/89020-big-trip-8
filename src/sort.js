import Component from './component.js';
import utils from './utils.js';

class Sort extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._state.isChecked = data.isChecked;

    this._onSort = null;
    this._onSortClick = this._onSortClick.bind(this);
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  _onSortClick(evt) {
    if (typeof this._onSort === `function`) {
      this._onSort(evt);
    }
  }

  get template() {
    return `<input type="radio" name="trip-sorting" id="sorting-${this._name}" value="${this._name}" ${this._state.isChecked ? `checked` : ``}>
    <label class="trip-sorting__item trip-sorting__item--${this._name}" for="sorting-${this._name}">${utils.capitalizeFirstLetter(this._name)}</label>`;
  }

  bind() {
    this._element.querySelector(`.trip-sorting__item`)
                  .addEventListener(`click`, this._onSortClick);
  }

  unbind() {
    this._element.querySelector(`.trip-sorting__item`)
                  .removeEventListener(`click`, this._onSortClick);
  }
}

export default Sort;
