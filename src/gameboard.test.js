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
    expect(testGameboard.data[0][0]).toMatchObject({ shipId: 0 });
    expect(testGameboard.data[0][1]).toMatchObject({ shipId: 0 });
  });

  test("throws error when placing ship that would fall out of bounds", () => {
    expect(() =>
      testGameboard.placeShip({
        position: [9, 0],
        direction: "vertical",
        length: 3,
      }),
    ).toThrow();

    expect(() =>
      testGameboard.placeShip({
        position: [-2, 0],
        direction: "horizontal",
        length: 2,
      }),
    ).toThrow();
  });

  test("throws error when placing ship that would fall on another ship", () => {
    expect(() =>
      testGameboard.placeShip({
        position: [0, 0],
        direction: "vertical",
        length: 2,
      }),
    ).toThrow();
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
  testGameboard.receiveAttack([1, 0]);

  test("marks spot as hit", () => {
    expect(testGameboard.data[0][0].hit).toBe(true);
  });

  test("marks empty spot as hit", () => {
    expect(testGameboard.data[1][0].hit).toBe(true);
  });

  test("sends hit command to ship covering spot", () => {
    expect(spyShip).toHaveBeenCalled();
  });
});

test("isOver returns true only when all ships have been fully hit", () => {
  const testGameboard = new Gameboard();

  testGameboard.placeShip({
    position: [0, 0],
    direction: "horizontal",
    length: 2,
  });

  testGameboard.placeShip({
    position: [1, 0],
    direction: "horizontal",
    length: 2,
  });

  testGameboard.receiveAttack([0, 0]);
  testGameboard.receiveAttack([0, 1]);
  expect(testGameboard.isOver()).toBe(false);

  testGameboard.receiveAttack([1, 0]);
  testGameboard.receiveAttack([1, 1]);
  expect(testGameboard.isOver()).toBe(true);
});

test("Data objects are initialized with their correct row and column attributes", () => {
  const testGameboard = new Gameboard();
  expect(testGameboard.data[0][0]).toMatchObject({ row: 0, column: 0 });
  expect(testGameboard.data[5][8]).toMatchObject({ row: 5, column: 8 });
});
