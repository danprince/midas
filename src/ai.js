import { RNG, Direction } from "silmarils";
import * as Actions from "./actions.js";

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

  Actions.move(self, direction);
}
