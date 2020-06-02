import * as Random from "silmarils/rng";
import { Stage } from "./stage.js";

export function sandbox() {
  let stage = new Stage(20, 20, 0);

  // Random pattern in the map tiles
  //for (let x = 1; x < stage.width - 2; x++) {
  //  for (let y = 1; y < stage.height - 2; y++) {
  //    if (Math.random() > 0.2) {
  //      stage.setTile(x, y, 20);
  //    }
  //  }
  //}

  // Draw 20 random rects
  for (let i = 0; i < 20; i++) {
    let w = Random.int(1, 5);
    let h = Random.int(1, 5);
    let x = Random.int(1, stage.width - w - 2);
    let y = Random.int(1, stage.height - h - 2);

    for (let rx = x; rx < x + w; rx++) {
      for (let ry = y; ry < y + h; ry++) {
        stage.setTile(rx, ry, 20);
      }
    }
  }

  //for (let i = 0; i < 20; i++) {
  //  let x = Random.int(0, stage.width);
  //  let y = Random.int(0, stage.height);
  //  stage.spawn("coins", x, y);
  //}

  //for (let i = 0; i < 20; i++) {
  //  let x = Random.int(0, stage.width);
  //  let y = Random.int(0, stage.height);
  //  stage.spawn("column", x, y);
  //}

  //for (let i = 0; i < 20; i++) {
  //  let x = Random.int(0, stage.width);
  //  let y = Random.int(0, stage.height);
  //  stage.spawn("block", x, y);
  //}

  //for (let i = 0; i < 30; i++) {
  //  let x = Random.int(0, stage.width);
  //  let y = Random.int(0, stage.height);
  //  stage.spawn("wall", x, y);
  //}

  //stage.spawn("upstairs", 45, 45);

  //for (let i = 0; i < 30; i++) {
  //  let id = Random.item(
  //    "cyclops", "lamia", "faun", "philosopher", "scholar", "hoplite",
  //    "hoplite-spearman", "hoplite-captain"
  //  );

  //  let x = Random.int(0, stage.width);
  //  let y = Random.int(0, stage.height);

  //  stage.spawn(id, x, y);
  //}

  stage.spawn("medusa", 8, 4);

  return stage;
}
