document.querySelector(".close-modal").addEventListener("click", (event) => {
  event.target.parentElement.close();
});

export function drawBoards(player, opponent, attackCallback) {
  const playerBoardElement = getBoardElement(
    player.board.data,
    true,
    player.name,
  );
  const opponentBoardElement = getBoardElement(
    opponent.board.data,
    false,
    opponent.name,
    attackCallback,
  );
  document
    .querySelector("#boards")
    .replaceChildren(playerBoardElement, opponentBoardElement);
}

function getBoardElement(
  data,
  showShips,
  headerText = "",
  clickCallback = undefined,
) {
  const container = document.createElement("div");
  container.classList.add("board-container");

  const header = document.createElement("h2");
  header.innerText = headerText;

  const boardGrid = document.createElement("div");
  boardGrid.classList.add("board-grid");

  container.replaceChildren(header, boardGrid);

  data.forEach((row, rowIndex) => {
    row.forEach((spot, columnIndex) => {
      const spotElement = document.createElement(
        showShips || !!spot?.hit ? "div" : "button",
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

  boardGrid.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", (e) => {
      const data = e.target.dataset;
      clickCallback([+data.row, +data.column]);
    }),
  );

  return container;
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
