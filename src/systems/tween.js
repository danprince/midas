import { Easing } from "silmarils";
import { System } from "../game.js";

export class TweenSystem extends System {
  constructor() {
    super();

    /**
     * @type {Tween<any>[]}
     */
    this.tweens = [];
  }

  /**
   * @template {TweenState} State
   * @param {TweenParams<State>} params
   */
  add(params) {
    if (!this.enabled) {
      if (params.done) {
        params.done();
      }
    }

    /**
      * @type {Tween<State>}
      */
    let tween = {
      easing: Easing.easeInOutLinear,
      ...params,
      elapsed: 0,
    };

    this.tweens.push(tween);
  }

  clear() {
    this.tweens = [];
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    this.tweens = this.tweens.filter(tween => {
      tween.elapsed += dt;

      let percent = Math.max(0, Math.min(1, tween.elapsed / tween.duration));
      let value = 0;
      let state = {};

      if (typeof tween.easing === "function") {
        value = tween.easing(percent);
      }

      for (let key in tween.from) {
        if (key in tween.easing) {
          value = tween.easing[key](percent);
        }

        let delta = tween.to[key] - tween.from[key];
        state[key] = tween.from[key] + delta * value;
      }

      tween.step(state);

      if (tween.elapsed >= tween.duration) {
        if (tween.done) {
          tween.done();
        }

        return false;
      }

      return true;
    });
  }
}
