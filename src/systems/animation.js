import { System } from "../game.js";

export class AnimationSystem extends System {
  constructor() {
    super();

    /**
     * @type {AnimatedSprite[]}
     */
    this.animations = [];
  }

  /**
   * @param {AnimatedSprite} animation
   */
  add(animation) {
    this.animations.push(animation);
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    this.animations = this.animations.filter(animation => {
      if (animation.counter == null) {
        animation.counter = animation.speed;
      }

      if (animation.counter <= 0) {
        animation.frame++;
        animation.counter = animation.speed;
      } else {
        animation.counter--;
      }

      return animation.frame < animation.length;
    });
  }
}
