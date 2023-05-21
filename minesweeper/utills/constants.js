export const gameSettings = {
  easy: {
    x: 3,
    y: 3,
    bombs: 3,
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
