import { System } from "../game.js";
import * as AIHandlers from "../ai.js"

export class AISystem extends System {
  update() {
    for (let object of game.stage.objects) {
      if (object.stun > 0) {
        object.stun--;
        continue;
      }

      if (object.ai) {
        let name = typeof object.ai === "string" ? object.ai : object.ai.type;
        let handler = AIHandlers[name];
        let state = /** @type {any} */(object.ai);
        handler(object, state);
      }
    }
  }
}
