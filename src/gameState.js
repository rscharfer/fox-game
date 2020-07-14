import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import {
  RAIN_CHANCE,
  SCENE_STATES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  FOX_STATES,
  CSS_MAP,
} from "./constants";
import {
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./utilities";

const gameState = {
  // here is the state and the methods that manipulate it and trigger the DOM changes
  // the game has a clock and timers are continuously set to trigger certain actions

  clock: 1,
  current: FOX_STATES.INIT,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  scene : -1,
  // the caller of tick() increments the clock and if the the clock value
  // matches one of the timers, it will trigger the timers handler
  
  tick() {
    this.clock++;
    console.log('clcok', this.clock);
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating)
      this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.poopTime) this.poop();
  },
  // depending on some outside state and depending on the argument, this will do nothing or perform
  // some side effect.  Called here when the middle button is clicked.
  // possible arguments are "weather", "poop", "fish"

  handleUserAction(icon) {
    if (this.current === FOX_STATES.DEAD || this.current === FOX_STATES.INIT) {
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
    this.current = FOX_STATES.HATCHING;
    this.wakeTime = this.clock + 3;
    writeModal("");
    modFox(CSS_MAP[FOX_STATES.HATCHING]);
    this.scene = SCENE_STATES.DAY;
    modScene(SCENE_STATES.DAY);
  },

  // depending on two outside variables, the fox state and the weather state,
  // either do nothing or change the state of the fox and the weather
  changeWeather() {
    if (
      this.current === FOX_STATES.IDLING ||
      this.current === FOX_STATES.HUNGRY ||
      this.current === FOX_STATES.POOPING
    ) {
      if (this.scene === SCENE_STATES.DAY || this.scene === SCENE_STATES.RAIN)
      this.scene = this.scene === SCENE_STATES.DAY ? SCENE_STATES.RAIN : SCENE_STATES.DAY ;
      else console.error(`The scene is ${this.scene}!  cant toggle!`);
      modScene(this.scene);
      this.determineFoxState();
    }
  },
  // change state, change DOM based on fox state, and game state
  poop() {
    console.log('pooping');
    this.current = FOX_STATES.POOPING;
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox(CSS_MAP[FOX_STATES.POOPING]);
  },
  // depending on outside state, either do nothing
  // or change state, change DOM
  cleanUpPoop() {
    if (this.current !== FOX_STATES.POOPING) return;
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  // change state and change DOM (fox state)
  startCelebrating() {
    (this.current = FOX_STATES.CELEBRATING),
      modFox(CSS_MAP[FOX_STATES.CELEBRATING]);
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  // change state, change DOM
  endCelebrating() {
    (this.current = FOX_STATES.IDLING), this.determineFoxState();
    this.timeToEndCelebrating = -1;
    togglePoopBag(false);
  },
  // change state, change DOM
  getHungry() {
    this.current = FOX_STATES.HUNGRY;
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox(CSS_MAP[FOX_STATES.HUNGRY]);
  },
  // do nothing or change state, change DOM
  feed() {
    if (this.current !== FOX_STATES.HUNGRY) return;
    this.current = FOX_STATES.EATING;
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    console.log('new poopt time', this.poopTime);
    modFox(CSS_MAP[FOX_STATES.EATING]);
    this.timeToStartCelebrating = this.clock + 2;
  },
  // change DOM and change state
  sleep() {
    this.current = FOX_STATES.SLEEPING;
    modFox(CSS_MAP[FOX_STATES.SLEEPING]);
    modScene(SCENE_STATES.NIGHT);
    this.scene = SCENE_STATES.NIGHT;
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  // change DOM and change state
  wake() {
    this.current = FOX_STATES.IDLING;
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? SCENE_STATES.DAY  : SCENE_STATES.RAIN;
    modScene(this.scene);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  // change DOM and change state
  die() {
    this.current = FOX_STATES.DEAD;
    modScene(SCENE_STATES.DEAD);
    this.scene = SCENE_STATES.DEAD
    modFox(CSS_MAP[FOX_STATES.DEAD]);
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
    if (this.current == FOX_STATES.HUNGRY || this.current === FOX_STATES.POOPING) return; 
    if (this.scene === SCENE_STATES.RAIN) {
      modFox(CSS_MAP[FOX_STATES.RAIN]);
    } else modFox(CSS_MAP[FOX_STATES.IDLING]);
  },
};

export default gameState;
export const handleUserAction = gameState.handleUserAction.bind(gameState);
