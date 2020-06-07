import { Stage } from "./stage.js";
import config from "./config.js";
import * as Commands from "./commands.js";

export class Game {
  constructor() {
    /**
     * @type {Stage}
     */
    this.stage = null;

    /**
     * @type {GameObject}
     */
    this.player = null;

    this.camera = new Camera(0, 0);

    this.objectId = 0;

    /**
     * @type {Command[]}
     */
    this.commands = [];

    /**
     * @type {((dt: number) => any)[]}
     */
    this.updateListeners = [];
  }

  getNextObjectId() {
    return this.objectId++;
  }

  /**
   * @param {Stage} stage
   */
  setStage(stage) {
    this.stage = stage;
  }

  /**
   * @return {Save}
   */
  serialize() {
    return {
      playerId: this.player.id,
      objectId: this.objectId,
      stage: this.stage,
      commands: this.commands,
    };
  }

  /**
   * @param {Save} save
   */
  deserialize(save) {
    this.stage = new Stage(save.stage.width, save.stage.height, 0);
    this.stage.tiles = save.stage.tiles;
    this.stage.objects = save.stage.objects;
    this.objectId = save.objectId;
    this.player = this.stage.getObjectById(save.playerId);
    this.commands = save.commands;

    systems.camera.target = this.player;
    systems.camera.update();
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    systems.render.update(dt);
    systems.particle.update(dt);
    systems.animation.update(dt);
    systems.tween.update(dt);

    for (let listener of this.updateListeners) {
      listener(dt);
    }
  }

  turn() {
    systems.ai.update();
    systems.camera.update();
  }

  /**
   * @template T
   * @param {CommandHandler<T>} handler
   * @param {T} [payload]
   * @return {boolean}
   */
  dispatch(handler, payload) {
    /**
     * @type {Command<T>}
     */
    let command = {
      time: Date.now(),
      type: handler.name,
      payload,
    };

    this.commands.push(command);

    return this.executeCommand(command);
  }

  /**
   * @private
   * @param {Command} command
   * @return {boolean}
   */
  executeCommand(command) {
    let handler = Commands[command.type];
    let result = handler(game.player, command.payload);

    // If the command was executed succesfully, then update the state
    // of the world.
    if (result) {
      this.turn();
    }

    return result;
  }

  /**
   * @param {(dt: number) => any} callback
   */
  addUpdateListener(callback) {
    this.updateListeners.push(callback);
  }

  /**
   * @param {(dt: number) => any} callback
   */
  removeUpdateListener(callback) {
    let index = this.updateListeners.indexOf(callback);
    this.updateListeners.splice(index, 1);
  }
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
  screenToExactGrid(x, y) {
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
  screenToGrid(x, y) {
    let gridCoords = this.screenToExactGrid(x, y);

    return {
      x: Math.floor(gridCoords.x),
      y: Math.floor(gridCoords.y),
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
