import makeFilter from './make-filter.js';
import makePoint from './make-point.js';

import pointsData from './data.js';

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

const renderPoints = (dist, array) => {
  let points = ``;
  for (const point of array) {
    points += makePoint(point);
  }
  dist.insertAdjacentHTML(`beforeend`, points);
};

const onFilterClick = () => {
  let count = getRandomInt(1, 6);
  const filterPoints = pointsData.slice(0, count);
  pointsContainer.innerHTML = ``;
  renderPoints(pointsContainer, filterPoints);
};

filterContainer.innerHTML = ``;
pointsContainer.innerHTML = ``;

renderFilters(filterContainer);
renderPoints(pointsContainer, pointsData);

const filterItems = filterContainer.querySelectorAll(`.trip-filter__item`);

filterItems.forEach((item) => {
  item.addEventListener(`click`, onFilterClick);
});
