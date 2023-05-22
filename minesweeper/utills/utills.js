export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

export function createElement(tagName, className) {
  const el = document.createElement(tagName);
  el.classList.add(className)
  return el;
}
