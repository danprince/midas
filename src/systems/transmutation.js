import { RNG } from "silmarils";

export class TransmutationSystem {
  /**
   * @param {number} x
   * @param {number} y
   */
  transmuteTile(x, y) {
    let tile = game.stage.getTile(x, y);

    switch (tile) {
      case 20:
      case 22:
        game.stage.setTile(x, y, tile + 1);
        break;
      default:
        return;
    }

    let coins = RNG.int(3, 7);

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
  transmuteObject(object) {
    object.transmuted = true;
    object.ai = null;
    object.shadow = false;

    object.canBeAttacked = false;
    object.canJump = false;

    // Golden statues can be pushed if they were originally mobile.
    // Don't want transmuted walls to become pushable though
    if (object.mobile) {
      object.mobile = false;
      object.canBePushed = true;
    }

    // TODO: Allow objects to specify which sprite they transmute into
    object.sprite += 1;

    systems.audio.play("coins");

    for (let i = 0; i < RNG.int(3, 7); i++) {
      systems.particle.add({
        x: object.x + 0.5,
        y: object.y - 0.3,
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
  }
}
