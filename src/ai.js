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
