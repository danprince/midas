import * as Random from "silmarils/rng";
import { Stage } from "./stage.js";

export function sandbox() {
  let stage = new Stage(20, 20, 20);

  // Random pattern in the map tiles
  for (let x = 0; x < stage.width; x++) {
    for (let y = 0; y < stage.height; y++) {
      if (Math.random() > 0.5) {
        stage.setTile(x, y, 22);
      }
    }
  }

  for (let i = 0; i < 20; i++) {
    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);
    stage.spawn("coins", x, y);
  }

  for (let i = 0; i < 20; i++) {
    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);
    stage.spawn("column", x, y);
  }

  for (let i = 0; i < 20; i++) {
    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);
    stage.spawn("block", x, y);
  }

  for (let i = 0; i < 30; i++) {
    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);
    stage.spawn("wall", x, y);
  }

  stage.spawn("upstairs", 45, 45);

  for (let i = 0; i < 30; i++) {
    let id = Random.item(
      "cyclops", "lamia", "faun", "philosopher", "scholar", "hoplite",
      "hoplite-spearman", "hoplite-captain"
    );

    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);

    stage.spawn(id, x, y);
  }

  stage.spawn("medusa", 8, 4);

  return stage;
}
