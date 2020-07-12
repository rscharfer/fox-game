import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  // here is the state and the side effects that use this state are 
  // abstracted away into functions that are called when methods here are called
  // methods have access to the state and can be passed to the the functions responsible for the side effects
  
  clock: 1,
  current: "INIT",
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  // the caller of click increments the clock and if the the clock value
  // matches one of another variable values it will perform some side effect
  tick() {
    this.clock++;
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating)
      this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.poopTime) this.poop();
    return this.clock;
  },
  // depending on some outside state and depending on the argument, this will do nothing or perform
  // some side effect.  Called here when the middle button is clicked.
  // icons are "weather", "poop", "fish"
  /* the states of the fox are [
  "INIT",
  "HATCHING",
  "IDLING",
  "SLEEPING",
  "EATING",
  "POOPING",
  "HUNGRY",
  "CELEBRATING",
  "DEAD"
]*/
  handleUserAction(icon) {
    if (this.current === "DEAD" || this.current === "INIT") {
      this.startGame();
      return;
    }
    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },

  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    writeModal("");
    modFox("egg");
    modScene("day");
  },

  // depending on two outside variables, the fox state and the weather state,
  // either do nothing or change the state of the fox and the weather
  changeWeather() {
    if (
      this.current === "IDLING" ||
      this.current === "HUNGRY" ||
      this.current === "POOPING"
    ) {
      this.scene = (this.scene + 1) % SCENES.length;
      modScene(SCENES[this.scene]);
      this.determineFoxState();
    }
  },
  // change state, change DOM based on fox state, and game state
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
  // depending on outside state, either do nothing
  // or change state, change DOM
  cleanUpPoop() {
    if (this.current !== "POOPING") return;
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  // change state and change DOM (fox state)
  startCelebrating() {
    (this.current = "CELEBRATING"), modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  // change state, change DOM
  endCelebrating() {
    (this.current = "IDLING"), this.determineFoxState();
    this.timeToEndCelebrating = -1;
    togglePoopBag(false);
  },
  // change state, change DOM
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  // do nothing or change state, change DOM
  feed() {
    if (this.current !== "HUNGRY") return;
    this.current = "EATING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
  },
  // change DOM and change state
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  // change DOM and change state
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  // change DOM and change state 
  die() {
    this.current = "DEAD";
    modScene("dead");
    modFox("dead");
    this.clearTimes();
    writeModal(`The fox died. :( 
      Press the middle button to start.`);
  },
  // change state
  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToEndCelebrating = -1;
    this.timeToStartCelebrating = -1;
  },
  // change DOM based on a variable
  determineFoxState() {
    if (SCENES[this.scene] === "rain") {
      modFox("rain");
    } else modFox("idling");
  }
 
};

export default gameState;
export const handleUserAction = gameState.handleUserAction.bind(gameState);
