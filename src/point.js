import Component from './component.js';
import {tripTypes} from './data.js';
import moment from 'moment';

class Point extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._event = data.event;
    this._destination = data.destination;
    this._offers = data.offers;
    this._startTime = moment(data.startTime);
    this._endTime = moment(data.endTime);
    this._price = data.price;

    this._state.isFavorite = data.isFavorite;
    this._state.isDeleted = false;
    this._onEdit = null;

    this._onElementClick = this._onElementClick.bind(this);
  }

  _onElementClick() {
    typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get duration() {
    const diff = moment(this._startTime.diff(this._endTime));
    const diffArr = diff.format('H m').split(` `);

    if (diffArr[0] === `0`) {
      return `${diffArr[1]}M`;
    } else if (diffArr[1] === `0`) {
      return `${diffArr[0]}H`;
    } else {
      return `${diffArr[0]}H ${diffArr[1]}M`;
    }
  }

  get template() {
    return `<article class="trip-point">
      <i class="trip-icon">${tripTypes[this._event].icon}</i>
      <h3 class="trip-point__title">${tripTypes[this._event].text} ${this._destination.name}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${this._startTime.format('HH:MM')}&nbsp;&mdash; ${this._endTime.format('HH:MM')}</span>
        <span class="trip-point__duration">${this.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
        ${(Array.from(this._offers)
          .filter((offer) => (offer.accepted === true))
          .map((offer) => (`<li><button class="trip-point__offer">${offer.title} &plus;&euro;${offer.price}</button></li>`).trim()))
          .join(``)}
      </ul>
    </article>`;
  }

  bind() {
    this._element.addEventListener(`click`, this._onElementClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onElementClick);
  }

  update(data) {
    this._event = data.event;
    this._destination = data.destination;
    this._offers = data.offers;
    this._startTime = moment(data.startTime);
    this._endTime = moment(data.endTime);
    this._price = data.price;
    this._state.isFavorite = data.isFavorite;
  }
}

export default Point;
