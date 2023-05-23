export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

export function createElement(tagName, classNames, textContent) {
  const el = document.createElement(tagName);
  if (classNames) {
    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else {
      el.classList.add(classNames);
    }
  }
  if (textContent) {
    el.textContent = textContent;
  }
  return el;
}

const normalizeTimePart = (timePart) => timePart < 10 ? '0' + timePart : timePart;

export function createTimeString(time) {
  const seconds = time % 60;
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60);

  return `${normalizeTimePart(hours)}:${normalizeTimePart(minutes)}:${normalizeTimePart(seconds)}`;
}
