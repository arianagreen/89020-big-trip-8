const capitalize = (str) => (str.charAt(0).toUpperCase() + str.slice(1));

export default (filterName, state = ``) => {
  return `<input type="radio" id="filter-${filterName}" name="filter" value="${filterName}" ${state}>
  <label class="trip-filter__item" for="filter-${filterName}">${capitalize(filterName)}</label>`;
};
