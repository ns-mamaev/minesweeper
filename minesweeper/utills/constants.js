export const gameSettings = {
  easy: {
    x: 10,
    y: 10,
    bombs: 10,
  },
  medium: {
    x: 15,
    y: 15,
    bombs: 40,
  },
  hard: {
    x: 25,
    y: 25,
    bombs: 99,
  },
};

export const aroundCellCoords = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];

export const BOMB_TAG = 'B';

export const qtySuffixes = {
  1: 's',
  2: 'm',
  3: 'l',
  4: 'xl',
  more: 'more',
}

export const themes = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const soundsState = {
  OFF: '0',
  ON: '1',
}
