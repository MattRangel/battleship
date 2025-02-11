export default class Gameboard {
  constructor() {
    this.ships = [];
    this.board = [...Array(10)].map(() => Array(10));
  }
}
