import Ship from "./ship";

export default class Gameboard {
  #size;

  constructor() {
    this.#size = 10;
    this.ships = [];
    this.data = this.constructor.#createBoard(this.#size);
  }

  reset() {
    this.ships = [];
    this.data = this.constructor.#createBoard(this.#size);
  }

  placeShip({ position, direction, length }) {
    const shipId = this.ships.push(new Ship(length)) - 1;
    const spots = this.#getSpots({ position, direction, length });
    if (this.#checkIllegalPlacements(spots)) {
      throw new Error("Illegal ship placement!");
    }
    spots.forEach((location) => {
      const boardSpot = this.data[location[0]][location[1]];
      boardSpot.shipId = shipId;
    });
  }

  receiveAttack(position) {
    const spot = this.data[position[0]][position[1]];
    spot.hit = true;
    this.ships[spot.shipId]?.hit();
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

  #checkIllegalPlacements(spots) {
    return spots.some((spot) => {
      return (
        spot[0] < 0 ||
        spot[1] < 0 ||
        spot[0] >= this.#size ||
        spot[1] >= this.#size ||
        !isNaN(this.data[spot[0]][spot[1]]?.shipId)
      );
    });
  }

  legalPlacements(length) {
    return this.data
      .flat()
      .filter((spot) => isNaN(spot?.shipId))
      .reduce((acc, spot) => {
        const position = [spot.row, spot.column];

        ["vertical", "horizontal"].forEach((direction) => {
          if (
            !this.#checkIllegalPlacements(
              this.#getSpots({ position, length, direction }),
            )
          ) {
            acc.push({ direction, position, length });
          }
        });

        return acc;
      }, []);
  }

  static #createBoard(size) {
    return [...Array(size)].map((_, row) =>
      [...Array(size)].map((_, column) => new Object({ row, column })),
    );
  }
}
