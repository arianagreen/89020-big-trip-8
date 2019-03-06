import makeFilter from './make-filter.js';
import makePoint from './make-point.js';

const pointData = {
  icon: `🚕`,
  title: `Taxi to Airport`,
  time: {
    from: `10`,
    to: `11`
  },
  duration: `1h 30m`,
  currency: `&euro;`,
  price: `20`,
  offers: [
    {
      title: `Order UBER`,
      currency: `&euro;`,
      price: `20`,
    },
    {
      title: `Upgrade to business`,
      currency: `&euro;`,
      price: `20`,
    }
  ]
};

const filterNames = [`everything`, `future`, `past`];

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min; // Возвращает случайное целое число между min (включительно) и max (не включая max)

const renderFilters = (dist) => {
  let filters = ``;

  filterNames.forEach((filterName) => {
    filters += makeFilter(filterName);
  });

  dist.insertAdjacentHTML(`beforeend`, filters);
};

const renderPoints = (dist, count) => {
  let points = ``;
  for (let i = 0; i < count; i++) {
    points += makePoint(pointData);
  }
  dist.insertAdjacentHTML(`beforeend`, points);
};

const onFilterClick = () => {
  let count = getRandomInt(1, 7);
  pointsContainer.innerHTML = ``;
  renderPoints(pointsContainer, count);
};

filterContainer.innerHTML = ``;
pointsContainer.innerHTML = ``;

renderFilters(filterContainer);
renderPoints(pointsContainer, 4);

const filterItems = filterContainer.querySelectorAll(`.trip-filter__item`);

filterItems.forEach((item) => {
  item.addEventListener(`click`, onFilterClick);
});
