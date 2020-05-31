import * as Random from "silmarils/rng";
import * as Objects from "./objects.js";
import { Stage } from "./stage.js";

export function sandbox() {
  let stage = new Stage(9, 9, 20);

  stage.spawn({ sprite: 10, x: 5, y: 4, canBePushed: true, canBeCrushed: true });
  stage.spawn({ sprite: 10, x: 1, y: 1, canBePushed: true, canBeCrushed: true });
  stage.spawn({ sprite: 10, x: 1, y: 8, canBePushed: true, canBeCrushed: true });
  stage.spawn({ sprite: 11, x: 2, y: 2, canBePushed: true, canBeCrushed: true });
  stage.spawn({ sprite: 10, x: 8, y: 6, canBePushed: true, canBeCrushed: true });
  stage.spawn({ sprite: 32, x: 7, y: 6, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 36, x: 4, y: 6, h: 2, canBePushed: false });
  stage.spawn({ sprite: 30, x: 5, y: 6, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 8, y: 0, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 8, y: 8, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 0, y: 8, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 4, y: 4, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 2, y: 4, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 3, y: 8, h: 2, canBePushed: true, canCrush: true });
  stage.spawn({ sprite: 30, x: 3, y: 6, h: 2, canBePushed: true, canCrush: true });

  // Random pattern in the map tiles
  for (let x = 0; x < stage.width; x++) {
    for (let y = 0; y < stage.height; y++) {
      if (Math.random() > 0.5) {
        stage.setTile(x, y, 21);
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let sprite = Random.item(62, 63, 64, 65, 66, 67);
    let x = Random.int(0, stage.width);
    let y = Random.int(0, stage.height);

    stage.spawn({
      sprite,
      x,
      y,
      shadow: true,
      hp: 3,
      ai: { type: "wander" },
      mobile: true,
      canBeCrushed: true,
      canBeAttacked: true,
      canJump: true,
    });
  }

  stage.spawn(Objects.medusa(), 8, 4);

  return stage;
}
