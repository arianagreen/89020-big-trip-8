import Component from './component.js';
import {BigData} from './data.js';

class Point extends Component {
  constructor(data) {
    super();
    this._event = data.event;
    // this._icon = data.icon;
    this._icon = BigData.tripTypes[data.event].icon;
    this._destination = data.destination;
    this._picture = data.picture;
    this._offers = data.offers;
    this._description = data.description;
    this._startTime = data.startTime;
    this._price = data.price;
    this._endTime = this.getEndTime(data.startTime);
    this._onEdit = null;
    this._onElementClick = this._onElementClick.bind(this);
    this._state.isFavorite = false;
  }

  _onElementClick() {
    typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get duration() {
    const diff = this._endTime - this._startTime;
    const diffMin = Math.round(diff / (60 * 1000));
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin - (hours * 60);

    let finalDiff = ``;

    if (hours > 0) {
      finalDiff += `${hours}H&nbsp;`;
    }

    if (minutes > 0) {
      finalDiff += `${minutes}M`;
    }

    return finalDiff;
  }

  get template() {
    const timeOptions = {
      hour: `numeric`,
      minute: `numeric`,
      hour12: false
    };

    return `<article class="trip-point">
      <i class="trip-icon">${this._icon}</i>
      <h3 class="trip-point__title">${BigData.tripTypes[this._event].text} ${this._destination}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${this._startTime.toLocaleString(`en`, timeOptions)}&nbsp;&mdash; ${this._endTime.toLocaleString(`en`, timeOptions)}</span>
        <span class="trip-point__duration">${this.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
      <ul class="trip-point__offers">
        ${(Array.from(this._offers)
          .filter((offer) => (offer.isChecked === true))
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
    this._icon = data.icon;
    this._offers = data.offers;
    // this._startTime = data.startTime;
    this._price = data.price;
    this._state.isFavorite = data.isFavorite;
  }
}

export default Point;
