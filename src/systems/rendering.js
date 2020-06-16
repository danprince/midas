import { Rectangle } from "silmarils";
import { System } from "../game.js";
import config from "../config.js";

export class RenderingSystem extends System {
  constructor() {
    super();

    this.canvas = null;
    this.ctx = null;

    this.scale = 3;

    this.sprites = new Image();
    this.sprites.src = "sprites/atlas.png";

    // Horizontal flip version of sprites
    this.flippedSprites = document.createElement("canvas");

    this.sprites.onload = () => this.preflip();

    /**
     * Keep track of the current viewport. Use this to cull objects
     * and tiles based on whether they are visible.
     */
    this.viewport = { x: 0, y: 0, width: 0, height: 0 };
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.resizeToParent();
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

  resizeToParent() {
    // Element width/height are 0 initially, need to wait until after
    // layout pass.
    requestAnimationFrame(() => {
      let parent = this.canvas.parentElement;
      this.resize(parent.clientWidth, parent.clientHeight);
    });
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
  calculateViewport() {
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
    this.viewport = this.calculateViewport();

    this.renderTiles();
    this.renderObjects();
    this.renderAnimations();
    this.renderParticles();

    ctx.restore();

    this.drawDebugMinimap();
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

    let y0 = this.viewport.y;
    let y1 = y0 + this.viewport.height;

    for (let y = y0; y < y1; y++) {
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
      if (object.extends.includes("large")) {
        this.drawSprite(11, object.x, object.y - 0.1);
      } else {
        this.drawSprite(10, object.x, object.y - 0.1);
      }
    }

    ctx.save();

    if (object.jump) {
      ctx.translate(0, -object.jump * config.tileHeight);
    }

    if (object.mobile) {
      this.drawSprite(object.sprite, object.x, object.y - 0.25, w, h, object.flipX);
    } else {
      this.drawSprite(object.sprite, object.x, object.y, w, h, object.flipX);
    }

    ctx.restore();

    if (object.health) {
      this.renderBar(
        15,
        object.health,
        object.maxHealth,
        object.x + 0.5,
        object.y - h + 0.5,
        object.h > 1 ? 24 : 16,
        3,
      );
    }

    if (object.maxSanity) {
      this.renderBar(
        17,
        object.sanity,
        object.maxSanity,
        object.x + 0.5,
        object.y - h + 0.3,
        object.h > 1 ? 24 : 16,
        3,
      );
    }

    ctx.restore();
  }

  /**
   * @param {number} sprite
   * @param {number} value
   * @param {number} max
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  renderBar(sprite, value, max, x, y, width, height) {
    let coloredWidth = width - 2;
    let percent = value / max;
    let filledWidth = Math.ceil(percent * coloredWidth);
    let emptyWidth = coloredWidth - filledWidth;

    let x0 = 0;
    let x1 = x0 + 1;
    let x2 = x1 + filledWidth;
    let x3 = x2 + emptyWidth;

    let sx = (sprite % 10) * config.tileWidth;
    let sy = Math.floor(sprite / 10) * config.tileHeight;
    let sh = height;

    let { ctx } = this;
    ctx.save();
    ctx.translate(x * config.tileWidth, y * config.tileHeight);
    ctx.translate(-width / 2, -2);
    ctx.drawImage(this.sprites, sx,     sy, 1, sh, x0, 0, 1,           sh);
    ctx.drawImage(this.sprites, sx + 1, sy, 1, sh, x1, 0, filledWidth, sh);
    ctx.drawImage(this.sprites, sx + 2, sy, 1, sh, x2, 0, emptyWidth,  sh);
    ctx.drawImage(this.sprites, sx + 3, sy, 1, sh, x3, 0, 1,           sh);
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

    this.ctx.save();
    this.ctx.font = "12px cweb";
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.lineWidth = 3;

    for (let text of systems.animation.text) {
      if (Rectangle.contains(this.viewport, text)) {
        let x = Math.round((text.x + 0.5) * config.tileWidth) + 0.5;
        let y = Math.round((text.y + 0.5) * config.tileHeight) + 0.5;
        this.ctx.globalAlpha = text.alpha;
        this.ctx.fillStyle = text.color || "white";
        this.ctx.strokeText(text.text, x, y);
        this.ctx.fillText(text.text, x, y);
      }
    }

    this.ctx.restore();
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

  drawDebugMinimap() {
    let ctx = this.ctx;

    ctx.save();
    ctx.translate(0, this.canvas.height);
    ctx.scale(2, 2);
    ctx.translate(0, -game.stage.height)

    for (let x = 0; x < game.stage.width; x++) {
      for (let y = 0; y < game.stage.height; y++) {
        let tile = game.stage.getTile(x, y);

        if (tile >= 20 && tile <= 30) {
          ctx.fillStyle = "#1a1b2d";
        } else {
          continue;
        }

        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.restore();
  }
}
