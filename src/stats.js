import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {moveEvents, tripTypes} from './data.js';
import moment from 'moment';

const getStats = (data) => {
  const stats = {
    moneyLabels: [],
    moneyData: [],
    transportLabels: [],
    transportData: [],
    timeLabels: [],
    timeData: []
  };

  let tripEventsAndPrices = {}; // объет типа {event: price} без повторов для всех событий
  let transport = []; // массив всех видов транспорта из поездки
  let tripTransportAndRepeats = {}; // объет типа {event: price} без повторов для всех видов транспорта
  let tripEventsAndTime = {}; // объект типа {point: time} без повторов для всех остановок

  for (const point of data) {

    const start = moment(point.startTime);
    const end = moment(point.endTime);
    const duration = end.diff(start, `hours`);

    if (tripEventsAndPrices[point.event]) {
      tripEventsAndPrices[point.event] += point.price;
    } else {
      tripEventsAndPrices[point.event] = point.price;
    }

    if (moveEvents.find((it) => it === point.event)) {
      transport.push(point.event);
    }

    if (tripEventsAndTime[point.event]) {
      tripEventsAndTime[point.event] += duration;
    } else {
      tripEventsAndTime[point.event] = duration;
    }
  }

  for (const pair of Object.entries(tripEventsAndPrices)) {
    const [event, price] = pair;
    stats.moneyLabels.push(`${tripTypes[event].icon} ${event.toUpperCase()}`);
    stats.moneyData.push(price);
  }

  for (const t of transport) {
    if (tripTransportAndRepeats[t]) {
      tripTransportAndRepeats[t] += 1;
    } else {
      tripTransportAndRepeats[t] = 1;
    }
  }

  for (const pair of Object.entries(tripTransportAndRepeats)) {
    const [t, r] = pair;
    stats.transportLabels.push(`${tripTypes[t].icon} ${t.toUpperCase()}`);
    stats.transportData.push(r);
  }

  for (const pair of Object.entries(tripEventsAndTime)) {
    const [dest, time] = pair;
    stats.timeLabels.push(`${tripTypes[dest].icon} ${dest.toUpperCase()}`);
    stats.timeData.push(time);
  }

  return stats;
};

const drawCharts = (statsObj) => {
  const moneyCtx = document.querySelector(`.statistic__money`);
  const transportCtx = document.querySelector(`.statistic__transport`);
  const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

  moneyCtx.innerHTML = ``;
  transportCtx.innerHTML = ``;

  // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
  const BAR_HEIGHT = 55;
  moneyCtx.height = BAR_HEIGHT * 6;
  transportCtx.height = BAR_HEIGHT * 4;
  timeSpendCtx.height = BAR_HEIGHT * 4;

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statsObj.moneyLabels,
      datasets: [{
        data: statsObj.moneyData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  const transportChart = new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statsObj.transportLabels,
      datasets: [{
        data: statsObj.transportData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  const timeSpendChart = new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statsObj.timeLabels,
      datasets: [{
        data: statsObj.timeData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

  return [moneyChart, transportChart, timeSpendChart];
};

export {getStats, drawCharts};
