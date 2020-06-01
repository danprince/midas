import { Timers } from "silmarils";
import { Stage } from "./stage.js";
import config from "./config.js";

export class Game {
  constructor() {
    /**
     * @type {Stage}
     */
    this.stage = null;

    /**
     * @type {Screen}
     */
    this.screen = null;

    this.pointer = { x: -200, y: -200 };

    /**
     * @type {GameObject}
     */
    this.player = null;

    this.camera = new Camera(0, 0);

    this.timer = null;

    this.objectId = 0;
  }

  getNextObjectId() {
    return this.objectId++;
  }

  start() {
    this.timer = Timers.animation(dt => this.update(dt));
  }

  update(dt) {
    this.screen.update(dt);
  }

  dispatch(event) {
    this.screen.handleInput(event);
  }

  setStage(stage) {
    this.stage = stage;
  }

  setScreen(screen) {
    if (this.screen) {
      this.screen.exit();
    }

    this.screen = screen;
    this.screen.enter();
  }
}

export class Screen {
  enter() {}
  exit() {}

  /**
   * @param {number} dt
   */
  update(dt) {}

  /**
   * @param {MouseEvent | KeyboardEvent} event
   */
  handleInput(event) {}
}

export class Camera {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  constructor(x, y, z = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get scale() {
    return systems.render.scale;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  screenToGrid(x, y) {
    let center = systems.render.getCanvasCenter();

    let canvasX = x / this.scale - center.x;
    let canvasY = y / this.scale - center.y;

    let gridX = canvasX / (config.tileWidth * this.z) + this.x;
    let gridY = canvasY / (config.tileHeight * this.z) + this.y;

    return {
      x: gridX,
      y: gridY,
    };
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  gridToScreen(x, y) {
    let center = systems.render.getCanvasCenter();

    let gridX = x - this.x;
    let gridY = y - this.y;

    let screenX = gridX * (config.tileWidth * this.z) + center.x;
    let screenY = gridY * (config.tileHeight * this.z) + center.y;

    screenX *= this.scale;
    screenY *= this.scale;

    return {
      x: screenX,
      y: screenY,
    };
  }
}

export class System {
  constructor() {
    /**
     * @protected
     */
    this.enabled = true;
  }

  enable() {
    this.enabled = true;
  }

  disabled() {
    this.enabled = false;
  }
}
