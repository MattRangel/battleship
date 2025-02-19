import Gameboard from "./gameboard.js";

export default class Player {
  constructor(isHuman, name) {
    this.isHuman = isHuman;
    this.name = name;
    this.board = new Gameboard();
  }
}
