const msPerDay = 24 * 60 * 60 * 1000;
const utils = {
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getEndTime(start) {
    return new Date(Date.parse(start) + Math.random() * 2 * 60 * 60 * 1000);
  },

  getRandomInt(min, max) { // Возвращает случайное целое число между min (включительно) и max (не включая max)
    return Math.floor(Math.random() * (max - min)) + min;
  },

  getStartTime() {
    return new Date(Date.now() + 7 * msPerDay + Math.floor(Math.random() * 7) * msPerDay);
  }
};

export default utils;
