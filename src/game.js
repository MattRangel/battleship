import Player from "./player.js";
import * as Interface from "./dom-interface.js";

export default class Game {
  constructor() {
    this.players = [new Player(true), new Player(false)];
    this.turn = 0;
    this.#autoFillBoards();
    this.#drawBoards();
  }

  get #currentPlayer() {
    return this.players[this.turn % 2];
  }

  get #opponent() {
    return this.players[Math.abs((this.turn % 2) - 1)];
  }

  takeTurn(position) {
    this.#opponent.board.receiveAttack(position);
    this.#prepareNextTurn();
  }

  #prepareNextTurn() {
    this.turn++;
    if (!this.#currentPlayer.isHuman) {
      this.takeTurn(this.#getComputerMove());
    }
    this.#drawBoards();
  }

  #drawBoards() {
    Interface.drawBoards(
      this.#currentPlayer.board.data,
      this.#opponent.board.data,
      (position) => this.takeTurn(position),
    );
  }

  #getComputerMove() {
    const legalSpots = this.#opponent.board.data
      .flat()
      .filter((spot) => !spot?.hit);
    const randomIndex = Math.floor(Math.random() * legalSpots.length);
    const chosenSpot = legalSpots[randomIndex];

    return [chosenSpot.row, chosenSpot.column];
  }

  #autoFillBoards() {
    this.players[0].board.placeShip({
      position: [0, 0],
      direction: "vertical",
      length: 3,
    });
    this.players[1].board.placeShip({
      position: [1, 0],
      direction: "horizontal",
      length: 3,
    });
  }
}
