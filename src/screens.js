import * as Easings from "silmarils/easing";
import { Direction } from "silmarils";

import config from "./config.js";
import { Screen } from "./game.js";
import * as Levels from "./levels.js";
import { save, load } from "./storage.js";
import { build } from "./registry.js";

export class GameScreen extends Screen {
  enter() {
    try {
      load();
    } catch (err) {
      this.startNewGame();
    }

    systems.ui.setHealth(game.player.health, game.player.maxHealth);
    systems.ui.setSanity(game.player.sanity, game.player.maxSanity);
    systems.ui.setCoins(game.player.coins);

    onbeforeunload = () => save();
  }

  startNewGame() {
    game.stage = Levels.sandbox();
    game.player = build("midas");
    game.stage.add(game.player, 0, 0);

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
        systems.transmutation.transmuteTile(0, 0)
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

  /**
   * @param {Event} event
   */
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

      /**
       * @param {Direction} direction
       */
      let move = (direction) => systems.movement.move(game.player, direction);

      switch (event.key) {
        case config.keyMoveLeft:
          success = move(Direction.WEST);
          break;
        case config.keyMoveRight:
          success = move(Direction.EAST);
          break;
        case config.keyMoveUp:
          success = move(Direction.NORTH);
          break;
        case config.keyMoveDown:
          success = move(Direction.SOUTH);
          break;
        case config.keyRest:
          success = true;
          break;
        case "n":
          this.startNewGame();
          break;
      }

      if (success) {
        this.turn();
      }

      return success;
    }
  }
}
