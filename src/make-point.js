// const offerTemplate = `<li><button class="trip-point__offer">${offer} ${currency}&nbsp;${price}</button></li>`;

export default (point) => {
  let offers = ``;

  point.offers.forEach((offer) => {
    offers += `<li><button class="trip-point__offer">${offer.title} ${offer.currency}&nbsp;${offer.price}</button></li>`;
  });

  return `<article class="trip-point">
    <i class="trip-icon">${point.icon}</i>
    <h3 class="trip-point__title">${point.title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${point.time.from}&nbsp;&mdash; ${point.time.to}</span>
      <span class="trip-point__duration">${point.duration}</span>
    </p>
    <p class="trip-point__price">${point.currency}&nbsp;${point.price}</p>
    <ul class="trip-point__offers">
      ${offers}
    </ul>
  </article>`;
};
