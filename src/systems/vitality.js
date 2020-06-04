export class VitalitySystem {
  /**
   * @param {GameObject} object
   * @param {number} amount
   * @param {GameObject} [attacker]
   */
  damage(object, amount, attacker) {
    this.setHealth(object, object.health - amount);
  }

  /**
   * @param {GameObject} object
   * @param {number} health
   */
  setHealth(object, health) {
    let { maxHealth = Infinity } = object;
    object.health = clamp(health, 0, maxHealth);

    if (object === game.player) {
      systems.ui.setHealth(game.player.health, game.player.maxHealth);
    }
  }

  /**
   * @param {GameObject} object
   * @param {number} sanity
   */
  setSanity(object, sanity) {
    let { maxSanity = Infinity } = object;
    object.sanity = clamp(sanity, 0, maxSanity);

    if (object === game.player) {
      systems.ui.setSanity(game.player.sanity, game.player.maxSanity);
    }
  }
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
