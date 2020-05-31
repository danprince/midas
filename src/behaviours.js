import * as Actions from "./actions.js";

/**
 * @param {GameObject} self
 * @param {{ dx: number, dy: number }} state
 */
export function medusa(self, state) {
  let moving = true;

  while (moving) {
    moving = Actions.move(self, state.dx, state.dy);
  }

  state.dx *= -1;
  state.dy *= -1;
}
