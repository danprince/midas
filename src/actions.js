import { RNG as Random, Easing } from "silmarils";

/**
 * @param {GameObject} object
 * @param {GameObject} target
 */
export function attack(object, target) {
  target.hp -= 1;

  target.stun = 1;

  systems.audio.play("slash");

  systems.animation.add({
    x: target.x,
    y: target.y,
    speed: 3,
    frame: 0,
    sprite: 150,
    length: 5,
    z: 1,
  });

  if (target.hp <= 0) {
    if (target.canBeTransmuted) {
      transmute(target);
    } else {
      game.stage.remove(target);
    }
  }
}

/**
 * @param {GameObject} object
 */
export function crush(object) {
  game.stage.remove(object);
}

/**
 * @param {GameObject} object
 * @param {number} dx
 * @param {number} dy
 * TODO: Convert to direction
 */
export function move(object, dx, dy) {
  let tx = object.x + dx;
  let ty = object.y + dy;

  if (object.mobile) {
    if (dx < 0) {
      object.flipX = true;
    } else if (dx > 0) {
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

  // Midas turns blocks gold
  if (object === game.player && target) {
    if (target.canBeTransmuted && !target.transmuted && !target.hp) {
      transmute(target);
    }
  }

  if (target && object.canAttack && target.canBeAttacked) {
    attack(object, target);
    return true;
  }

  if (target && (object.canPush || object.canBePushed) && target.canBePushed) {
    let result = move(target, dx, dy);

    if (result) {
      systems.audio.play("blockMove");
    }

    if (result === false) {
      if (object.canCrush && target.canBeCrushed) {
        crush(target);
      } else {
        return false;
      }
    }
  } else if (target) {
    return false;
  }

  object.x = tx;
  object.y = ty;

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
      // TODO: Can object make this tile gold?
      if (object === game.player) {
        goldify(tx, ty);
      }
    },
  });

  return true;
}

/**
 * @param {number} x
 * @param {number} y
 */
export function goldify(x, y) {
  let tile = game.stage.getTile(x, y);

  switch (tile) {
    case 20:
    case 22:
      game.stage.setTile(x, y, tile + 1);
      break;
    default:
      return;
  }

  let coins = Random.int(3, 7);

  //game.player.coins += coins;

  for (let i = 0; i < coins; i++) {
    systems.particle.add({
      x: x + 0.5,
      y: y - 0.3,
      r: 0,
      sprite: Math.random() > 0.5 ? 12 : 13,
      w: 4 / 16,
      h: 4 / 16,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 1) * 0.05,
      vr: 0.1,
      len: 100,
      t: 0,
    });
  }

  systems.audio.play("coins");
}

/**
 * @param {GameObject} object
 */
export function transmute(object) {
  object.transmuted = true;
  object.ai = null;
  object.shadow = false;
  object.canBePushed = true;
  object.canBeAttacked = false;
  object.canJump = false;
  object.mobile = false;

  // TODO: Allow objects to specify which sprite they transmute into
  object.sprite += 1;
}
