export const gameSettings = {
  easy: {
    x: 2,
    y: 2,
    bombs: 1,
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
