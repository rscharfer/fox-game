const gameState = {
  clock: 1,
  current: "INT",
  tick() {
    this.clock++;
    console.log("tick incremented", this.clock);
    return this.clock;
  },
};

export default gameState;
