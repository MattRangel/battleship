import Player from "./player.js";
import * as Interface from "./dom-interface.js";

export default class Game {
  constructor() {
    this.players = [
      new Player(true, "Player 1"),
      new Player(false, "Player 2"),
    ];
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

  get #winner() {
    const loserIndex = this.players.findIndex((player) =>
      player.board.isOver(),
    );
    return this.players[Math.abs(loserIndex - 1)];
  }

  takeTurn(position) {
    this.#opponent.board.receiveAttack(position);
    this.turn++;
    this.#drawBoards();
    this.#endTurn();
  }

  #endTurn() {
    if (this.#winner) {
      Interface.endGame(this.#winner.name);
      return;
    }

    if (!this.#currentPlayer.isHuman) {
      this.takeTurn(this.#getComputerMove());
    }
  }

  #drawBoards() {
    Interface.drawBoards(this.#currentPlayer, this.#opponent, (position) =>
      this.takeTurn(position),
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
