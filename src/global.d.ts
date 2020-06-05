declare type Direction = import("silmarils/direction").CardinalDirection;

declare var game: import("./game").Game;

declare var systems: {
  ai: import("./systems/ai").AISystem,
  animation: import("./systems/animation").AnimationSystem,
  audio: import("./systems/audio").AudioSystem,
  camera: import("./systems/camera").CameraSystem,
  combat: import("./systems/combat").CombatSystem,
  movement: import("./systems/movement").MovementSystem,
  particle: import("./systems/particles").ParticleSystem,
  render: import("./systems/rendering").RenderingSystem,
  vitality: import("./systems/vitality").VitalitySystem,
  transmutation: import("./systems/transmutation").TransmutationSystem,
  tween: import("./systems/tween").TweenSystem,
  ui: import("./systems/ui").UISystem,
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
  direction?: Direction,
  mobile?: boolean,
  health?: number,
  maxHealth?: number,
  sanity?: number,
  maxSanity?: number,
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

declare interface AnimatedText {
  x: number,
  y: number,
  text: string,
  color?: string,
  alpha?: number,
}

type Easing = (t: number) => number;

declare interface TweenState {
  [key: string]: number
}

declare interface TweenParams<State extends TweenState> {
  from: State,
  to: State,
  easing: Easing | Record<keyof State, Easing>,
  duration: number,
  step(state: State): void,
  done?(): void,
}

declare interface Tween<State extends TweenState> extends TweenParams<State>{
  elapsed: number,
}

declare interface Save {
  playerId: number,
  objectId: number,
  stage: {
    width: number,
    height: number,
    tiles: number[],
    objects: GameObject[],
  },
}
