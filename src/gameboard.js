import Ship from "./ship";

export default class Gameboard {
  constructor() {
    this.ships = [];
    this.board = this.constructor.#createBoard(10);
  }

  placeShip({ position, direction, length }) {
    const shipId = this.ships.push(new Ship(length)) - 1;
    const spots = this.#getSpots({ position, direction, length });
    spots.forEach((location) => {
      const boardSpot = this.board[location[0]][location[1]];
      boardSpot.shipId = shipId;
    });
  }

  #getSpots({ position, direction, length }) {
    const directionNum = ["vertical", "horizontal"].indexOf(direction);

    return [...Array(length).keys()].map((index) => {
      const newPosition = [...position];
      newPosition.splice(directionNum, 1, position[directionNum] + index);
      return newPosition;
    });
  }

  static #createBoard(size) {
    return [...Array(size)].map(() => [...Array(size)].map(() => new Object()));
  }
}
