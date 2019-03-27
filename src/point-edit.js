import Component from './component.js';
import {destinations, moveEvents, stopEvents, tripTypes} from './data.js';
import createElement from './create-element.js';
import flatpickr from "flatpickr";
import utils from './utils.js';

class PointEdit extends Component {
  constructor(data) {
    super();
    this._event = data.event;
    this._icon = tripTypes[data.event].icon;
    this._destination = data.destination;
    this._picture = data.picture;
    this._offers = data.offers;
    this._description = data.description;
    this._startTime = data.startTime;
    this._price = data.price;
    this._state.isFavorite = false;

    this._onSubmit = null;
    this._onEsc = null;

    this._endTime = utils.getEndTime(data.startTime);
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
    this._onChangeWay = this._onChangeWay.bind(this);
    // this._onChangeOffer = this._onChangeOffer.bind(this);
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

  _processForm(formData) {
    for (const offer of this._offers) {
      offer.isChecked = false;
    }

    const entry = {
      event: ``,
      destination: ``,
      startTime: new Date(),
      offers: this._offers,
      price: ``,
      isFavorite: false
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      pointEditMapper[property] && pointEditMapper[property](value);
    }

    entry.icon = tripTypes[entry.event].icon;
    // entry.endTime = utils.getEndTime(new Date(entry.startTime));
    return entry;
  }

  _onChangeDate() {}

  _onChangeFavorite() {
    this._state.isFavorite = !this._state.isFavorite;
  }

  _onChangeWay(evt) {
    this._event = evt.target.value;
    this._icon = tripTypes[evt.target.value].icon;

    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  // _onChangeOffer(evt) {
  //   const priceInput = this._element.querySelector(`.point__input[name=price]`);
  //   const price = parseInt(priceInput.value, 10);
  //   const offerPrice = parseInt(
  //       evt.target.nextElementSibling.querySelector(`.point__offer-price`).innerHTML,
  //       10);
  //   priceInput.value = evt.target.checked ? price + offerPrice : price - offerPrice;
  // }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);
    typeof this._onSubmit === `function` && this._onSubmit(newData);

    this.update(newData);
  }

  _onEscClick(evt) {
    if (evt.keyCode === 27) {
      typeof this._onEsc === `function` && this._onEsc();
    }
  }

  _partialUpdate() {
    this._element.innerHTML = createElement(this.template).innerHTML;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  get template() {
    const timeOptions = {
      hour: `numeric`,
      minute: `numeric`,
      hour12: false
    };

    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="${this._startTime.toLocaleString(`en`, {month: `short`, day: `numeric`})}" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>

            <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

            <div class="travel-way__select">
              <div class="travel-way__select-group">
                ${moveEvents.map((event) => (`
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${event}" name="travel-way" value="${event}" ${this._event === event ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-${event}">${tripTypes[event].icon} ${event}</label>`.trim())).join(``)}
              </div>

              <div class="travel-way__select-group">
              ${stopEvents.map((event) => (`
                <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${event}" name="travel-way" value="${event}" ${this._event === event ? `checked` : ``}>
                <label class="travel-way__select-label" for="travel-way-${event}">${tripTypes[event].icon} ${event}</label>`.trim())).join(``)}
              </div>
            </div>
          </div>

          <div class="point__destination-wrap">
            <label class="point__destination-label" for="destination">${tripTypes[this._event].text}</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="Chamonix" name="destination">
            <datalist id="destination-select">
              ${(destinations.map((destination) => (`
                <option value="${destination}"></option>`.trim()))).join(``)}
            </datalist>
          </div>

          <label class="point__time">
            choose time
            <input class="point__input" type="text" value="${this._startTime.toLocaleString(`en`, timeOptions)} — ${this._endTime.toLocaleString(`en`, timeOptions)}" name="time" placeholder="00:00 — 00:00">
          </label>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price">
          </label>

          <div class="point__buttons">
            <button class="point__button point__button--save" type="submit">Save</button>
            <button class="point__button" type="reset">Delete</button>
          </div>

          <div class="paint__favorite-wrap">
            <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._state.isFavorite ? `checked` : ``}>
            <label class="point__favorite" for="favorite">favorite</label>
          </div>
        </header>

        <section class="point__details">
          <section class="point__offers">
            <h3 class="point__details-title">offers</h3>

            <div class="point__offers-wrap">
              ${(Array.from(this._offers).map((offer) => (`
                <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" name="offer" value="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" ${offer.isChecked ? `checked` : ``}>
                <label for="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" class="point__offers-label">
                  <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
                </label>`.trim()))).join(``)}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._description}</p>
            <div class="point__destination-images">
              <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            </div>
          </section>
          <input type="hidden" class="point__total-price" name="total-price" value="">
        </section>
      </form>
    </article>`;
  }

  bind() {
    this._element.querySelector(`.point__button--save`)
                .addEventListener(`click`, this._onSubmitButtonClick);

    const travelWaySelects = this._element.querySelectorAll(`.travel-way__select-input`);
    for (const travelWaySelect of travelWaySelects) {
      travelWaySelect.addEventListener(`click`, this._onChangeWay);
    }

    window.addEventListener(`keydown`, this._onEscClick);

    const timeInput = this._element.querySelector(`.point__time .point__input`);

    flatpickr(timeInput, {
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
      dateFormat: "H:i"
    });

    // const offerSelects = this._element.querySelectorAll(`.point__offers-input`);
    // for (const offerSelect of offerSelects) {
    //   offerSelect.addEventListener(`change`, this._onChangeOffer);
    // }
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
                .removeEventListener(`click`, this._onSubmitButtonClick);

    const travelWaySelects = this._element.querySelectorAll(`.travel-way__select-input`);
    for (const travelWaySelect of travelWaySelects) {
      travelWaySelect.removeEventListener(`click`, this._onChangeWay);
    }

    window.removeEventListener(`keydown`, this._onEscClick);

    // const offerSelects = this._element.querySelectorAll(`.point__offers-input`);
    // for (const offerSelect of offerSelects) {
    //   offerSelect.removeEventListener(`change`, this._onChangeOffer);
    // }
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

  static createMapper(target) {
    return {
      'travel-way': (value) => {
        target.event = value;
      },
      'destination': (value) => {
        target.destination = value;
      },
      // 'time': (value) =>
      'offer': (value) => {
        for (const offer of target.offers) {
          if (value === offer.title.replace(/\s+/g, `-`).toLowerCase()) {
            offer.isChecked = true;
          }
        }
      },
      'time': (value) => {
        target.startTime = value;
      },
      'price': (value) => {
        target.price = value;
      },
      'favorite': (value) => {
        target.isFavorite = value;
      }
    };
  }
}

export default PointEdit;
