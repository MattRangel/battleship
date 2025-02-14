import Gameboard from "./gameboard.js";

export default class Player {
  constructor(isHuman) {
    this.isHuman = isHuman;
    this.board = new Gameboard();
  }
}
