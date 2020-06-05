import { System } from "../game.js";

export class AnimationSystem extends System {
  constructor() {
    super();

    /**
     * @type {AnimatedSprite[]}
     */
    this.animations = [];

    /**
     * @type {AnimatedText[]}
     */
    this.text = [];
  }

  /**
   * @param {AnimatedSprite} animation
   */
  add(animation) {
    this.animations.push(animation);
  }

  /**
   * @param {AnimatedText} text
   */
  addText(text) {
    this.text.push(text);
  }

  /**
   * @param {AnimatedText} text
   */
  removeText(text) {
    this.text.splice(this.text.indexOf(text), 1);
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
