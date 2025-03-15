import Player from "./player.js";
import * as Interface from "./dom-interface.js";

export default class Game {
  #ships;

  constructor() {
    this.#ships = [5, 4, 3, 3, 2];
    this.turn = 0;
    this.players = [];
  }

  start() {
    this.#createPlayers()
      .then(this.#fillBoards.bind(this))
      .then(this.#nextTurn.bind(this));
  }

  restart() {
    this.turn = 0;
    this.start();
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
    this.#nextTurn();
  }

  #nextTurn() {
    this.#drawBoards();
    if (this.#winner) {
      Interface.endGame(this.#winner.name, () => this.restart());
      return;
    }

    if (!this.#currentPlayer.isHuman) {
      this.takeTurn(this.#getComputerMove());
    } else if (this.players.every((player) => player.isHuman)) {
      Interface.passControl(this.#currentPlayer.name);
    }
  }

  #drawBoards() {
    Interface.drawBoards(this.#currentPlayer, this.#opponent).then(
      (position) => {
        this.takeTurn(position);
      },
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

  async #createPlayers() {
    for (const index of [0, 1]) {
      const oldInfo = {
        name: this.players[index]?.name,
        isHuman: this.players[index]?.isHuman,
      };
      const playerInfo = await Interface.getPlayerInfo(index, oldInfo);
      this.players[index] = new Player(playerInfo.isHuman, playerInfo.name);
    }
  }

  async #fillBoards() {
    for (const player of this.players) {
      await this.#fillBoard(player, this.#ships);
    }
  }

  async #getShipPlacement(player, length) {
    return player.isHuman
      ? await Interface.getShipPlacement(player, length)
      : this.#randomPlacement(player, length);
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
