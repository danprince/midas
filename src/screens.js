import * as Easings from "silmarils/easing";

import { Screen } from "./game.js";
import * as Actions from "./actions.js";
import * as Objects from "./objects.js";
import * as Levels from "./levels.js";

export class GameScreen extends Screen {
  enter() {
    game.stage = Levels.sandbox();
    game.player = Objects.midas();
    game.stage.spawn(game.player);

    // Set the camera to follow the player
    systems.camera.target = game.player;

    // Drop midas in from above the map
    systems.tween.add({
      from: { jump: 5 },
      to: { jump: 0 },
      easing: Easings.easeOutExp,
      duration: 500,
      step({ jump }) {
        game.player.jump = jump;
      },
      done() {
        Actions.goldify(0, 0)
      }
    });
  }

  update(dt) {
    systems.render.update(dt);
    systems.particle.update(dt);
    systems.animation.update(dt);
    systems.tween.update(dt);
  }

  turn() {
    systems.ai.update();
    systems.camera.update();
  }

  handleInput(event) {
    if (event instanceof MouseEvent) {
      let rect = systems.render.canvas.getBoundingClientRect();
      let screenX = event.clientX - rect.left;
      let screenY = event.clientY - rect.top;
      game.pointer.x = screenX;
      game.pointer.y = screenY;
    }

    else if (event instanceof KeyboardEvent) {
      let success = false;

      switch (event.key) {
        case "ArrowLeft":
          success = Actions.move(game.player, -1, 0);
          break;
        case "ArrowRight":
          success = Actions.move(game.player, 1, 0);
          break;
        case "ArrowUp":
          success = Actions.move(game.player, 0, -1);
          break;
        case "ArrowDown":
          success = Actions.move(game.player, 0, 1);
          break;
        case "r":
          success = true;
          break;

        case "-": {
          game.camera.z -= 1;
          break;
        }

        case "+": {
          game.camera.z += 1;
          break;
        }
      }

      if (success) {
        this.turn();
      }

      return success;
    }
  }
}
