import { RNG, Easing } from "silmarils";

export class VitalitySystem {
  /**
   * @param {GameObject} object
   * @param {number} amount
   * @param {GameObject} [attacker]
   */
  damage(object, amount, attacker) {
    this.setHealth(object, object.health - amount);

    let color = "red";
    let label = amount.toString();

    if (amount === 0) {
      label = "Miss";
      color = "white";
    } else if (amount < 0) {
      label = Math.abs(amount).toString();
      color = "green";
    }

    let text = {
      x: object.x,
      y: object.y,
      text: label,
      color: color,
      alpha: 1,
    };

    systems.tween.add({
      from: {
        x: object.x,
        y: object.y - 0.5
      },
      to: {
        x: object.x + RNG.float(-1, 1),
        y: object.y + RNG.float(0, 0.5),
      },
      easing: {
        x: Easing.easeOutSine,
        y: Easing.easeOutBounce,
      },
      duration: 800,
      step({ x, y }) {
        text.x = x;
        text.y = y;
      },
      done() {
        systems.animation.removeText(text);
      }
    });

    systems.animation.addText(text);
  }

  /**
   * @param {GameObject} object
   * @param {number} amount
   */
  changeSanity(object, amount) {
    this.setSanity(object, object.sanity + amount);
  }

  /**
   * @param {GameObject} object
   * @param {number} health
   */
  setHealth(object, health) {
    let { maxHealth = Infinity } = object;
    object.health = clamp(health, 0, maxHealth);
  }

  /**
   * @param {GameObject} object
   * @param {number} sanity
   */
  setSanity(object, sanity) {
    let { maxSanity = Infinity } = object;
    object.sanity = clamp(sanity, 0, maxSanity);
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
