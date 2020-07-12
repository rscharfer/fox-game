 // possible arguments for modFox are 
 // ['pooping', 'celebrate', 'rain', 'hungry', 'eating', 'egg', 'sleep', 'dead', 'idling']
export const modFox = function modFox(state){
  document.querySelector('.fox').className = `fox fox-${state}`;
}

// possible arguments are ['day', 'night', 'rain', 'dead']
export const modScene = function modScene(state){
  document.querySelector('.game').className = `game ${state}`
}

// takes a boolean
export const togglePoopBag = function togglePoopBag(show){
  document.querySelector('.poop-bag').classList.toggle('hidden', !show);
}
// can be any string
export const writeModal = function writeModal(text = "") {
  document.querySelector(
    ".modal-inner"
  ).innerText = `${text}`;
};
