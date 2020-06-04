import { Direction } from "silmarils";

export class CombatSystem {
  /**
   * @param {GameObject} object
   * @param {GameObject} target
   * @return
   */
  attack(object, target) {
    systems.vitality.damage(target, 1);

    target.stun = 1;

    if (target.health <= 0) {
      if (object.canTransmute && target.canBeTransmuted) {
        systems.transmutation.transmuteObject(target, object);
      } else {
        game.stage.remove(target);
      }
    }

    systems.audio.play("slash");

    systems.animation.add({
      x: target.x,
      y: target.y,
      speed: 3,
      frame: 0,
      sprite: 150,
      length: 5,
      z: 1,
      flipX: object.direction === Direction.WEST
    });
  }
}
