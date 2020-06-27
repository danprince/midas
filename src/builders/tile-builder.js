import Tiles from "../data/tiles.json";
import { buildFromTemplate } from "./builder-utils.js";

/**
 * @param {string} id
 * @return {Tile}
 */
export function build(id) {
  let tile = /** @type {Tile} */(buildFromTemplate(Tiles, id));
  return tile;
}
