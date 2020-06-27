import Objects from "../data/objects.json";
import { buildFromTemplate } from "./builder-utils.js";

/**
 * @param {string} id
 * @return {GameObject}
 */
export function build(id) {
  let object = /** @type {GameObject} */(buildFromTemplate(Objects, id));
  object.id = game.getNextObjectId();
  return object;
}
