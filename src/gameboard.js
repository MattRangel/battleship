import Ship from "./ship";

export default class Gameboard {
  constructor() {
    this.ships = [];
    this.boardData = this.constructor.#createBoard(10);
  }

  placeShip({ position, direction, length }) {
    const shipId = this.ships.push(new Ship(length)) - 1;
    const spots = this.#getSpots({ position, direction, length });
    spots.forEach((location) => {
      const boardSpot = this.boardData[location[0]][location[1]];
      boardSpot.shipId = shipId;
    });
  }

  receiveAttack(position) {
    const spot = this.boardData[position[0]][position[1]];
    spot.hit = true;
    this.ships[spot.shipId].hit();
  }

  isOver() {
    return this.ships.every((ship) => ship.isSunk());
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
