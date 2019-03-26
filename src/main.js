import makeFilter from './make-filter.js';
// import makePoint from './make-point.js';

import Point from './point.js';
import PointEdit from './point-edit.js';

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
  let fragment = document.createDocumentFragment();
  for (const item of array) {
    const pointComponent = new Point(item);
    const editPointComponent = new PointEdit(item);

    fragment.appendChild(pointComponent.render());

    pointComponent.onEdit = () => {
      editPointComponent.render();
      dist.replaceChild(editPointComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    editPointComponent.onSubmit = (newData) => {
      pointComponent.update(newData);
      pointComponent.render();
      dist.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unrender();
    };

    editPointComponent.onEsc = () => {
      pointComponent.render();
      dist.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unrender();
    };
  }
  dist.appendChild(fragment);
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
