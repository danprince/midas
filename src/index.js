import { Game } from "./game.js";
import { GameScreen } from "./screens.js";

import {
  ParticleSystem,
  AudioSystem,
  AnimationSystem,
  CameraSystem,
  RenderingSystem,
  AISystem,
  TweenSystem
} from "./systems.js";

window.systems = {
  particle: new ParticleSystem(),
  audio: new AudioSystem(),
  animation: new AnimationSystem(),
  ai: new AISystem(),
  camera: new CameraSystem(),
  render: new RenderingSystem(),
  tween: new TweenSystem(),
};

window.game = new Game();

systems.render.resize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  systems.render.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", event => {
  game.dispatch(event);
});

window.addEventListener("keydown", event => {
  game.dispatch(event);
});

game.setScreen(new GameScreen);
game.start();
