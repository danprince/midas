import { Game } from "./game.js";
import { GameScreen } from "./screens.js";
import { AISystem } from "./systems/ai.js";
import { AnimationSystem } from "./systems/animation.js";
import { AudioSystem } from "./systems/audio.js";
import { CameraSystem } from "./systems/camera.js";
import { ParticleSystem } from "./systems/particles.js";
import { RenderingSystem } from "./systems/rendering.js";
import { TweenSystem } from "./systems/tween.js";
import { CombatSystem } from "./systems/combat.js";
import { TransmutationSystem } from "./systems/transmutation.js";
import { MovementSystem } from "./systems/movement.js";
import { VitalitySystem } from "./systems/vitality.js";
import { TurnSystem } from "./systems/turn.js";
import { mount } from "./ui/root.jsx";

export let systems = {
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
  turn: new TurnSystem(),
  vitality: new VitalitySystem(),
}

export let game = new Game();

window.systems = systems;
window.game = game;

mount();
