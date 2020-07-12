import gameState, { handleUserAction } from "./gameState";
import { TICK_RATE } from "./constants";
import { initButtons } from "./buttons";

async function init() {
  // here we are passing in the handler for all buttons
  // what the handler does completely depends on what argument is passed to it (what button was clicked)
  initButtons(handleUserAction);
  let timeToTickNext = Date.now();
  function anotherFunction() {
    const jetzt = Date.now();
    if (jetzt > timeToTickNext) {
      gameState.tick();
      timeToTickNext = jetzt + TICK_RATE;
    }
    requestAnimationFrame(anotherFunction);
  }
  anotherFunction();
}

init();
