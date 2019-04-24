import Component from './component.js';
import {moveEvents, stopEvents, tripTypes} from './data.js';
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
  }

  get template() {
    return `<article class="point">
      <form action="" method="get">
        <header class="point__header">
          <label class="point__date">
            choose day
            <input class="point__input" type="text" placeholder="${this._startTime.format(`MMM D`)}" name="day">
          </label>

          <div class="travel-way">
            <label class="travel-way__label" for="travel-way__toggle">${this._event.length > 0 ? tripTypes[this._event].icon : ``}</label>

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
            <label class="point__destination-label" for="destination">${this._event ? tripTypes[this._event].text : ``}</label>
            <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination.name ? this._destination.name : ``}" name="destination" required>
            <datalist id="destination-select">
              ${(Array.from(destinations).map((destination) => (`
                <option value="${destination.name}"></option>`.trim()))).join(``)}
            </datalist>
          </div>

          <div class="point__time">
            choose time
            <input class="point__input" type="text" value="" name="date-start" placeholder="19:00" required>
            <input class="point__input" type="text" value="" name="date-end" placeholder="21:00" required>
          </div>

          <label class="point__price">
            write price
            <span class="point__price-currency">€</span>
            <input class="point__input" type="text" value="${this._price}" name="price" required>
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
            <p class="point__destination-text">${this._destination.description ? this._destination.description : ``}</p>
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

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onEsc(fn) {
    this._onEsc = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  block(action) {
    const form = this._element.querySelector(`form`);
    for (const element of form.elements) {
      element.disabled = true;
    }

    if (action === `submit`) {
      form.querySelector(`.point__button--save`).innerHTML = `Saving...`;
    } else {
      form.querySelector(`.point__button[type=reset]`).innerHTML = `Deleting...`;
    }
  }

  unblock(action) {
    const form = this._element.querySelector(`form`);
    for (const element of form.elements) {
      element.disabled = false;
    }

    this._element.style = `border: 1px solid red`;

    if (action === `submit`) {
      form.querySelector(`.point__button--save`).innerHTML = `Save`;
    } else {
      form.querySelector(`.point__button[type=reset]`).innerHTML = `Delete`;
    }
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

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.classList.add(`shake`);

    setTimeout(() => {
      this._element.classList.remove(`shake`);
    }, ANIMATION_TIMEOUT);
  }

  _processForm(formData) {
    for (const offer of this._offers) {
      offer.accepted = false;
    }

    const entry = {
      day: ``,
      event: ``,
      destination: {},
      startTime: new Date(),
      endTime: new Date(),
      offers: new Set(),
      price: ``,
      isFavorite: false
    };

    const pointEditMapper = PointEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }

    delete entry.day;
    return entry;
  }

  _onWayChange(evt) {
    const newEvent = evt.target.value;
    const newIcon = tripTypes[newEvent].icon;
    const newOffersData = Array.from(offers).find((it) => it.type === evt.target.value);
    const offersContainer = this._element.querySelector(`.point__offers-wrap`);
    this._element.querySelector(`.travel-way__label`).innerHTML = newIcon;
    this._element.querySelector(`.point__destination-label`).innerHTML = tripTypes[newEvent].text;
    this._element.querySelector(`.travel-way__toggle`).checked = false;

    offersContainer.innerHTML = `${newOffersData ? (newOffersData.offers.map((offer) => (`
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.name.replace(/\s+/g, `-`).toLowerCase()}" name="offer" value="${offer.name.replace(/\s+/g, `-`).toLowerCase()}"}>
      <label for="${offer.name.replace(/\s+/g, `-`).toLowerCase()}" class="point__offers-label">
        <span class="point__offer-service">${offer.name}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>`.trim()))).join(``) : ``}`;
  }

  _onDestinationChange(evt) {
    const newDestination = Array.from(destinations).find((it) => it.name === evt.target.value);
    this._element.querySelector(`.point__destination-text`).innerText = newDestination.description;
    this._element.querySelector(`.point__destination-images`).innerHTML = `${newDestination.pictures ? newDestination.pictures.map((picture) => (`
        <img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`.trim())).join(``) : ``}`;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const form = this._element.querySelector(`form`);
    const travelWayLabel = form.querySelector(`.travel-way__label`);
    const travelWayToggle = form.querySelector(`.travel-way__toggle`);
    const requiredInputs = Array.from(this._element.querySelectorAll(`input[required]`));

    for (const input of requiredInputs) {
      if (input.validity.valueMissing) {
        input.setCustomValidity(`You have to define ${input.name}`);
      } else {
        input.setCustomValidity(``);
      }
    }

    if (travelWayLabel.innerHTML.length === 0) {
      travelWayToggle.setCustomValidity(`You have to choose trip type`);
    } else {
      travelWayToggle.setCustomValidity(``);
    }

    if (form.reportValidity() && travelWayLabel.innerHTML.length > 0) {
      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);
      if (typeof this._onSubmit === `function`) {
        this._onSubmit(newData);
      }
    }
  }

  _onEscClick(evt) {
    if (evt.keyCode === 27) {
      if (typeof this._onEsc === `function`) {
        this._onEsc();
      }
    }
  }

  _onDeleteClick(evt) {
    evt.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
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

    const dayInput = this._element.querySelector(`.point__input[name='day']`);
    const timeStart = this._element.querySelector(`.point__input[name='date-start']`);
    const timeEnd = this._element.querySelector(`.point__input[name='date-end']`);

    flatpickr(dayInput, {
      altInput: true,
      altFormat: `D j`,
      dateFormat: `Y-m-d`,
      defaultDate: moment(this._startTime).format(`YYYY-MM-DD HH:mm`)
    });

    flatpickr(timeStart, {
      'altInput': true,
      'altFormat': `H:i`,
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `Y-m-d H:i`,
      'defaultDate': moment(this._startTime).format(`YYYY-MM-DD HH:mm`)
    });

    flatpickr(timeEnd, {
      'altInput': true,
      'altFormat': `H:i`,
      'enableTime': true,
      'time_24hr': true,
      'dateFormat': `Y-m-d H:i`,
      'defaultDate': moment(this._endTime).format(`YYYY-MM-DD HH:mm`)
    });
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
                .removeEventListener(`click`, this._onSubmitButtonClick);

    const travelWaySelects = this._element.querySelectorAll(`.travel-way__select-input`);
    for (const travelWaySelect of travelWaySelects) {
      travelWaySelect.removeEventListener(`click`, this._onWayChange);
    }

    this._element.querySelector(`.point__destination-input`)
                .removeEventListener(`change`, this._onDestinationChange);

    window.removeEventListener(`keydown`, this._onEscClick);
  }

  static createMapper(target) {
    return {
      'travel-way': (value) => {
        target.event = value;
        if (Array.from(offers).find((it) => it.type === value)) {
          const newOffers = Array.from(offers).find((it) => it.type === value).offers;
          for (const offer of newOffers) {
            target.offers.add({
              title: offer.name,
              price: offer.price,
              accepted: false
            });
          }
        }
      },
      'destination': (value) => {
        target.destination = Array.from(destinations).find((dest) => (dest.name === value));
      },
      'offer': (value) => {
        for (const offer of target.offers) {
          if (value === offer.title.replace(/\s+/g, `-`).toLowerCase()) {
            offer.accepted = true;
          }
        }
      },
      'day': (value) => {
        target.day = value;
      },
      'date-start': (value) => {
        target.startTime = new Date(value);
      },
      'date-end': (value) => {
        target.endTime = new Date(value);
      },
      'price': (value) => {
        target.price = value;
      },
      'favorite': (value) => {
        target.isFavorite = value;
      }
    };
  }

  static toRaw(newData) {
    return {
      'id': newData.id,
      'type': newData.event,
      'destination': newData.destination,
      'date_from': newData.startTime,
      'date_to': newData.endTime,
      'base_price': newData.price,
      'offers': [...newData.offers.values()],
      'is_favorite': newData.isFavorite
    };
  }
}

export default PointEdit;
