declare var game: import("./game").Game;

declare var systems: {
  particle: import("./systems").ParticleSystem,
  audio: import("./systems").AudioSystem,
  animation: import("./systems").AnimationSystem,
  ai: import("./systems").AISystem,
  camera: import("./systems").CameraSystem,
  render: import("./systems").RenderingSystem,
  tween: import("./systems").TweenSystem,
}

declare interface GameObject {
  extends?: string[],
  x: number,
  y: number,
  w?: number,
  h?: number,
  jump?: number,
  offsetX?: number,
  offsetY?: number,
  flipX?: boolean,
  sprite?: number,
  shadow?: boolean,
  mobile?: boolean,
  hp?: number,
  coins?: number,
  ai?: AI,
  stun?: number,
  transmuted?: boolean,
  canJump?: boolean,
  canAttack?: boolean,
  canBeAttacked?: boolean,
  canPush?: boolean,
  canBePushed?: boolean,
  canCrush?: boolean,
  canBeCrushed?: boolean,
  canBeTransmuted?: boolean,
}

declare type AI = string | { type: string, [key: string]: any };

declare interface Particle {
  x: number,
  y: number,
  vx: number,
  vy: number,
  vr: number,
  r: number,
  t: number,
  alpha?: number,
  len: number,
  sprite: number,
  w: number,
  h: number,
}

declare interface AnimatedSprite {
  x: number,
  y: number,
  w?: number,
  h?: number,
  z: number,
  speed: number,
  frame: number,
  sprite: number,
  length: number,
  counter?: number,
}

declare interface TweenState {
  [key: string]: number
}

declare interface TweenParams<State extends TweenState> {
  from: State,
  to: State,
  easing: (t: number) => number,
  duration: number,
  step(state: State): void,
  done?(): void,
}

declare interface Tween<State extends TweenState> {
  from: State,
  to: State,
  easing: (t: number) => number,
  duration: number,
  elapsed: number,
  step(state: State): void,
  done?(): void,
}
