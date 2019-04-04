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

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

export default ModelPoint;
