import Items from "../data/items.json";
import { buildFromTemplate } from "./builder-utils.js";

/**
 * @param {string} id
 * @return {Item}
 */
export function build(id) {
  let item = /** @type {Item} */(buildFromTemplate(Items, id));
  item.id = game.getNextObjectId();
  return item;
}
