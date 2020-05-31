import config from "./config.js";

/**
 * @typedef {object} Renderer
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 * @property {number} scale
 * @property {(width: number, height: number) => void} resize
 */

/**
 * @return {Renderer}
 */
export function createRenderer({ scale = config.scale } = {}) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.style.transform = `scale(${scale})`;

  return {
    canvas,
    ctx,
    scale,
    resize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx.imageSmoothingEnabled = false;
    }
  };
}

/**
 * @param {Renderer} renderer
 * @param {number} width
 * @param {number} height
 */
export function resizeRenderer(renderer, width, height) {
  renderer.canvas.width = width;
  renderer.canvas.height = height;
  renderer.ctx.imageSmoothingEnabled = false;
}

/**
 * @typedef {object} Texture
 * @property {HTMLImageElement} image
 * @property {number} width
 * @property {number} height
 * @property {HTMLCanvasElement} flipX
 * @property {HTMLCanvasElement} flipY
 * @property {HTMLCanvasElement} flipXY
 */

/**
 * @return {Promise<Texture>}
 */
export async function createTexture(src) {
  let image = new Image();
  image.src = src;
  await new Promise(resolve => image.onload = resolve);

  let flipXCanvas = document.createElement("canvas");
  let flipYCanvas = document.createElement("canvas");
  let flipXYCanvas = document.createElement("canvas");

  let flipXCtx = flipXCanvas.getContext("2d");
  let flipYCtx = flipYCanvas.getContext("2d");
  let flipXYCtx = flipXYCanvas.getContext("2d");

  let centerX = image.width / 2;
  let centerY = image.height / 2;

  flipXCanvas.width = flipYCanvas.width = flipXYCanvas.width = image.width;
  flipXCanvas.height = flipYCanvas.height = flipXYCanvas.height = image.height;

  flipXCtx.translate(centerX, centerY);
  flipYCtx.translate(centerX, centerY);
  flipXYCtx.translate(centerX, centerY);

  flipXCtx.scale(-1, 1);
  flipYCtx.scale(1, -1);
  flipXYCtx.scale(-1, -1);

  flipXCtx.translate(-centerX, -centerY);
  flipYCtx.translate(-centerX, -centerY);
  flipXYCtx.translate(-centerX, -centerY);

  flipXCtx.drawImage(image, 0, 0);
  flipYCtx.drawImage(image, 0, 0);
  flipXYCtx.drawImage(image, 0, 0);

  return {
    image,
    width: image.width,
    height: image.height,
    flipX: flipXCanvas,
    flipY: flipYCanvas,
    flipXY: flipXYCanvas,
  };
}

/**
 * @typedef {object} Sprite
 * @property {Texture} texture
 * @property {{ x: number, y: number, width: number, height: number }} frame
 * @property {{ x: number, y: number }} pivot
 * @property {[number, number]} translate
 * @property {[number, number]} scale
 * @property {number} rotate
 * @property {boolean} flipX
 * @property {boolean} flipY
 * @property {number} alpha
 */

export function createSprite() {

}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Sprite} sprite
 * @param {number} x
 * @param {number} y
 */
export function drawSprite(ctx, sprite, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Debug sprite frame
  //ctx.save();
  //ctx.translate(.5, .5);
  //ctx.strokeStyle = "cyan";
  //ctx.strokeRect(0, 0, sprite.frame.width - 1, sprite.frame.height - 1);
  //ctx.restore()
  //ctx.fillStyle = "magenta";
  //ctx.fillRect(sprite.pivot.x, sprite.pivot.y, 1, 1);

  ctx.translate(sprite.pivot.x, sprite.pivot.y);
  ctx.scale(sprite.scale[0], sprite.scale[1]);
  ctx.rotate(sprite.rotate);
  ctx.translate(-sprite.pivot.x, -sprite.pivot.y);
  ctx.translate(sprite.translate[0], sprite.translate[1]);
  ctx.globalAlpha = sprite.alpha;

  ctx.drawImage(
    sprite.texture.image,
    sprite.frame.x,
    sprite.frame.y,
    sprite.frame.width,
    sprite.frame.height,
    0,
    0,
    sprite.frame.width,
    sprite.frame.height,
  );

  ctx.restore();
}
