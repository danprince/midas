declare type Direction = import("silmarils/direction").CardinalDirection;
declare type Point = import("silmarils/point").Point;

declare var game: import("./game").Game;

declare var systems: (typeof import("./index"))["systems"];

// Vite provides these automatically
declare var h: typeof import("preact").h;
declare var Fragment: typeof import("preact").Fragment;

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
  activeItemIndex?: number,
  items?: Item[],
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

declare interface Item {
  extends?: string[],
  id: number,
  sprite?: number,
  name?: string,
  uses?: number,
  damage?: [number, number],
  accuracy?: number,
}

type CommandHandler<T> = (object: GameObject, payload: T) => boolean;

type Command<T = any> = {
  type: string,
  payload: T,
  time: number,
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
  easing?: Easing | Record<keyof State, Easing>,
  duration: number,
  step(state: State): void,
  done?(): void,
}

declare interface Tween<State extends TweenState> extends TweenParams<State>{
  elapsed: number,
}

declare interface Save {
  turns: number,
  playerId: number,
  objectId: number,
  commands: Command[],
  stage: {
    width: number,
    height: number,
    tiles: number[],
    objects: GameObject[],
  },
}

type Component<Props = {}> = import("preact").Component<Props>;

declare type JSXElement = import("preact").JSX.Element;

declare interface UIContext {
  screens: JSXElement[],
  pushScreen(screen: JSXElement): void,
  popScreen(): void,
  replaceScreen(screen: JSXElement): void,
  setScreen(screen: JSXElement): void,
  addInputListener(callback: (event: Event) => boolean): void,
  removeInputListener(callback: (event: Event) => boolean): void,
  dispatch(event: Event): void
}

declare type ObjectTemplate = Partial<GameObject>;

declare type ItemTemplate = Partial<Item>;

declare interface LevelTemplate {
  minRooms: number,
  maxRooms: number,
  maxWidth: number,
  minWidth: number,
  maxHeight: number,
  minHeight: number,
  tags: string[],
  legend?: LevelBuilderLegend,
}

declare interface RoomTemplate {
  tags: string[],
  layout: string[],
}

declare interface LevelBuilder {
  template: LevelTemplate,
  width: number,
  height: number,
  stage: import("./stage").Stage,
  nodes: LevelBuilderNode[],
  openEdges: LevelBuilderEdge[],
  closedEdges: LevelBuilderEdge[],
}

interface LevelBuilderNode {
  id: number,
  x: number,
  y: number,
  width: number,
  height: number,
  tiles: number[],
  edges: Point[],
  placements: {
    type: LevelBuilderPlacementType,
    x: number,
    y: number,
  }[]
}

type LevelBuilderPlacementType =
  | "edge"
  | "object"
  | "entrance"

interface LevelBuilderLegend {
  [char: string]: {
    tile?: number,
    type?: LevelBuilderPlacementType,
    edge?: boolean,
  }
}

interface LevelBuilderEdge {
  from: number,
  to: number,
  x: number,
  y: number,
}
