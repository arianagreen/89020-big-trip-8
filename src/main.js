import Point from './point.js';
import PointEdit from './point-edit.js';
import Filter from './filter.js';

import initialPoints from './data.js';

const filtersData = [
  {
    name: `everything`,
    isChecked: true
  },
  {
    name: `future`,
    isChecked: false
  },
  {
    name: `past`,
    isChecked: false
  }
];

// const filterNames = [`everything`, `future`, `past`];

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);

const filterPoints = (points, filter) => {
  switch (filter) {
    case `everything`:
      return points;
    case `future`:
      return points.filter((it) => it.startTime > Date.now());
    case `past`:
      return points.filter((it) => it.endTime < Date.now());
  }
};

const renderFilters = (dist, array) => {
  let fragment = document.createDocumentFragment();
  for (const filter of array) {
    const filterComponent = new Filter(filter);
    fragment.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      const filteredPoints = filterPoints(initialPoints, filter.name);
      pointsContainer.innerHTML = ``;
      renderPoints(pointsContainer, filteredPoints);
    };
  }
  dist.appendChild(fragment);
};

const renderPoints = (dist, array) => {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < array.length; i++) {
    const point = array[i];
    if (!point.isDeleted) {
      const pointComponent = new Point(point);
      const editPointComponent = new PointEdit(point);

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

      editPointComponent.onDelete = () => {
        dist.removeChild(editPointComponent.element);
        editPointComponent.unrender();
        array[i].isDeleted = true;
      };
    }

  }
  dist.appendChild(fragment);
};

// const onFilterClick = () => {
//   let count = getRandomInt(1, 6);
//   const filterPoints = initialPoints.slice(0, count);
//   pointsContainer.innerHTML = ``;
//   renderPoints(pointsContainer, filterPoints);
// };

filterContainer.innerHTML = ``;
pointsContainer.innerHTML = ``;

renderFilters(filterContainer, filtersData);
renderPoints(pointsContainer, initialPoints);

// const filterItems = filterContainer.querySelectorAll(`.trip-filter__item`);

// filterItems.forEach((item) => {
//   item.addEventListener(`click`, onFilterClick);
// });
