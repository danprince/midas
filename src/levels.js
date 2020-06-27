import { RNG } from "silmarils";
import { Stage } from "./stage.js";

export function empty() {
  let stage = new Stage(10, 10, "stone-floor");

  return stage;
}

export function sandbox() {
  let stage = new Stage(15, 15, "stone-floor");

  for (let x = 0; x < stage.width; x++) {
    stage.setTileType(x, 0, "stone-wall");
    stage.setTileType(x, stage.height - 1, "stone-wall");
  }

  for (let y = 0; y < stage.height; y++) {
    stage.setTileType(0, y, "stone-wall");
    stage.setTileType(stage.width - 1, y, "stone-wall");
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(1, stage.width - 1);
    let y = RNG.int(1, stage.height - 1);
    stage.spawn("column", x, y);
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(1, stage.width - 1);
    let y = RNG.int(1, stage.height - 1);
    stage.spawn("block", x, y);
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(1, stage.width - 1);
    let y = RNG.int(1, stage.height - 1);
    stage.spawn("wall", x, y);
  }

  stage.spawn("upstairs", 5, 5);

  for (let i = 0; i < 20; i++) {
    let id = RNG.item(
      "cyclops", "lamia", "faun", "philosopher", "scholar", "hoplite",
      "hoplite-spearman", "hydra", "snake", "hydra-head", "ladon",
      "automaton", "amazon", "centaur"
    );

    let x = RNG.int(1, stage.width - 1);
    let y = RNG.int(1, stage.height - 1);

    stage.spawn(id, x, y);
  }

  for (let i = 0; i < 20; i++) {
    let id = RNG.item(
      "doric-column", "barrel", "candle", "vase", "altar-1"
    );

    let x = RNG.int(1, stage.width - 1);
    let y = RNG.int(1, stage.height - 1);

    stage.spawn(id, x, y);
  }

  stage.spawn("medusa", 8, 4);

  return stage;
}
