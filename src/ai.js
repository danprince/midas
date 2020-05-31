import { RNG, Vector } from "silmarils";
import * as Actions from "./actions.js";

/**
 * @param {GameObject} self
 * @param {{ direction: Vector.Vector }} state
 */
export function medusa(self, state) {
  let moving = true;

  while (moving) {
    let [dx, dy] = state.direction;
    moving = Actions.move(self, dx, dy);
  }

  Vector.multiply(state.direction, [-1, -1]);
}

/**
 * @param {GameObject} self
 */
export function wander(self) {
  let [dx, dy] = RNG.item(
    [-1, 0],
    [+1, 0],
    [0, -1],
    [0, +1],
  );

  Actions.move(self, dx, dy);
}
