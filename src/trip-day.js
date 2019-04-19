import Component from './component.js';
import utils from './utils.js';
import moment from 'moment';

class TripDay extends Component {
  constructor(data) {
    super();
    this._day = moment(data);
  }

  get template() {
    return `<section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">${this._day.format(`D`)}</p>
        <h2 class="trip-day__title">${this._day.format(`MMM YY`)}</h2>
      </article>
      <div class="trip-day__items"></div>
    </section>`;
  }
}

export default TripDay;
