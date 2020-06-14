import { RNG } from "silmarils";
import { Stage } from "./stage.js";

export function empty() {
  let stage = new Stage(10, 10, 20);

  // Random pattern in the map tiles
  for (let x = 0; x < stage.width; x++) {
    for (let y = 0; y < stage.height; y++) {
      if (Math.random() > 0.5) {
        stage.setTile(x, y, 22);
      }
    }
  }

  return stage;
}

export function sandbox() {
  let stage = new Stage(15, 15, 20);

  for (let x = 0; x < stage.width; x++) {
    for (let y = 0; y < stage.height; y++) {
      // Chessboard
      if (x % 2 ? y % 2 : !(y % 2)) {
        stage.setTile(x, y, 24);
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(0, stage.width);
    let y = RNG.int(0, stage.height);
    stage.spawn("column", x, y);
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(0, stage.width);
    let y = RNG.int(0, stage.height);
    stage.spawn("block", x, y);
  }

  for (let i = 0; i < 10; i++) {
    let x = RNG.int(0, stage.width);
    let y = RNG.int(0, stage.height);
    stage.spawn("wall", x, y);
  }

  stage.spawn("upstairs", 5, 5);

  for (let i = 0; i < 20; i++) {
    let id = RNG.item(
      "cyclops", "lamia", "faun", "philosopher", "scholar", "hoplite",
      "hoplite-spearman", "hydra", "snake", "hydra-head", "ladon",
      "automaton", "amazon", "centaur"
    );

    let x = RNG.int(0, stage.width);
    let y = RNG.int(0, stage.height);

    stage.spawn(id, x, y);
  }

  for (let i = 0; i < 20; i++) {
    let id = RNG.item(
      "doric-column", "barrel", "candle", "vase", "altar-1"
    );

    let x = RNG.int(0, stage.width);
    let y = RNG.int(0, stage.height);

    stage.spawn(id, x, y);
  }

  stage.spawn("medusa", 8, 4);

  return stage;
}
