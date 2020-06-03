import { System } from "../game.js";

/**
 * @type {typeof document.querySelector}
 */
let $ = selector => document.querySelector(selector);

/**
 * @type {(selector: string) => HTMLElement[]}
 */
let $all = selector => Array.from(document.querySelectorAll(selector));

export class UISystem extends System {
  setHealth(value, maxValue) {
    let percent = value / maxValue * 100;
    $("#hud-health-bar .bar-label").innerText = `${value}/${maxValue}`;
    $("#hud-health-bar .bar-filled").style.width = `${percent}%`;
    $("#hud-health-bar .bar-empty").style.width = `${100 - percent}%`;
  }

  setSanity(value, maxValue) {
    let percent = value / maxValue * 100;
    $("#hud-sanity-bar .bar-label").innerText = `${value}/${maxValue}`;
    $("#hud-sanity-bar .bar-filled").style.width = `${percent}%`;
    $("#hud-sanity-bar .bar-empty").style.width = `${100 - percent}%`;

    let portrait = $("#hud-midas-face");

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

  setLocation(name) {
    $("#hud-location").innerText = name;
  }

  setCoins(coins) {
    $("#hud-coins-label").innerText = coins;
  }

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

  setItemSlot(index, sprite) {
    let itemSlots = $all(".hud-item-slot");

    let itemSlot = itemSlots[index];

    if (itemSlot) {
      let item = itemSlot.querySelector(".hud-item");
      let x = sprite % 10;
      let y = sprite / 10 | 0;
      item.style.backgroundPosition = `-${x}px -${y}px`;
    }
  }
}
