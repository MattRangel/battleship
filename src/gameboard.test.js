import Gameboard from "./gameboard";
import Ship from "./ship";

describe("placeShip", () => {
  const testGameboard = new Gameboard();

  testGameboard.placeShip({
    position: [0, 0],
    direction: "horizontal",
    length: 2,
  });

  test("adds ship to ships array", () => {
    expect(testGameboard.ships.length).toBe(1);
    expect(testGameboard.ships[0].constructor).toBe(Ship);
  });

  test("adds ship reference to board 2d array", () => {
    expect(testGameboard.board[0][0]).toEqual({ shipId: 0 });
    expect(testGameboard.board[0][1]).toEqual({ shipId: 0 });
  });
});

describe("receiveAttack", () => {
  const testGameboard = new Gameboard();

  testGameboard.placeShip({
    position: [0, 0],
    direction: "horizontal",
    length: 2,
  });

  const spyShip = jest.spyOn(testGameboard.ships[0], "hit");

  testGameboard.receiveAttack([0, 0]);

  test("marks spot as hit", () => {
    expect(testGameboard.board[0][0].hit).toBe(true);
  });

  test("sends hit command to ship covering spot", () => {
    expect(spyShip).toHaveBeenCalled();
  });
});
