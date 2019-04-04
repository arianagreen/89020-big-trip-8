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
  },

  getDiff(start, end) {
    const diff = end - start;
    const diffMin = Math.round(diff / (60 * 1000));
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin - (hours * 60);

    let finalDiff = ``;

    if (hours > 0) {
      finalDiff += `${hours}H&nbsp;`;
    }

    if (minutes > 0) {
      finalDiff += `${minutes}M`;
    }

    return finalDiff;
  }
};

export default utils;
