import { ICONS } from "./constants";

const toggleHighlighted = (icon, show) =>
  document
    .querySelector(`.${ICONS[icon]}-icon`)
    .classList.toggle("highlighted", show);

export function initButtons(handleUserInteraction) {
  let selectedIcon = 0;
  function buttonClick({ target }) {
    if (target.classList.contains("right-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (selectedIcon + 1) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    } else if (target.classList.contains("left-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (selectedIcon + 2) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    } else handleUserInteraction(ICONS[selectedIcon]);
  }
  document.querySelector(".buttons").addEventListener("click", buttonClick);
}
