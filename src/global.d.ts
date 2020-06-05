declare type Direction = import("silmarils/direction").CardinalDirection;

declare var game: import("./game").Game;

declare var systems: (typeof import("./index"))["systems"];

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

declare interface UIScreen<Props> {
  component: import("preact").Component<Props>,
  props: Props,
}

type Component<Props = {}> = import("preact").Component<Props>;

declare interface UIContext {
  screens: UIScreen<any>[],
  pushScreen<Props = {}>(component: Component<Props>, props: Props): void,
  popScreen(): void,
  setScreen<Props = {}>(component: Component<Props>, props?: Props): void,
  addUpdateListener(callback: (dt: number) => void): void,
  removeUpdateListener(callback: (dt: number) => void): void,
  addInputListener(callback: (event: Event) => boolean): void,
  removeInputListener(callback: (event: Event) => boolean): void,
  update(dt: number): void
  dispatch(event: Event): void
}
