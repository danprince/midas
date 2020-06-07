import { RNG, Direction } from "silmarils";

export class CombatSystem {
  /**
   * @param {GameObject} object
   * @param {GameObject} target
   * @return
   */
  attack(object, target) {
    // TODO: Calculate this from the object + whatever they're holding
    let damage = RNG.int(0, 3);
    systems.vitality.damage(target, damage);

    target.stun = 1;

    let dx = (target.x - object.x) * 0.5;
    let dy = (target.y - object.y) * 0.5;

    systems.tween.add({
      duration: 150,
      from: { x: dx, y: dy },
      to: { x: 0, y: 0 },
      step({ x, y }) {
        object.offsetX = x;
        object.offsetY = y;
      }
    });

    if (target.health <= 0) {
      if (object.canTransmute && target.canBeTransmuted) {
        systems.transmutation.transmuteObject(target, object);
      } else if (target !== game.player) {
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
