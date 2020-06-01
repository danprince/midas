import { Easing } from "silmarils";
import { System } from "../game.js";

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

  /**
   * @param {number} dt
   */
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
