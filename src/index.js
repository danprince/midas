import { Game } from "./game.js";
import { GameScreen } from "./screens.js";
import { AISystem } from "./systems/ai.js";
import { AnimationSystem } from "./systems/animation.js";
import { AudioSystem } from "./systems/audio.js";
import { CameraSystem } from "./systems/camera.js";
import { ParticleSystem } from "./systems/particles.js";
import { RenderingSystem } from "./systems/rendering.js";
import { TweenSystem } from "./systems/tween.js";

window.systems = {
  ai: new AISystem(),
  animation: new AnimationSystem(),
  audio: new AudioSystem(),
  camera: new CameraSystem(),
  particle: new ParticleSystem(),
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
