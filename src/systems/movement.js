import { Easing, Direction } from "silmarils";

export class MovementSystem {
  /**
   * @param {GameObject} object
   * @param {Direction} direction
   * @return {boolean} Did the object move successfully?
   */
  move(object, direction) {

    let [dx, dy] = Direction.toVector(direction);

    let tx = object.x + dx;
    let ty = object.y + dy;

    object.direction = direction;

    if (object.mobile) {
      if (object.direction === Direction.WEST) {
        object.flipX = true;
      } else if (object.direction === Direction.EAST) {
        object.flipX = false;
      }
    }

    if (dx === 0 && dy === 0) {
      return false;
    }

    if (tx < 0 || ty < 0 || tx >= game.stage.width || ty >= game.stage.height) {
      return false;
    }

    let target = game.stage.getObjectAt(tx, ty);

    if (
      target &&
      // check whether this object can transmute objects into gold
      object.canTransmute &&
      // check that the target object can be transmuted
      target.canBeTransmuted &&
      // check that the target object is not already transmuted
      !target.transmuted &&
      // can't transmute living objects
      !target.health
    ) {
      systems.transmutation.transmuteObject(target, object);
    }

    if (target && object.canAttack && target.canBeAttacked) {
      systems.combat.attack(object, target);
      return true;
    }

    if (target && (object.canPush || object.canBePushed) && target.canBePushed) {
      let result = systems.movement.move(target, direction);

      if (result) {
        systems.audio.play("blockMove");
      }

      if (result === false) {
        if (object.canCrush && target.canBeCrushed) {
          this.crush(target);
        } else {
          return false;
        }
      }
    } else if (target) {
      return false;
    }

    game.stage.move(object, tx, ty)

    object.offsetX = -dx;
    object.offsetY = -dy;

    systems.tween.add({
      duration: 150,
      easing: Easing.easeInOutQuad,
      from: { x: -dx, y: -dy, z: 0 },
      to: { x: 0, y: 0, z: Math.PI },
      step({ x, y, z }) {
        object.offsetX = x;
        object.offsetY = y;

        if (object.canJump) {
          object.jump = Math.sin(z) * 0.2;
        }
      },
      done() {
        object.jump = 0;

        if (object.canTransmute) {
          systems.transmutation.transmuteTile(tx, ty, object);
        }
      },
    });

    return true;
  }

  /**
   * @param {GameObject} object
   */
  crush(object) {
    // TODO: Should deal damage instead
    game.stage.remove(object);
  }
}
