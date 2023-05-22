export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

export function createElement(tagName, classNames) {
  const el = document.createElement(tagName);
  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else {
    el.classList.add(classNames);
  }
  return el;
}
