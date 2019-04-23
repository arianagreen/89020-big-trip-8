const getDuration = (start, end) => {
  const diff = end - start;
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
};

export default (point) => {
  let offers = ``;

  if (point.offers.size > 0) {
    point.offers.forEach((offer) => {
      offers += `<li><button class="trip-point__offer">${offer.title} &plus;&euro;${offer.price}</button></li>`;
    });
  }

  const timeOptions = {
    hour: `numeric`,
    minute: `numeric`,
    hour12: false
  };

  const endTime = point.end;
  const duration = getDuration(point.startTime, endTime);

  return `<article class="trip-point">
    <i class="trip-icon">${point.event.icon}</i>
    <h3 class="trip-point__title">${point.event.type} to ${point.destination}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${point.startTime.toLocaleString(`en`, timeOptions)}&nbsp;&mdash; ${endTime.toLocaleString(`en`, timeOptions)}</span>
      <span class="trip-point__duration">${duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
    <ul class="trip-point__offers">
      ${offers}
    </ul>
  </article>`;
};
