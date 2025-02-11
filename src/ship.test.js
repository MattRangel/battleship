import Ship from "./ship.js";

test("hit() adds one to hits property", () => {
  const testShip = new Ship(2);
  testShip.hit();
  expect(testShip.hits).toBe(1);
});
