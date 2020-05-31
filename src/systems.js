import { RNG, Easing } from "silmarils";
import { distance } from "silmarils/point";

import config from "./config.js";
import * as Actions from "./actions.js";
import * as Behaviours from "./behaviours.js";

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

export class ParticleSystem extends System {
  constructor() {
    super();

    /**
     * @type {Particle[]}
     */
    this.particles = [];
  }

  /**
   * @param {Particle} particle
   */
  add(particle) {
    if (this.enabled) {
      this.particles.push(particle);
    }
  }

  update(dt) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.t += 1;
      p.alpha = 1 - Easing.easeInQuad(p.t / p.len);

      // gravity
      p.vy += 0.002;

      return p.t < p.len;
    });
  }

  clear() {
    this.particles = [];
  }
}

export class AudioSystem extends System {
  static sounds = {
    slash: new Audio("audio/slash.ogg"),
    blockMove: new Audio("audio/blockmove.wav"),
    coins: new Audio("audio/coins.mov"),
  }

  constructor() {
    super();
    this.volume = 0.1;
  }

  /**
   * @param {keyof typeof AudioSystem["sounds"]} name
   */
  play(name) {
    if (this.enabled) {
      let sound = AudioSystem.sounds[name];
      sound.volume = this.volume;
      sound.currentTime = 0;
      sound.play();
    }
  }
}

export class AnimationSystem extends System {
  constructor() {
    super();

    /**
     * @type {AnimatedSprite[]}
     */
    this.animations = [];
  }

  /**
   * @param {AnimatedSprite} animation
   */
  add(animation) {
    this.animations.push(animation);
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    this.animations = this.animations.filter(animation => {
      if (animation.counter == null) {
        animation.counter = animation.speed;
      }

      if (animation.counter <= 0) {
        animation.frame++;
        animation.counter = animation.speed;
      } else {
        animation.counter--;
      }

      return animation.frame < animation.length;
    });
  }
}

export class CameraSystem extends System {
  constructor() {
    super();

    /**
     * @type {GameObject}
     */
    this.target = null;
  }

  update() {
    if (this.target == null) {
      return;
    }

    if (distance(game.camera, this.target) > 0) {
      let originX = game.camera.x;
      let originY = game.camera.y;
      let targetX = this.target.x + 0.5;
      let targetY = this.target.y + 0.5;

      systems.tween.add({
        duration: 300,
        from: { x: originX, y: originY },
        to: { x: targetX, y: targetY },
        easing: Easing.easeInOutSine,
        step({ x, y }) {
          game.camera.x = x;
          game.camera.y = y;
        }
      });
    }
  }
}

export class AISystem extends System {
  constructor() {
    super();
  }

  update() {
    for (let object of game.stage.objects) {
      if (object.stun > 0) {
        object.stun--;
        continue;
      }

      if (object.behaviour) {
        let handler = Behaviours[object.behaviour.type];

        handler(
          object,
          object.behaviour.state,
          object.behaviour.params,
        );
      }

      else if (object.ai) {
        let [dx, dy] = RNG.item(
          [-1, 0],
          [+1, 0],
          [0, -1],
          [0, +1],
        )

        Actions.move(object, dx, dy);
      }
    }
  }
}

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

    this.renderTiles();
    this.renderAnimationsByLayer(0);
    this.renderObjects();
    this.renderAnimationsByLayer(1);
    this.renderParticles();

    ctx.restore();

    this.renderCursor();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderTiles() {
    for (let y = 0; y < game.stage.height; y++) {
      for (let x = 0; x < game.stage.width; x++) {
        let i = x + y * game.stage.width;
        let tile = game.stage.tiles[i];

        this.drawSprite(tile, x, y);
      }
    }
  }

  renderObjects() {
    let objectsByRow = {};

    for (let object of game.stage.objects) {
      objectsByRow[object.y] = objectsByRow[object.y] || [];
      objectsByRow[object.y].push(object);
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

  renderAnimationsByLayer(z) {
    for (let animation of systems.animation.animations) {
      if (animation.z === z) {
        this.drawSprite(animation.sprite + animation.frame, animation.x, animation.y, animation.w, animation.h);
      }
    }
  }

  renderParticles() {
    let { ctx } = this;

    ctx.save();

    for (let particle of systems.particle.particles) {
      ctx.globalAlpha = particle.alpha;
      this.drawSprite(particle.sprite, particle.x, particle.y, particle.w, particle.h);
    }

    ctx.restore();
  }

  renderHud() {
    this.ctx.save();

    // Draw mouse pointer
    this.drawSprite(
      7,
      game.pointer.x / config.tileWidth / this.scale,
      game.pointer.y / config.tileHeight / this.scale
    );

    this.ctx.restore();
  }

  renderCursor() {
    this.drawSprite(
      7,
      game.pointer.x / config.tileWidth / this.scale,
      game.pointer.y / config.tileHeight / this.scale
    );
  }
}

export class TweenSystem extends System {
  constructor() {
    super();

    /**
     * @type {Tween<any>[]}
     */
    this.tweens = [];
  }

  /**
   * @template {TweenState} State
   * @param {TweenParams<State>} params
   */
  add(params) {
    if (!this.enabled) {
      if (params.done) {
        params.done();
      }
    }

    /**
      * @type {Tween<State>}
      */
    let tween = {
      easing: Easing.easeInOutLinear,
      ...params,
      elapsed: 0,
    };

    this.tweens.push(tween);
  }

  clear() {
    this.tweens = [];
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    this.tweens = this.tweens.filter(tween => {
      tween.elapsed += dt;

      let percent = Math.max(0, Math.min(1, tween.elapsed / tween.duration));
      let value = tween.easing(percent);
      let state = {};

      for (let key in tween.from) {
        let delta = tween.to[key] - tween.from[key];
        state[key] = tween.from[key] + delta * value;
      }

      tween.step(state);

      if (tween.elapsed >= tween.duration) {
        if (tween.done) {
          tween.done();
        }

        return false;
      }

      return true;
    });
  }
}
