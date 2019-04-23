class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.event = data[`type`];
    this.destination = data[`destination`];
    this.startTime = new Date(data[`date_from`]);
    this.endTime = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = new Set(data[`offers`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.event,
      'destination': this.destination,
      'date_from': this.startTime,
      'date_to': this.endTime,
      'base_price': this.price,
      'offers': [...this.offers.values()],
      'is_favorite': this.isFavorite
    };
  }

  update(newData) {
    this.event = newData.event;
    this.destination = newData.destination;
    this.offers = newData.offers;
    this.startTime = new Date(newData.startTime);
    this.endTime = new Date(newData.endTime);
    this.price = newData.price;
    this.isFavorite = newData.isFavorite;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
