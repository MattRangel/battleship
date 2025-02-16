export function drawBoards(boardData, oppBoardData, attackCallback) {
  const playerBoardElement = getBoardElement(boardData, true, "You:");
  const opponentBoardElement = getBoardElement(
    oppBoardData,
    false,
    "Opponent:",
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
