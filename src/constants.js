export const TICK_RATE = 2000;
export const ICONS = ["fish", "poop", "weather"];

export const RAIN_CHANCE = 0.2;

export const SCENES = ["day", "rain"];

export const DAY_LENGTH = 60;

export const NIGHT_LENGTH = 3;

export const getNextHungerTime = (clock) => {
  const x = Math.floor(Math.random() * 3) + 5 + clock;
  return console.log("next hunger time", x), x;
};
export const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 3 + clock;

export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock;

export const writeModal = function writeModal(text = "") {
  document.querySelector(
    ".modal-inner"
  ).innerText = `${text}`;
};

// TODO:: need more constants too easy to misspell non-constants
