import game from './gameState';
// we want something to happen every three seconds

// a function will run continuously checking to see if three seconds have passed, and if so, 
// another function will run, which will not be ran again until three seconds have passed again.


const TICK_RATE = 2000;

// we want this to occur every three seconds



// this function will be immediately called
async function init(){

  let timeToTickNext = Date.now();
  function anotherFunction(){
    const jetzt = Date.now();
    if (jetzt > timeToTickNext) {
      game.tick();
      timeToTickNext = jetzt + TICK_RATE;
      
    }
    requestAnimationFrame(anotherFunction)
  }
  anotherFunction()
}




init()
