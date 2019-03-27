const utils = {
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getEndTime(start) {
    return new Date(Date.parse(start) + Math.random() * 2 * 60 * 60 * 1000);
  }
};

export default utils;
