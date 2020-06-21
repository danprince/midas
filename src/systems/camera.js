import { Easing, Point } from "silmarils";
import { System } from "../game.js";

export class CameraSystem extends System {
  constructor() {
    super();

    /**
     * @type {GameObject}
     */
    this.target = null;
  }

  update() {
    if (this.target == null) {
      return;
    }

    if (Point.distance(game.camera, this.target) > 0) {
      let originX = game.camera.x;
      let originY = game.camera.y;
      let targetX = this.target.x + 0.5;
      let targetY = this.target.y + 0.5;

      systems.tween.add({
        duration: 300,
        from: { x: originX, y: originY },
        to: { x: targetX, y: targetY },
        easing: Easing.easeInOutSine,
        step({ x, y }) {
          game.camera.x = x;
          game.camera.y = y;
        }
      });
    }
  }

  updateImmediate() {
    if (this.target == null) {
      return;
    }

    game.camera.x = this.target.x + 0.5;
    game.camera.y = this.target.y + 0.5;
  }
}
