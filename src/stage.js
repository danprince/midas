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
  }

  /**
   * @param {GameObject} object
   * @param {number} x
   * @param {number} y
   */
  spawn(object, x = object.x, y = object.y) {
    if (x != null) {
      object.x = x;
    }

    if (y != null) {
      object.y = y;
    }

    this.objects.push(object);
  }

  /**
   * @param {GameObject} object
   */
  despawn(object) {
    this.objects.splice(this.objects.indexOf(object), 1);
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
    return this.objects.find(object => object.x === x && object.y === y);
  }
}
