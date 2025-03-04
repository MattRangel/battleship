import Player from "./player.js";
import * as Interface from "./dom-interface.js";

export default class Game {
  #ships;

  constructor() {
    this.#ships = [5, 4, 3, 3, 2];
    this.players = [
      new Player(true, "Player 1"),
      new Player(false, "Player 2"),
    ];
    this.turn = 0;
    this.#fillBoards().then(() => this.#drawBoards());
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

  async #fillBoards() {
    for (const player of this.players) {
      await this.#fillBoard(player, this.#ships);
    }
  }

  async #getShipPlacement(player, length) {
    if (!player.isHuman) {
      return this.#randomPlacement(player, length);
    }

    const placement = await new Promise((resolve) =>
      Interface.getShipPlacement(player, resolve),
    );
    placement.length = length;
    placement.direction = "vertical";
    return placement;
  }

  async #fillBoard(player, shipLengths) {
    for (const length of shipLengths) {
      while (true) {
        const placement = await this.#getShipPlacement(player, length);
        try {
          player.board.placeShip(placement);
          break;
        } catch {
          Interface.illegalPlacement();
        }
      }
    }
  }

  #randomPlacement(player, length) {
    const placements = player.board.legalPlacements(length);
    return placements[Math.floor(Math.random() * placements.length)];
  }
}
