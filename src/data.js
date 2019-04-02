import utils from './utils.js';
const msPerDay = 24 * 60 * 60 * 1000;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min; // Возвращает случайное целое число между min (включительно) и max (не включая max)

const tripTypes = {
  'taxi': {
    icon: `🚕`,
    text: `Taxi ride to`
  },
  'bus': {
    icon: `🚌`,
    text: `Bus to`
  },
  'train': {
    icon: `🚂`,
    text: `Train to`
  },
  'ship': {
    icon: `🛳`,
    text: `Ship to`
  },
  'transport': {
    icon: `🚊`,
    text: `Transport to`
  },
  'drive': {
    icon: `🚗`,
    text: `Drive to`
  },
  'flight': {
    icon: `✈️`,
    text: `Flight to`
  },
  'check-in': {
    icon: `🏨`,
    text: `Check into`
  },
  'sightseeing': {
    icon: `🏛`,
    text: `Sightseeing of`
  },
  'restaurant': {
    icon: `🍴`,
    text: `Restaurant in`
  }
};

const moveEvents = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const stopEvents = [`check-in`, `sightseeing`, `restaurant`];
const destinations = [`airport`, `Amsterdam`, `Geneva`, `Chamonix`, `hotel`];

const offers = [
  {
    title: `Add luggage`,
    price: getRandomInt(5, 10),
    isChecked: true
  },
  {
    title: `Switch to comfort class`,
    price: getRandomInt(10, 30),
    isChecked: true
  },
  {
    title: `Add meal`,
    price: getRandomInt(10, 50),
    isChecked: false
  },
  {
    title: `Choose seats`,
    price: getRandomInt(5, 10),
    isChecked: false
  }
];

const events = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export default new Array(5)
.fill()
.map(() => {
  const time = utils.getStartTime();
  const eventName = events[Math.floor(Math.random() * 10)];
  return {
    event: eventName,
    icon: tripTypes[eventName].icon,
    destination: destinations[Math.floor(Math.random() * 5)],
    picture: `http://picsum.photos/300/150?r=${Math.random()}`,
    offers: new Set(offers.sort(() => {
      return Math.random() - 0.5;
    })
    .slice(0, Math.floor(Math.random() * 4)).map((item) => Object.assign({}, item))),
    description: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      `Cras aliquet varius magna, non porta ligula feugiat eget.`,
      `Fusce tristique felis at fermentum pharetra.`,
      `Aliquam id orci ut lectus varius viverra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`,
      `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`,
      `In rutrum ac purus sit amet tempus.`
    ].sort(() => {
      return Math.random() - 0.5;
    })
    .slice(0, Math.floor(Math.random() * 3)),
    startTime: time,
    endTime: utils.getEndTime(time),
    price: Math.floor(Math.random() * (201 - 20)) + 20,
  };
});

export {destinations, moveEvents, stopEvents, tripTypes};
