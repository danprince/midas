import * as Random from "silmarils/rng";
import { Stage } from "./stage.js";

export function sandbox() {
  let stage = new Stage(9, 9, 20);

  // Random pattern in the map tiles
  for (let x = 0; x < stage.width; x++) {
    for (let y = 0; y < stage.height; y++) {
      if (Math.random() > 0.5) {
        stage.setTile(x, y, 22);
      }
    }
  }

  stage.spawn("coins", 5, 4);
  stage.spawn("coins", 1, 1);
  stage.spawn("coins", 1, 8);
  stage.spawn("coins", 2, 2);
  stage.spawn("coins", 8, 6);

  stage.spawn("column", 7, 6);
  stage.spawn("upstairs", 4, 6);
  stage.spawn("block", 5, 6);
  stage.spawn("block", 8, 0);
  stage.spawn("block", 8, 8);
  stage.spawn("block", 0, 8);
  stage.spawn("block", 4, 4);
  stage.spawn("block", 2, 4);
  stage.spawn("block", 3, 8);
  stage.spawn("block", 3, 6);

  for (let i = 0; i < 5; i++) {
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
