const createElement = (template) => {
  const newElement = document.createElement(`p`);
  newElement.innerHTML = template;
  newElement.style.cssText = `margin : 0; padding: 0; display: inline`;
  return newElement.childNodes.length > 1 ? newElement : newElement.firstChild;
  // return newElement.firstChild;
};

export default createElement;
