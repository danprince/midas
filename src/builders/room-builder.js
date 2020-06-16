import { RNG } from "silmarils";
import RoomTemplates from "../data/rooms.json";

/**
 * @type {LevelBuilderLegend}
 */
const DEFAULT_BUILDER_LEGEND = {
  ".": { tile: 20 },
  "+": { tile: 20, edge: true },
  "o": { tile: 20, type: "object" },
  "e": { tile: 20, type: "entrance" },
  " ": { tile: 0 }
}

/**
 * @param {string[]} tags
 * @return {RoomTemplate}
 */
function findRoomTemplate(tags) {
  let candidates = RoomTemplates.filter(template => {
    return tags.every(tag => template.tags.includes(tag))
  });

  return RNG.element(candidates);
}

/**
 * @param {RoomTemplate} template
 * @param {LevelBuilderLegend} legend
 * @return {LevelBuilderNode}
 */
function parseRoomTemplate(template, legend = DEFAULT_BUILDER_LEGEND) {
  let lines = template.layout;

  /**
   * @type {LevelBuilderNode}
   */
  let node = {
    id: -1,
    x: 0,
    y: 0,
    height: lines.length,
    width: Math.max(...lines.map(l => l.length)),
    edges: [],
    tiles: [],
    placements: []
  };

  for (let y = 0; y < node.height; y++) {
    let line = lines[y];

    for (let x = 0; x < node.width; x++) {
      let char = line[x];
      let entry = legend[char];

      if (entry == null) {
        console.warn("[builder] no legend entry for", char);
        continue;
      }

      if (entry.tile) {
        node.tiles[x + y * node.width] = entry.tile;
      }

      if (entry.type) {
        node.placements.push({ type: entry.type, x, y });
      }

      if (entry.edge) {
        node.edges.push({ x, y });
      }
    }
  }

  return node;
}

// TODO: Should be possible to pass a legend
export function build({ tags, legend }) {
  let template = findRoomTemplate(tags);
  let room = parseRoomTemplate(template, legend);
  return room;
}
