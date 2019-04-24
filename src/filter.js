import Component from './component.js';
import utils from './utils.js';

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

  get template() {
    return `<input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" ${this._state.isChecked ? `checked` : ``}>
    <label class="trip-filter__item" for="filter-${this._name}">${utils.capitalizeFirstLetter(this._name)}</label>`;
  }

  _onFilterClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  bind() {
    this._element.querySelector(`.trip-filter__item`)
                  .addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.querySelector(`.trip-filter__item`)
                  .removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;
