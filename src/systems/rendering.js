import { Rectangle } from "silmarils";
import { System } from "../game.js";
import config from "../config.js";

export class RenderingSystem extends System {
  constructor() {
    super();

    this.canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("renderer")
    );

    this.scale = 3;

    this.ctx = this.canvas.getContext("2d");
    this.sprites = new Image();
    this.sprites.src = "assets/sprites.png";

    // Horizontal flip version of sprites
    this.flippedSprites = document.createElement("canvas");

    this.sprites.onload = () => this.preflip();

    /**
     * Keep track of the current viewport. Use this to cull objects
     * and tiles based on whether they are visible.
     */
    this.viewport = { x: 0, y: 0, width: 0, height: 0 };
  }

  // Render the spritesheet but flipped horizontally so that we can
  // quickly draw flipped sprites without needing to dynamically scale
  // them.
  preflip() {
    let { flippedSprites, sprites } = this;
    flippedSprites.width = sprites.width;
    flippedSprites.height = sprites.height;
    let ctx = flippedSprites.getContext("2d");
    ctx.translate(sprites.width / 2, sprites.height / 2);
    ctx.scale(-1, 1);
    ctx.translate(-sprites.width / 2, -sprites.height / 2);
    ctx.drawImage(sprites, 0, 0);
  }

  /**
   * @param {number} index
   * @param {number} x
   * @param {number} y
   */
  drawSprite(index, x, y, w = 1, h = 1, flipX = false) {
    /**
     * @type {HTMLImageElement | HTMLCanvasElement}
     */
    let image = this.sprites;
    let sx = (index % 10) * config.tileWidth;
    let sy = Math.floor(index / 10) * config.tileHeight;
    let sw = config.tileWidth * w;
    let sh = config.tileHeight * h;
    let dx = x * config.tileWidth | 0;
    let dy = (y - h + 1) * config.tileHeight | 0;
    let dw = config.tileWidth * w;
    let dh = config.tileHeight * h;

    if (flipX) {
      sx = this.sprites.width - sx - config.tileWidth;
      image = this.flippedSprites;
    }

    this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.canvas.width = width / this.scale;
    this.canvas.height = height / this.scale;
    this.canvas.style.transform = `scale(${this.scale})`;

    // Camera z is blurry without this
    this.ctx.imageSmoothingEnabled = false;
  }

  getCanvasCenter() {
    return {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
  }

  /**
   * Calculate the current viewport in grid coordinates.
   */
  getViewport() {
    let camera = game.camera;
    let canvasGridWidth = Math.ceil(this.canvas.width / config.tileWidth);
    let canvasGridHeight = Math.ceil(this.canvas.height / config.tileHeight);

    let x0 = Math.floor(camera.x - canvasGridWidth / 2);
    let y0 = Math.floor(camera.y - canvasGridHeight / 2);
    let x1 = x0 + canvasGridWidth + 1;
    let y1 = y0 + canvasGridHeight + 1;

    x0 = Math.max(0, x0);
    y0 = Math.max(0, y0);
    x1 = Math.min(x1, game.stage.width);
    y1 = Math.min(y1, game.stage.height);

    return {
      x: x0,
      y: y0,
      width: x1 - x0,
      height: y1 - y0,
    };
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    let { ctx } = this;

    this.clear();

    let center = this.getCanvasCenter();

    ctx.save();

    // Make the center of the canvas 0, 0
    ctx.translate(center.x, center.y);

    // Scale to the current zoom of the camera
    ctx.scale(game.camera.z, game.camera.z);

    // Offset by the camera's coordinates to put the camera at 0, 0
    ctx.translate(
      -game.camera.x * config.tileWidth,
      -game.camera.y * config.tileHeight
    );

    // Only need to calculate the current viewport once per render
    this.viewport = this.getViewport();

    this.renderTiles();
    this.renderObjects();
    this.renderAnimations();
    this.renderParticles();

    ctx.restore();

    this.renderCursor();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderTiles() {
    let x0 = this.viewport.x;
    let y0 = this.viewport.y;
    let x1 = x0 + this.viewport.width;
    let y1 = y0 + this.viewport.height;

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        let tile = game.stage.getTile(x, y);
        this.drawSprite(tile, x, y);
      }
    }
  }

  renderObjects() {
    let objectsByRow = {};

    for (let object of game.stage.objects) {
      if (Rectangle.contains(this.viewport, object)) {
        objectsByRow[object.y] = objectsByRow[object.y] || [];
        objectsByRow[object.y].push(object);
      }
    }

    for (let y = 0; y < game.stage.height; y++) {
      let objects = objectsByRow[y];

      if (objects) {
        for (let object of objects) {
          this.renderObject(object);
        }
      }
    }
  }

  /**
   * @param {GameObject} object
   */
  renderObject(object) {
    let { ctx } = this;

    ctx.save();

    let h = object.h || 1;
    let w = object.w || 1;

    if (object.offsetX || object.offsetY) {
      ctx.translate(object.offsetX * config.tileWidth, object.offsetY * config.tileHeight);
    }

    if (object.shadow) {
      this.drawSprite(14, object.x, object.y - 0.1);
    }

    ctx.save();

    if (object.jump) {
      ctx.translate(0, -object.jump * config.tileHeight);
    }

    if (object.h == null || object.h === 1) {
      this.drawSprite(object.sprite, object.x, object.y - 0.25, w, h, object.flipX);
    } else {
      this.drawSprite(object.sprite, object.x, object.y, w, h, object.flipX);
    }

    ctx.restore();

    if (object !== game.player) {
      for (let i = 0; i < object.hp; i++) {
        this.drawSprite(15, object.x + i * 6 / 16, object.y + 0.2, 5 / 16, 5 / 16);
      }
    }

    ctx.restore();
  }

  renderAnimations(z) {
    for (let animation of systems.animation.animations) {
      if (Rectangle.contains(this.viewport, animation)) {
        this.drawSprite(
          animation.sprite + animation.frame,
          animation.x,
          animation.y,
          animation.w,
          animation.h,
          animation.flipX,
        );
      }
    }
  }

  renderParticles() {
    let { ctx } = this;

    ctx.save();

    for (let particle of systems.particle.particles) {
      if (Rectangle.contains(this.viewport, particle)) {
        ctx.globalAlpha = particle.alpha;
        this.drawSprite(particle.sprite, particle.x, particle.y, particle.w, particle.h);
      }
    }

    ctx.restore();
  }

  renderCursor() {
    this.drawSprite(
      7,
      game.pointer.x / config.tileWidth / this.scale,
      game.pointer.y / config.tileHeight / this.scale
    );
  }
}
