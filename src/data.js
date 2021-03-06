const moveEvents = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const stopEvents = [`check-in`, `sightseeing`, `restaurant`];

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

const mockData = {
  id: String(Date.now()),
  event: ``,
  destination: {},
  offers: new Set(),
  startTime: Date.now(),
  endTime: Date.now(),
  price: ``,
  isFavorite: false,
};

export {moveEvents, stopEvents, tripTypes, mockData};
