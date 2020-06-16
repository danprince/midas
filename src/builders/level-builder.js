import { RNG } from "silmarils";
import { Stage } from "../stage.js";
import * as RoomBuilder from "./room-builder.js";
import LevelTemplates from "../data/levels.json";

const MAX_PLACEMENT_ATTEMPTS = 1000;
const MAX_LEVEL_ATTEMPTS = 100;

/**
 * @type {Partial<LevelTemplate>}
 */
const DEFAULT_LEVEL_TEMPLATE = {
  maxRooms: 10,
  minRooms: 1,
  minWidth: 0,
  minHeight: 0,
  maxWidth: 1000,
  maxHeight: 1000,
}

/**
 * @type {string} id
 * @return {LevelTemplate}
 */
function getTemplateById(id) {
  let template = LevelTemplates[id];

  return {
    ...DEFAULT_LEVEL_TEMPLATE,
    ...template,
  };
}

/**
 * @type {string} id
 * @return {LevelBuilder}
 */
function createBuilder(id) {
  let template = getTemplateById(id);
  let width = RNG.int(template.minWidth, template.maxWidth);
  let height = RNG.int(template.minHeight, template.maxHeight);
  let stage = new Stage(width, height, 0);
  let nodes = [];
  let openEdges = [];
  let closedEdges = [];

  return {
    template,
    width,
    height,
    stage,
    nodes,
    openEdges,
    closedEdges,
  };
}

/**
 * @param {LevelBuilder} builder
 * @param {LevelBuilderNode} node
 * @param {number} x
 * @param {number} y
 */
function addNode(builder, node, x, y) {
  node.x = x;
  node.y = y;
  node.id = builder.nodes.length;
  builder.nodes.push(node);

  // Add all edges from the room to the open edge list

  for (let edge of node.edges) {
    builder.openEdges.push({
      from: node.id,
      to: null,
      x: node.x + edge.x,
      y: node.y + edge.y,
    });
  }

  // Write the tiles from the room to the stage

  for (let i = 0; i < node.width; i++) {
    for (let j = 0; j < node.height; j++) {
      let tile = node.tiles[i + j * node.width];

      if (tile) {
        builder.stage.setTile(node.x + i, node.y + j, tile);
      }
    }
  }
}

/**
 * @param {LevelBuilder} builder
 * @param {LevelBuilderNode} node
 * @param {number} x
 * @param {number} y
 * @param {LevelBuilderEdge} edge
 * @param {Point} internalEdge
 */
function addNodeToEdge(builder, node, x, y, edge, internalEdge) {
  // Update the edge to point at new node
  edge.to = node.id;

  // Move the edge from the open edge list to closed edge list
  removeFromArray(builder.openEdges, edge);
  builder.closedEdges.push(edge);

  // Remove the edge that we used to connect this room
  removeFromArray(node.edges, internalEdge);

  // Add the node to the builder
  addNode(builder, node, x, y);
}

/**
 * @template T
 * @param {T[]} array
 * @param {T} item
 */
function removeFromArray(array, item) {
  array.splice(array.indexOf(item), 1);
}

/**
 * @param {LevelBuilder} builder
 * @param {LevelBuilderNode} node
 * @param {number} x
 * @param {number} y
 */
export function checkNodePlacement(builder, node, x, y) {
  if (x < 0 || y < 0 || x + node.width > builder.width || y + node.height > builder.height) {
    return false;
  }

  let overlaps = 0;

  for (let i = 0; i < node.width; i++) {
    for (let j = 0; j < node.height; j++) {
      let nodeTile = node.tiles[i + j * node.width];
      let builderTile = builder.stage.getTile(x + i, y + j);

      if (nodeTile && builderTile) {
        overlaps += 1;
      }
    }
  }

  if (overlaps > node.edges.length) {
    return false;
  }

  return true;
}

/**
 * @param {string} id
 */
export function buildLevel(id) {
  let builder = createBuilder(id);

  // Find an entrance room that will fit into the map

  // TODO: How to recognise a room as an entrance then make sure we
  // don't put entrances in again later?
  let entrance = RoomBuilder.build({
    tags: ["entrance", ...builder.template.tags],
    legend: builder.template.legend,
  });

  // Add the origin room at a random location on the map

  let x = RNG.int(0, builder.width - entrance.width);
  let y = RNG.int(0, builder.height - entrance.height);

  addNode(builder, entrance, x, y);

  for (let i = 0; i <= MAX_PLACEMENT_ATTEMPTS; i++) {
    let room = RoomBuilder.build({
      tags: builder.template.tags,
      legend: builder.template.legend,
    });

    // Check whether we can connect any open edges in the level with
    // the edges of this room

    edges: for (let openEdge of builder.openEdges) {
      for (let edge of room.edges) {
        // Find required room origin for edges to connect
        let x = openEdge.x - edge.x;
        let y = openEdge.y - edge.y;

        // Check whether the node can be connected here
        let canPlace = checkNodePlacement(builder, room, x, y);

        // TODO: Don't want to place this if node would close all
        // remaining edges.

        if (canPlace) {
          addNodeToEdge(builder, room, x, y, openEdge, edge);
          break edges;
        }
      }
    }

    // Once we have placed the minimum number of rooms, have a random
    // chance of stopping after each new room.
    if (builder.nodes.length > builder.template.minRooms) {
      if (RNG.float(0, 1) > 0.95) {
        break;
      }
    }

    if (builder.nodes.length === builder.template.maxRooms) {
      break;
    }

    if (i >= MAX_PLACEMENT_ATTEMPTS) {
      if (builder.nodes.length >= builder.template.minRooms) {
        return builder;
      } else {
        throw new Error("Could not place any more rooms");
      }
    }
  }

  return builder;
}

/**
 * @param {LevelBuilder} builder
 */
function score(builder) {
  // TODO: Score based on
  // - cycles
  // - dead-ends
  // - penalty if too small
}

/**
 * @param {LevelBuilder} builder
 */
function furnish(builder) {
  for (let x = 0; x < builder.width; x++) {
    for (let y = 0; y < builder.height; y++) {
      if (x % 2 ? y % 2 : !(y % 2)) {
        if (builder.stage.getTile(x, y)) {
          builder.stage.setTile(x, y, 24);
        }
      }
    }
  }
}

/**
 * @param {string} levelId
 */
export function build(levelId) {
  // TODO: Build N levels and select one based on score

  console.groupCollapsed("generating level...");

  for (let i = 0; i < MAX_LEVEL_ATTEMPTS; i++) {
    console.groupCollapsed("attempt", i);

    try {
      let builder = buildLevel(levelId);
      console.log(builder);

      // Furnish the best level from the candidates
      furnish(builder);

      console.groupEnd();
      console.groupEnd();
      return builder.stage;
    } catch (err) {
      console.error("failed", err);
    }

    console.groupEnd();
  }

  console.groupEnd();
}
