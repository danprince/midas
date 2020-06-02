type CardinalDirection = import("silmarils/direction").CardinalDirection;

declare var game: import("./game").Game;

declare var systems: {
  ai: import("./systems/ai").AISystem,
  animation: import("./systems/animation").AnimationSystem,
  audio: import("./systems/audio").AudioSystem,
  autotiling: import("./systems/autotiling").AutotilingSystem,
  camera: import("./systems/camera").CameraSystem,
  particle: import("./systems/particles").ParticleSystem,
  render: import("./systems/rendering").RenderingSystem,
  tween: import("./systems/tween").TweenSystem,
}

declare interface GameObject {
  extends?: string[],
  id: number,
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
  direction?: CardinalDirection,
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
  canTransmute?: boolean,
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
  flipX?: boolean,
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

declare interface Save {
  playerId: number,
  objectId: number,
  stage: {
    width: number,
    height: number,
    tiles: number[],
    walls: number[],
    objects: GameObject[],
  },
}
