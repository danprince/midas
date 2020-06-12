import { System } from "../game.js";

const sounds = {
  slash: new Audio("audio/slash.ogg"),
  blockMove: new Audio("audio/blockmove.wav"),
  coins: new Audio("audio/coins.mov"),
}

export class AudioSystem extends System {
  constructor() {
    super();
    this.volume = 0.1;
  }

  /**
   * @param {keyof typeof sounds} name
   */
  play(name) {
    if (this.enabled) {
      let sound = sounds[name];
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play();
    }
  }
}
