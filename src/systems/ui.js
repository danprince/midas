import { System } from "../game.js";

/**
 * @type {(selector: string) => HTMLElement}
 */
let $ = selector => document.querySelector(selector);

/**
 * @type {(selector: string) => HTMLElement[]}
 */
let $all = selector => Array.from(document.querySelectorAll(selector));

export class UISystem extends System {
  /**
   * @param {number} value
   * @param {number} maxValue
   */
  setHealth(value, maxValue) {
    let percent = value / maxValue * 100;
    $("#hud-health-bar .bar-label").innerText = `${value}/${maxValue}`;
    $("#hud-health-bar .bar-filled").style.width = `${percent}%`;
    $("#hud-health-bar .bar-empty").style.width = `${100 - percent}%`;
  }

  /**
   * @param {number} value
   * @param {number} maxValue
   */
  setSanity(value, maxValue) {
    let percent = value / maxValue * 100;
    $("#hud-sanity-bar .bar-label").innerText = `${value}/${maxValue}`;
    $("#hud-sanity-bar .bar-filled").style.width = `${percent}%`;
    $("#hud-sanity-bar .bar-empty").style.width = `${100 - percent}%`;

    let portrait = /** @type {HTMLImageElement} */($("#hud-midas-face"));

    if (percent === 100) {
      portrait.src = "/sprites/midas_face_1.png";
    } else if (percent > 75) {
      portrait.src = "/sprites/midas_face_2.png";
    } else if (percent > 50) {
      portrait.src = "/sprites/midas_face_3.png";
    } else if (percent > 25) {
      portrait.src = "/sprites/midas_face_4.png";
    } else {
      portrait.src = "/sprites/midas_face_5.png";
    }
  }

  /**
   * @param {string} name
   */
  setLocation(name) {
    $("#hud-location").innerText = name;
  }

  /**
   * @param {number} coins
   */
  setCoins(coins) {
    $("#hud-coins-label").innerText = String(coins);
  }

  /**
   * @param {number} index
   */
  setActiveItem(index) {
    let activeSlot = $(".hud-item-slot-active");

    if (activeSlot) {
      activeSlot.classList.remove("hud-item-slot-active");
    }

    let itemSlots = $all(".hud-item-slot");

    let itemSlot = itemSlots[index];

    if (itemSlot) {
      itemSlot.classList.add("hud-item-slot-active");
    }
  }

  /**
   * @param {number} index
   * @param {number} sprite
   */
  setItemSlot(index, sprite) {
    let itemSlots = $all(".hud-item-slot");

    let itemSlot = itemSlots[index];

    if (itemSlot) {
      /**
       * @type {HTMLElement}
       */
      let item = itemSlot.querySelector(".hud-item");
      let x = sprite % 10;
      let y = sprite / 10 | 0;
      item.style.backgroundPosition = `-${x}px -${y}px`;
    }
  }
}
