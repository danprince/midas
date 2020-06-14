import { RNG, Direction } from "silmarils";

/**
 * @param {GameObject} self
 */
export function wander(self) {
  /**
   * @type {Direction[]}
   */
  let directions = [
    Direction.NORTH,
    Direction.SOUTH,
    Direction.EAST,
    Direction.WEST,
  ];

  let direction = RNG.element(directions);

  systems.movement.move(self, direction);
}

/**
 * @param {GameObject} self
 */
export function medusa(self) {
  /**
   * @type {Direction[]}
   */
  let directions = [
    Direction.NORTH,
    Direction.SOUTH,
    Direction.EAST,
    Direction.WEST,
  ];

  let direction = RNG.element(directions);

  let x = self.x;
  let y = self.y;
  let moved = systems.movement.move(self, direction);

  if (moved && RNG.float(0, 1) > 0.8) {
    game.stage.spawn("snake", x, y);
  }
}
