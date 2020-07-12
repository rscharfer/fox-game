export const TICK_RATE = 2000;
export const ICONS = ["fish", "poop", "weather"];

export const RAIN_CHANCE = 0.2;

export const SCENES = ["day", "rain"];

export const DAY_LENGTH = 50;

export const NIGHT_LENGTH = 5;

export const FOX_STATES = {
  INIT: "INIT",
  HATCHING: "HATCHING",
  IDLING: "IDLING",
  SLEEPING: "SLEEPING",
  EATING: "EATING",
  POOPING: "POOPING",
  HUNGRY: "HUNGRY",
  CELEBRATING: "CELEBRATING",
  DEAD: "DEAD",
  RAIN: "RAIN",
};

export const CSS_MAP = {
  [FOX_STATES.HATCHING]: "egg",
  [FOX_STATES.IDLING]: "idling",
  [FOX_STATES.SLEEPING]: "sleep",
  [FOX_STATES.EATING]: "eating",
  [FOX_STATES.POOPING]: "pooping",
  [FOX_STATES.HUNGRY]: "hungry",
  [FOX_STATES.CELEBRATING]: "celebrate",
  [FOX_STATES.DEAD]: "dead",
  [FOX_STATES.RAIN]: "rain",
};