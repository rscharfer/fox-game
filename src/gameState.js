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
  // full blown OOP
  // the API exposed to the outside world is tick() and handlerUserAction()
  // tick mutates the "hidden" data on the object and/or does some DOM manipulation
  clock: 1,
  current: FOX_STATES.INIT,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  scene: -1,
  // what is tick() actually doing?

  // change the value of a variable
  // is the new value equal to another value?
  // if yes, perform a callback / if no, do nothing

  // change the value
  // some sort of condition
  // if true, callback / if no, do nothing

  // can each of the "callbacks" listen for changes in the state and call themselves their timer goes off
  // can we create a new event listener / or subscriber whenever another unsubscribes?

  tick() {
    this.clock++;
    console.log("tick", this.clock);
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
    // state manipulation
    // could make this pure by passing in the state to a "reducer" which would return a new state
    // there are some things we are tracking in state which do not lead to any other additional side effects
    // what does that change in state actually do ? What kind of side effects does that change cause? Do we need to know that?

    this.current = FOX_STATES.HATCHING;
    this.wakeTime = this.clock + 3;
    this.scene = SCENE_STATES.DAY;
    // now these side effects are pretty much a function of the state. They can totally a function of the
    // we saved the modal text on that state
    writeModal("");
    modFox(CSS_MAP[this.current]);
    modScene(this.scene);

    // could we do...
    // 1. reducer which returns a new state
    // 2. callback which is a function of that new state   ??
  },

  // depending on two outside variables, the fox state and the weather state,
  // either do nothing or change the state of the fox and the weather
  changeWeather() {
    // game requirements stipulate only can change weather when pooping, hungry, idling, or turned around (raining)
    if (
      [
        FOX_STATES.IDLING,
        FOX_STATES.RAIN,
        FOX_STATES.POOPING,
        FOX_STATES.HUNGRY,
      ].includes(this.current)
    )
      // first change scene
      this.scene =
        this.scene === SCENE_STATES.DAY ? SCENE_STATES.RAIN : SCENE_STATES.DAY;
    modScene(this.scene);

    // second change fox state and trigger new animation if idling or raining
    if (this.current === FOX_STATES.IDLING)
      (this.current = FOX_STATES.RAIN), modFox(CSS_MAP[this.current]);
    else if (this.current === FOX_STATES.RAIN)
      (this.current = FOX_STATES.IDLING), modFox(CSS_MAP[this.current]);
  },
  // change state, change DOM based on fox state, and game state
  poop() {
    console.log("pooping");
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
    console.log('end celebrating');
    this.current =
      this.scene === SCENE_STATES.RAIN ? FOX_STATES.RAIN : FOX_STATES.IDLING;
    modFox(CSS_MAP[this.current])
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
    console.log("new poop time", this.poopTime);
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
    // change state

    this.wakeTime = -1;
    const isRaining = Math.random() > RAIN_CHANCE;
    this.scene = isRaining ? SCENE_STATES.RAIN : SCENE_STATES.DAY;
    this.current = isRaining ? FOX_STATES.RAIN : FOX_STATES.IDLING;

    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);

    // change DOM as function of state
    modScene(this.scene);
    modFox(CSS_MAP[this.current]);
  },
  // change DOM and change state
  die() {
    this.current = FOX_STATES.DEAD;
    modScene(SCENE_STATES.DEAD);
    this.scene = SCENE_STATES.DEAD;
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
};

export default gameState;
export const handleUserAction = gameState.handleUserAction.bind(gameState);
