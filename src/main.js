import Point from './point.js';
import PointEdit from './point-edit.js';
import Filter from './filter.js';
import {getStats, drawCharts} from './stats.js';

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
const tableSwitchBtn = document.querySelector(`.view-switch__item[href='#table']`);
const statsSwitchBtn = document.querySelector(`.view-switch__item[href='#stats']`);
const tripPointsSection = document.querySelector(`.trip-points`);
const statisticsSection = document.querySelector(`.statistic`);


const updatePoint = (points, i, newPoint) => {
  points[i] = Object.assign({}, points[i], newPoint);
  return points[i];
};

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
        const updatedPoint = updatePoint(array, i, newData);
        pointComponent.update(updatedPoint);
        pointComponent.render();
        dist.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.update(updatedPoint);
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

const onStatsClick = (evt) => {
  evt.preventDefault();
  const stats = getStats(initialPoints);
  drawCharts(stats);
  statisticsSection.classList.remove(`visually-hidden`);
  tableSwitchBtn.classList.remove(`view-switch__item--active`);
  if (!tripPointsSection.classList.contains(`visually-hidden`)) {
    tripPointsSection.classList.add(`visually-hidden`);
  }
  if (!statsSwitchBtn.classList.contains(`view-switch__item--active`)) {
    statsSwitchBtn.classList.add(`view-switch__item--active`);
  }
};

const onTableCLick = (evt) => {
  evt.preventDefault();
  tripPointsSection.classList.remove(`visually-hidden`);
  statsSwitchBtn.classList.remove(`view-switch__item--active`);
  if (!statisticsSection.classList.contains(`visually-hidden`)) {
    statisticsSection.classList.add(`visually-hidden`);
  }
  if (!tableSwitchBtn.classList.contains(`view-switch__item--active`)) {
    tableSwitchBtn.classList.add(`view-switch__item--active`);
  }
};

filterContainer.innerHTML = ``;
pointsContainer.innerHTML = ``;

renderFilters(filterContainer, filtersData);
renderPoints(pointsContainer, initialPoints);

statsSwitchBtn.addEventListener(`click`, onStatsClick);
tableSwitchBtn.addEventListener(`click`, onTableCLick);
