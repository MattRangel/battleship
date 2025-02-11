import Ship from "./ship.js";

test("hit() adds one to hits property", () => {
  const testShip = new Ship(2);
  testShip.hit();
  expect(testShip.hits).toBe(1);
});

test("isSunk() only returns true when hits are equal to length", () => {
  const testShip = new Ship(2);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});
