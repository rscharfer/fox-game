import { modFox, modScene, togglePoopBag } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
  writeModal
} from "./constants";

const gameState = {
  clock: 1,
  current: "INIT",
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  // the middle button was clicked
  handleUserAction(icon) {
    console.log('handle user interaction')
    if (["SLEEP", "FEEDING", "CELEBRATING", "WATCHING"].includes(this.current))
      return;
    if (this.current === "DEAD" || this.current === "INIT") {
      console.log("start");
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
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene])
    this.determineFoxState();
  },
  cleanUpPoop() {
    if(this.current !== 'POOPING') return;
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = this.getNextHungerTime(this.clock);
  },
  clearTimes(){
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToEndCelebrating = -1;
    this.timeToStartCelebrating = -1;
  },
  feed() {
    if (this.current !== "HUNGRY") return;
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
  },
  startCelebrating() {
    (this.current = "CELEBRATING"), modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    (this.current = "IDLING"), this.determineFoxState();
    this.timeToEndCelebrating = -1;
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else modFox("idling");
    }
  },
  sleep() {
    // TODO: what is the difference between all caps sleep and all lower case sleep
    console.log("sleep");
    // TODO: brian had this.state under here and that worked too
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  die() {
    console.log("die");
    this.current = "DEAD";
    modScene('dead');
    modFox('dead');
    this.clearTimes();
    writeModal(`The fox died. :( 
      Press the middle button to start.`);

  },
  tick() {
    this.clock++;
    console.log("tick incremented", this.clock);
    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating) this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.poopTime) this.poop();
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    writeModal('');
    modFox("egg");
    modScene("day");
  },
  poop(){
    this.current = 'POOPING';
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox('pooping');
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
};

export default gameState;
export const handleUserAction = gameState.handleUserAction.bind(gameState);
