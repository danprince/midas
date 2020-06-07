import { build } from "./registry.js";

export class Stage {
  /**
   * @param {number} width
   * @param {number} height
   * @param {number} tile
   */
  constructor(width, height, tile) {
    /**
     * @readonly
     * @type {number}
     */
    this.width = width;

    /**
     * @readonly
     * @type {number}
     */
    this.height = height;

    /**
     * @type {number[]}
     */
    this.tiles = Array.from({ length: width * height }).fill(tile);

    /**
     * @type {GameObject[]}
     */
    this.objects = [];

    /**
     * @private
     * @type {Map<number, GameObject>}
     */
    this.objectsByTile = new Map();

    /**
     * @private
     * @type {Map<number, GameObject>}
     */
    this.objectsById = new Map();
  }

  /**
   * @param {string} id
   * @param {number} x
   * @param {number} y
   */
  spawn(id, x, y) {
    let object = build(id);
    this.add(object, x, y);
    return object;
  }

  /**
   * @param {GameObject} object
   * @param {number} x
   * @param {number} y
   */
  add(object, x = object.x, y = object.y) {
    object.x = x;
    object.y = y;
    this.objects.push(object);
    this.objectsByTile.set(x + y * this.width, object);
    this.objectsById.set(object.id, object);
  }

  /**
   * @param {GameObject} object
   */
  remove(object) {
    this.objects.splice(this.objects.indexOf(object), 1);
    this.objectsByTile.delete(object.x + object.y * this.width);
    this.objectsById.delete(object.id);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} tile
   */
  setTile(x, y, tile) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      this.tiles[x + y * this.width] = tile;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @return {number}
   */
  getTile(x, y) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      return this.tiles[x + y * this.width];
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @return {GameObject}
   */
  getObjectAt(x, y) {
    return this.objectsByTile.get(x + y * this.width);
  }

  /**
   * @param {number} id
   * @return {GameObject}
   */
  getObjectById(id) {
    return this.objectsById.get(id);
  }

  /**
   * @param {GameObject} object
   * @param {number} x
   * @param {number} y
   */
  move(object, x, y) {
    let oldIndex = object.x + object.y * this.width;
    let newIndex = x + y * this.width;
    object.x = x;
    object.y = y;
    this.objectsByTile.delete(oldIndex);
    this.objectsByTile.set(newIndex, object);
  }

  /**
   * Reindex objects on the stage (after a stage is loaded etc)
   */
  updateObjectIndexes() {
    for (let object of this.objects) {
      let index = object.x + object.y * this.width;
      this.objectsByTile.set(index, object);
      this.objectsById.set(object.id, object);
    }
  }
}
