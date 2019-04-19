import Component from './component.js';

class TripCost extends Component {
  constructor() {
    super();
    this._total = 0;
  }

  count(points) {
    for (const item of points) {
      this._total += parseInt(item.price, 10);
      for (const offer of item.offers) {
        if (offer.accepted) {
          this._total += parseInt(offer.price, 10);
        }
      }
    }
  }

  get template() {
    return `<p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._total}</span></p>`;
  }
}

export default TripCost;
