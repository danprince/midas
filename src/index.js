import { Game } from "./game.js";
import { GameScreen } from "./screens.js";
import { AISystem } from "./systems/ai.js";
import { AnimationSystem } from "./systems/animation.js";
import { AudioSystem } from "./systems/audio.js";
import { CameraSystem } from "./systems/camera.js";
import { ParticleSystem } from "./systems/particles.js";
import { RenderingSystem } from "./systems/rendering.js";
import { TweenSystem } from "./systems/tween.js";
import { UISystem } from "./systems/ui.js";
import { CombatSystem } from "./systems/combat.js";
import { TransmutationSystem } from "./systems/transmutation.js";
import { MovementSystem } from "./systems/movement.js";
import { VitalitySystem } from "./systems/vitality.js";

window.systems = {
  ai: new AISystem(),
  animation: new AnimationSystem(),
  audio: new AudioSystem(),
  camera: new CameraSystem(),
  combat: new CombatSystem(),
  movement: new MovementSystem(),
  particle: new ParticleSystem(),
  render: new RenderingSystem(),
  tween: new TweenSystem(),
  transmutation: new TransmutationSystem(),
  ui: new UISystem(),
  vitality: new VitalitySystem(),
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
