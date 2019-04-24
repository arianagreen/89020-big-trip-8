import API from './api.js';
import Point from './point.js';
import PointEdit from './point-edit.js';
import NewPoint from './new-point.js';
import Filter from './filter.js';
import Sort from './sort.js';
import TripDay from './trip-day.js';
import TripCost from './trip-cost.js';
import {getStats, drawCharts} from './stats.js';
import moment from 'moment';

const AUTHORIZATION = `Basic eo0w590ik29889e=`; // ${Math.random()}
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const app = {
  view: `table`, // table, stats
  filter: `everything`, // everything, future, past
  sorting: `event` // event, time, price
};

const destinations = new Set();
const offers = new Set();

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

const sortingData = [
  {
    name: `event`,
    isChecked: true
  },
  {
    name: `time`,
    isChecked: false
  },
  {
    name: `price`,
    isChecked: false
  }
];

const sortingActions = {
  'event': (points) => {
    return points.sort((a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf());
  },
  'time': (points) => {
    return points.sort((a, b) => {
      const startA = moment(a.startTime);
      const endA = moment(a.endTime);
      const startB = moment(b.startTime);
      const endB = moment(b.endTime);
      return endB.diff(startB) - endA.diff(startA);
    });
  },
  'price': (points) => {
    return points.sort((a, b) => b.price - a.price);
  }
};

const filterContainer = document.querySelector(`.trip-filter`);
const sortingContainer = document.querySelector(`.trip-sorting`);
const tableSwitchBtn = document.querySelector(`.view-switch__item[href='#table']`);
const statsSwitchBtn = document.querySelector(`.view-switch__item[href='#stats']`);
const tripPointsContainer = document.querySelector(`.trip-points`);
const statisticsSection = document.querySelector(`.statistic`);
const newPointsButton = document.querySelector(`.trip-controls__new-event`);
const totalContainer = document.querySelector(`.trip`);

const filterPoints = (points, filter) => {
  return filterActions[filter](points);
};

const sortPoints = (points, sort) => {
  return sortingActions[sort](points);
};

const actualize = (points) => {
  return sortPoints(filterPoints(points, app.filter), app.sorting);
};

const renderFilters = (dist, filters) => {
  const fragment = document.createDocumentFragment();
  for (const filter of filters) {
    const filterComponent = new Filter(filter);
    fragment.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      app.filter = filter.name;
      api.getPoints()
        .then((points) => {
          const actualPoints = actualize(points);
          if (app.view === `stats`) {
            const stats = getStats(actualPoints);
            drawCharts(stats);
          } else {
            renderPoints(actualPoints);
          }
        })
        .catch(onError);
    };
  }
  dist.appendChild(fragment);
};

const renderSorting = (dist, sortings) => {
  dist.innerHTML = ``;
  const fragment = document.createDocumentFragment();
  for (const sort of sortings) {
    const sortingComponent = new Sort(sort);
    fragment.appendChild(sortingComponent.render());

    sortingComponent.onSort = () => {
      app.sorting = sort.name;
      api.getPoints()
        .then((points) => {
          renderPoints(actualize(points));
        })
        .catch(onError);
    };
  }
  dist.appendChild(fragment);
};

const renderDay = (day) => {
  const dayComponent = new TripDay(day);
  dayComponent.render();
  return dayComponent.element;
};

const renderPoint = (dist, point) => {
  const pointComponent = new Point(point);
  const editPointComponent = new PointEdit(point);

  pointComponent.render();
  dist.appendChild(pointComponent.element);

  pointComponent.onEdit = () => {
    editPointComponent.render();
    dist.replaceChild(editPointComponent.element, pointComponent.element);
    pointComponent.unrender();

    editPointComponent.onSubmit = (newData) => {
      point.update(newData);
      editPointComponent.block(`submit`);

      api.updatePoint({id: point.id, data: point.toRaw()})
        .then((newPoint) => {
          editPointComponent.unblock(`submit`);
          pointComponent.update(newPoint);
          pointComponent.render();
          dist.replaceChild(pointComponent.element, editPointComponent.element);
          editPointComponent.update(newPoint);
          editPointComponent.unrender();
          api.getPoints()
            .then((points) => {
              renderTotal(points);
            })
            .catch(onError);
        })
        .catch(() => {
          editPointComponent.shake();
          editPointComponent.unblock(`submit`);
        });
    };

    editPointComponent.onEsc = () => {
      pointComponent.render();
      dist.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unrender();
    };

    editPointComponent.onDelete = ({id}) => {
      editPointComponent.block(`delete`);

      api.deletePoint({id})
        .then(() => api.getPoints())
        .then((clearedPoints) => {
          renderPoints(actualize(clearedPoints));
        })
        .catch(() => {
          editPointComponent.shake();
          editPointComponent.unblock(`delete`);
        });
    };
  };
};

const renderPoints = (points) => {
  renderTotal(points);
  const fragment = document.createDocumentFragment();

  for (const point of points) {
    const i = points.indexOf(point);
    const day = moment(point.startTime).startOf(`day`);

    if (i === 0 || day.valueOf() !== moment(points[i - 1].startTime).startOf(`day`).valueOf()) {
      const dayElement = renderDay(day);
      const newPointContainer = dayElement.querySelector(`.trip-day__items`);
      renderPoint(newPointContainer, point);
      fragment.appendChild(dayElement);
    } else {
      const existingPointContainer = fragment.lastChild.querySelector(`.trip-day__items`);
      renderPoint(existingPointContainer, point);
    }
  }
  tripPointsContainer.innerHTML = ``;
  tripPointsContainer.appendChild(fragment);
};

const onStatsClick = (evt) => {
  evt.preventDefault();
  app.view = `stats`;
  api.getPoints()
    .then((points) => {
      const filteredPoints = filterPoints(points, app.filter);
      const stats = getStats(filteredPoints);
      drawCharts(stats);
      statisticsSection.classList.remove(`visually-hidden`);
      tableSwitchBtn.classList.remove(`view-switch__item--active`);
      if (!tripPointsContainer.classList.contains(`visually-hidden`)) {
        tripPointsContainer.classList.add(`visually-hidden`);
      }
      if (!statsSwitchBtn.classList.contains(`view-switch__item--active`)) {
        statsSwitchBtn.classList.add(`view-switch__item--active`);
      }
    })
    .catch(onError);
};

const onTableCLick = (evt) => {
  evt.preventDefault();
  app.view = `table`;
  api.getPoints()
    .then((points) => {
      const filteredPoints = filterPoints(points, app.filter);
      renderPoints(filteredPoints);
      tripPointsContainer.classList.remove(`visually-hidden`);
      statsSwitchBtn.classList.remove(`view-switch__item--active`);
      if (!statisticsSection.classList.contains(`visually-hidden`)) {
        statisticsSection.classList.add(`visually-hidden`);
      }
      if (!tableSwitchBtn.classList.contains(`view-switch__item--active`)) {
        tableSwitchBtn.classList.add(`view-switch__item--active`);
      }
    })
    .catch(onError);
};

const onError = () => {
  tripPointsContainer.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
};

const renderNewPoint = () => {
  const newPointComponent = new NewPoint();
  newPointComponent.render();
  tripPointsContainer.insertAdjacentElement(`afterbegin`, newPointComponent.element);

  newPointComponent.onSubmit = (newData) => {
    newPointComponent.block();

    api.createPoint(NewPoint.toRaw(newData))
      .then(() => {
        newPointComponent.unblock();
        newPointComponent.unrender();
        api.getPoints()
          .then((points) => {
            renderPoints(actualize(points));
            newPointsButton.addEventListener(`click`, onNewPointClick);
          })
          .catch(onError);
      })
      .catch(() => {
        newPointComponent.shake();
        newPointComponent.unblock();
      });
  };

  newPointComponent.onEsc = () => {
    tripPointsContainer.removeChild(newPointComponent.element);
    newPointComponent.unrender();
    newPointsButton.addEventListener(`click`, onNewPointClick);
  };

  newPointComponent.onDelete = () => {
    tripPointsContainer.removeChild(newPointComponent.element);
    newPointComponent.unrender();
    newPointsButton.addEventListener(`click`, onNewPointClick);
  };
};

const renderTotal = (points) => {
  totalContainer.removeChild(totalContainer.querySelector(`.trip__total`));
  const costComponent = new TripCost();
  costComponent.count(points);
  totalContainer.appendChild(costComponent.render());
};

const onNewPointClick = () => {
  renderNewPoint();
  newPointsButton.removeEventListener(`click`, onNewPointClick);
};

newPointsButton.addEventListener(`click`, onNewPointClick);
statsSwitchBtn.addEventListener(`click`, onStatsClick);
tableSwitchBtn.addEventListener(`click`, onTableCLick);

filterContainer.innerHTML = ``;
tripPointsContainer.innerHTML = `Loading route...`;

renderFilters(filterContainer, filtersData);
renderSorting(sortingContainer, sortingData);

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

api.getPoints()
  .then((points) => {
    renderPoints(actualize(points));
  })
  .catch(onError);

export {destinations, offers};
