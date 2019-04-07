import API from './api.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import Filter from './filter.js';
import {getStats, drawCharts} from './stats.js';

const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const destinations = new Set();
const offers = new Set();

api.getDestinations()
  .then((data) => {
    for (const item of data) {
      destinations.add(item);
    }
  });

api.getOffers()
  .then((data) => {
    for (const item of data) {
      offers.add(item);
    }
  });

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

const filterActions = {
  'everything': (points) => {
    return points;
  },
  'future': (points) => {
    return points.filter((it) => it.startTime > Date.now());
  },
  'past': (points) => {
    return points.filter((it) => it.endTime < Date.now());
  }
};

const filterContainer = document.querySelector(`.trip-filter`);
const pointsContainer = document.querySelector(`.trip-day__items`);
const tableSwitchBtn = document.querySelector(`.view-switch__item[href='#table']`);
const statsSwitchBtn = document.querySelector(`.view-switch__item[href='#stats']`);
const tripPointsSection = document.querySelector(`.trip-points`);
const statisticsSection = document.querySelector(`.statistic`);

const filterPoints = (points, filter) => {
  return filterActions[filter](points);
};

const disableForm = (form) => {
  for (const element of form.elements) {
    element.disabled = true;
  }
};

const unableForm = (form) => {
  for (const element of form.elements) {
    element.disabled = false;
  }
};

const setTotalPrice = (points) => {
  let totalCost = 0;

  for (const item of points) {
    totalCost += parseInt(item.price, 10);
    for (const offer of item.offers) {
      if (offer.accepted) {
        totalCost += parseInt(offer.price, 10);
      }
    }
  }

  document.querySelector(`.trip__total-cost`).textContent = totalCost;
};

const renderFilters = (dist, filters) => {
  let fragment = document.createDocumentFragment();
  for (const filter of filters) {
    const filterComponent = new Filter(filter);
    fragment.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      api.getPoints()
        .then((points) => {
          const filteredPoints = filterPoints(points, filter.name);
          renderPoints(pointsContainer, filteredPoints);
        })
        .catch(onError);
    };
  }
  dist.appendChild(fragment);
};

const renderPoints = (dist, points) => {
  dist.innerHTML = ``;
  setTotalPrice(points);
  let fragment = document.createDocumentFragment();
  for (const point of points) {
    const pointComponent = new Point(point);
    const editPointComponent = new PointEdit(point);

    fragment.appendChild(pointComponent.render());

    pointComponent.onEdit = () => {
      editPointComponent.render();
      dist.replaceChild(editPointComponent.element, pointComponent.element);
      pointComponent.unrender();

      const form = editPointComponent.element.querySelector(`form`);

      editPointComponent.onSubmit = (newData) => {
        point.event = newData.event;
        point.destination = newData.destination;
        point.offers = newData.offers;
        point.startTime = newData.startTime;
        point.endTime = newData.endTime;
        point.price = newData.price;
        point.isFavorite = newData.isFavorite;

        const block = () => {
          disableForm(form);
          editPointComponent.element.querySelector(`.point__button--save`).textContent = `Saving...`;
        };

        const unblock = () => {
          unableForm(form);
          editPointComponent.element.style = `border: 1px solid red`;
          editPointComponent.element.querySelector(`.point__button--save`).textContent = `Save`;
        };

        api.updatePoint({id: point.id, data: point.toRaw()})
          .then((newPoint) => {
            block();
            pointComponent.update(newPoint);
            pointComponent.render();
            dist.replaceChild(pointComponent.element, editPointComponent.element);
            editPointComponent.update(newPoint);
            editPointComponent.unrender();

            setTotalPrice(points);
          })
          .catch(() => {
            editPointComponent.shake();
            unblock();
          });
      };

      editPointComponent.onEsc = () => {
        pointComponent.render();
        dist.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.unrender();
      };

      editPointComponent.onDelete = ({id}) => {
        const block = () => {
          disableForm(form);
          editPointComponent.element.querySelector(`.point__button[type=reset]`).textContent = `Deleting...`;
        };

        const unblock = () => {
          unableForm(form);
          editPointComponent.element.style = `border: 1px solid red`;
          editPointComponent.element.querySelector(`.point__button[type=reset]`).textContent = `Delete`;
        };

        block();
        api.deletePoint({id})
          .then(() => api.getPoints())
          .then((clearedPoints) => {
            renderPoints(dist, clearedPoints);
            setTotalPrice(clearedPoints);
          })
          .catch(() => {
            editPointComponent.shake();
            unblock();
          });
      };
    };
  }
  dist.appendChild(fragment);
};

const onStatsClick = (evt) => {
  evt.preventDefault();
  api.getPoints()
    .then((points) => {
      const stats = getStats(points);
      drawCharts(stats);
      statisticsSection.classList.remove(`visually-hidden`);
      tableSwitchBtn.classList.remove(`view-switch__item--active`);
      if (!tripPointsSection.classList.contains(`visually-hidden`)) {
        tripPointsSection.classList.add(`visually-hidden`);
      }
      if (!statsSwitchBtn.classList.contains(`view-switch__item--active`)) {
        statsSwitchBtn.classList.add(`view-switch__item--active`);
      }
    })
    .catch(onError);
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

const onError = () => {
  pointsContainer.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
};

filterContainer.innerHTML = ``;
pointsContainer.innerHTML = `Loading route...`;

renderFilters(filterContainer, filtersData);

api.getPoints()
  .then((points) => {
    renderPoints(pointsContainer, points);
  })
  .catch(onError);

statsSwitchBtn.addEventListener(`click`, onStatsClick);
tableSwitchBtn.addEventListener(`click`, onTableCLick);

export {destinations, offers};
