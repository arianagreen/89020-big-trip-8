import Component from './component.js';
import {moveEvents, stopEvents, tripTypes} from './data.js';
import createElement from './create-element.js';
import flatpickr from "flatpickr";
import {destinations, offers} from './main.js';
import moment from 'moment';

class PointEdit extends Component {
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

    this._onSubmit = null;
    this._onEsc = null;
    this._onDelete = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEscClick = this._onEscClick.bind(this);
    this._onWayChange = this._onWayChange.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    // this._onDateChange = this._onDateChange.bind(this);
  }

  getTotalPrice() {
    this._totalPrice = this._price;
    for (const offer of this._offers) {
      if (offer.accepted) {
        this._totalPrice += offer.price;
      }
    }
    return this._totalPrice;
  }

  _processForm(formData) {
    for (const offer of this._offers) {
      offer.accepted = false;
    }

    const entry = {
      event: ``,
      destination: this._destination,
      startTime: new Date(),
      endTime: new Date(),
      offers: this._offers,
      price: ``,
      isFavorite: false
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      pointEditMapper[property] && pointEditMapper[property](value);
    }

    return entry;
  }

  // _onDateChange(evt) {
  //   const date = moment(evt.target.value);
  //   evt.target.value = date.format('HH:MM');
  // }

  _onChangeFavorite() {
    this._state.isFavorite = !this._state.isFavorite;
  }

  _onWayChange(evt) {
    this._event = evt.target.value;
    this._icon = tripTypes[evt.target.value].icon;
    const newOffersData = Array.from(offers).find((it) => it.type === evt.target.value);
    this._offers.clear();

    if (newOffersData) {
      for (const offer of newOffersData.offers) {
        this._offers.add({
          title: offer.name,
          price: offer.price,
          accepted: false
        });
      }
    }

    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onDestinationChange(evt) {
    this._destination = Array.from(destinations).find((it) => it.name === evt.target.value);
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

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

  _onDeleteClick(evt) {
    evt.preventDefault();
    typeof this._onDelete === `function` && this._onDelete({id: this._id});
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

  set onDelete(fn) {
    this._onDelete = fn;
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="${this._startTime.toLocaleString(`en`, {month: `short`, day: `numeric`})}" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${tripTypes[this._event].icon}</label>

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
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination.name}" name="destination">
            <datalist id="destination-select">
              ${(Array.from(destinations).map((destination) => (`
                <option value="${destination.name}"></option>`.trim()))).join(``)}
            </datalist>
          </div>

          <div class="point__time">
            choose time
            <input class="point__input" type="text" value="${this._startTime.format('HH:MM')}" name="date-start" placeholder="19:00">
            <input class="point__input" type="text" value="${this._endTime.format('HH:MM')}" name="date-end" placeholder="21:00">
          </div>

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
              ${this._offers ? (Array.from(this._offers).map((offer) => (`
                <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" name="offer" value="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" ${offer.accepted ? `checked` : ``}>
                <label for="${offer.title.replace(/\s+/g, `-`).toLowerCase()}" class="point__offers-label">
                  <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
                </label>`.trim()))).join(``) : ``}
            </div>

          </section>
          <section class="point__destination">
            <h3 class="point__details-title">Destination</h3>
            <p class="point__destination-text">${this._destination.description}</p>
            <div class="point__destination-images">
              ${this._destination.pictures ? this._destination.pictures.map((picture) => (`
                  <img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`.trim())).join(``) : ``}
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

    this._element.querySelector(`.point__button[type=reset]`)
                .addEventListener(`click`, this._onDeleteClick);

    const travelWaySelects = this._element.querySelectorAll(`.travel-way__select-input`);
    for (const travelWaySelect of travelWaySelects) {
      travelWaySelect.addEventListener(`click`, this._onWayChange);
    }

    this._element.querySelector(`.point__destination-input`)
                .addEventListener(`change`, this._onDestinationChange);


    window.addEventListener(`keydown`, this._onEscClick);

    const timeStart = this._element.querySelector(`.point__time .point__input[name='date-start']`);
    const timeEnd = this._element.querySelector(`.point__time .point__input[name='date-end']`);
    // timeStart.addEventListener(`change`, this._onDateChange);
    // timeEnd.addEventListener(`change`, this._onDateChange);


    flatpickr(timeStart, {
      enableTime: true,
      // noCalendar: true,
      time_24hr: true,
      // dateFormat: "H:i"
      dateFormat: "Y-m-d H:i"
    });

    flatpickr(timeEnd, {
      enableTime: true,
      // noCalendar: true,
      time_24hr: true,
      // dateFormat: "H:i"
      dateFormat: "Y-m-d H:i"
    });
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
                .removeEventListener(`click`, this._onSubmitButtonClick);

    const travelWaySelects = this._element.querySelectorAll(`.travel-way__select-input`);
    for (const travelWaySelect of travelWaySelects) {
      travelWaySelect.removeEventListener(`click`, this._onWayChange);
    }

    window.removeEventListener(`keydown`, this._onEscClick);
  }

  update(data) {
    this._event = data.event;
    this._destination = data.destination;
    this._offers = data.offers;
    this._startTime = data.startTime;
    this._endTime = data.endTime;
    this._price = data.price;
    this._state.isFavorite = data.isFavorite;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.classList.add(`shake`);

    setTimeout(() => {
      this._element.classList.remove(`shake`);
    }, ANIMATION_TIMEOUT);
  }

  static createMapper(target) {
    return {
      'travel-way': (value) => {
        target.event = value;
      },
      'destination': (value) => {
        target.destination.name = value;
      },
      'offer': (value) => {
        for (const offer of target.offers) {
          if (value === offer.title.replace(/\s+/g, `-`).toLowerCase()) {
            offer.accepted = true;
          }
        }
      },
      'date-start': (value) => {
        target.startTime = value;
      },
      'date-end': (value) => {
        target.endTime = value;
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
