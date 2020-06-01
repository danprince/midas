import { System } from "../game.js";

export class AudioSystem extends System {
  static sounds = {
    slash: new Audio("audio/slash.ogg"),
    blockMove: new Audio("audio/blockmove.wav"),
    coins: new Audio("audio/coins.mov"),
  }

  constructor() {
    super();
    this.volume = 0.1;
  }

  /**
   * @param {keyof typeof AudioSystem["sounds"]} name
   */
  play(name) {
    if (this.enabled) {
      let sound = AudioSystem.sounds[name];
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play();
    }
  }
}
