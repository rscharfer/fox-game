export const getNextHungerTime = (clock) =>
  Math.floor(Math.random() * 3) + 5 + clock;

export const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 6 + clock;

export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;