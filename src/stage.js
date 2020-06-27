import * as ObjectBuilder from "./builders/object-builder.js";
import * as TileBuilder from "./builders/tile-builder.js";

export class Stage {
  /**
   * @param {number} width
   * @param {number} height
   * @param {string} [tileType]
   */
  constructor(width, height, tileType) {
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
     * @type {Tile[]}
     */
    this.tiles = tileType
      ? Array.from({ length: width * height }, () => TileBuilder.build(tileType))
      : Array.from({ length: width * height });

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
    let object = ObjectBuilder.build(id);
    this.add(object, x, y);
    return object;
  }

  /**
   * @param {GameObject} object
   * @param {number} x
   * @param {number} y
   */
  add(object, x = object.x, y = object.y) {
    let existingObject = this.getObjectAt(x, y);

    if (existingObject) {
      this.remove(existingObject);
    }

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
   * @param {string} type
   */
  setTileType(x, y, type) {
    let tile = TileBuilder.build(type);
    this.setTile(x, y, tile);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Tile} tile
   */
  setTile(x, y, tile) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      this.tiles[x + y * this.width] = tile;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @return {Tile}
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
