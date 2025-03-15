document.querySelectorAll(".close-modal").forEach((button) =>
  button.addEventListener("click", (event) => {
    event.target.parentElement.close();
  }),
);

export function drawBoards(player, opponent) {
  const playerBoard = getBoard(player.board.data, true, player.name, false);
  const opponentBoard = getBoard(opponent.board.data, false, opponent.name);
  document
    .querySelector("#boards")
    .replaceChildren(playerBoard.element, opponentBoard.element);
  return opponentBoard.promise;
}

export function illegalPlacement() {
  document
    .querySelector("#board-creation")
    .animate({ backgroundColor: ["revert", "darkred", "revert"] }, 750);
}

export async function getShipPlacement(player, length) {
  const shipPreview = document.querySelector("#ship-preview");
  const shipIcons = [...Array(length)].map(() => document.createElement("div"));
  shipPreview.replaceChildren(...shipIcons);

  const boardElement = document.querySelector(".board-container");
  const newBoard = getBoard(
    player.board.data,
    true,
    `${player.name}, Place Your Ships`,
  );
  boardElement.replaceWith(newBoard.element);
  document.querySelector("#board-creation").showModal();

  const position = await newBoard.promise;
  const direction = document.querySelector("#place-ship-direction").value;

  closeBoardCreation();

  return {
    position,
    direction,
    length,
  };
}

function closeBoardCreation() {
  document.querySelector("#board-creation").close();
}

function getBoard(data, showShips, headerText = "", clickable = true) {
  const element = document.createElement("div");
  element.classList.add("board-container");

  const header = document.createElement("h2");
  header.innerText = headerText;

  const boardGrid = document.createElement("div");
  boardGrid.classList.add("board-grid");

  element.replaceChildren(header, boardGrid);

  data.forEach((row, rowIndex) => {
    row.forEach((spot, columnIndex) => {
      const spotElement = document.createElement(
        clickable && (showShips ? isNaN(spot?.shipId) : !spot?.hit)
          ? "button"
          : "div",
      );
      spotElement.classList.add("spot");
      spotElement.dataset.row = rowIndex;
      spotElement.dataset.column = columnIndex;
      spotElement.classList.toggle("hit", !!spot?.hit);
      spotElement.classList.toggle(
        "ship",
        !isNaN(spot?.shipId) && (showShips || !!spot?.hit),
      );
      boardGrid.appendChild(spotElement);
    });
  });

  const promise = new Promise((resolve) => {
    boardGrid.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", (e) => {
        const data = e.target.dataset;
        resolve([+data.row, +data.column]);
      }),
    );
  });

  return { element, promise };
}

export function endGame(name) {
  document
    .querySelectorAll(".board-grid button")
    .forEach((button) => (button.disabled = true));
  alertWinner(name);
}

function alertWinner(name) {
  const alertModal = document.querySelector("#win-alert");
  const header = document.querySelector("#win-alert h1");
  header.innerText = `${name} has won!`;
  alertModal.showModal();
}

export function passControl(name) {
  const modal = document.querySelector("#pass-control");
  modal.querySelector("h1").innerText = `Pass control to ${name}`;
  modal.showModal();
}
