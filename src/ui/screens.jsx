import { Easing, Direction } from "silmarils";
import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useUI, useInputHandler, useUpdateEffect } from "./context.jsx";
import { Link, SanityPortrait, HudBar, HudItemSlot } from "./components.jsx";

import config from "../config.js";
import { Game } from "../game.js";
import * as Levels from "../levels.js";
import { load } from "../storage.js";
import { build } from "../registry.js";

export function MainMenuScreen() {
  let { setScreen } = useUI();

  function loadGame() {
    load();
  }

  function newGame() {
    game = new Game();
    game.stage = Levels.sandbox();
    game.player = build("midas");
    game.stage.add(game.player, 0, 0);
    systems.camera.target = game.player;

    // Drop midas in from above the map
    systems.tween.add({
      from: { jump: 5 },
      to: { jump: 0 },
      easing: Easing.easeOutExp,
      duration: 500,
      step({ jump }) {
        game.player.jump = jump;
      },
      done() {
        systems.transmutation.transmuteTile(0, 0)
      }
    });
  }

  return (
    <div class="screen main-menu">
      <h1>Main Menu</h1>
      <Link to={GameScreen} onClick={loadGame}>Continue</Link>
      <Link to={GameScreen} onClick={newGame}>New Game</Link>
      <Link to={SettingsScreen}>Settings</Link>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div class="screen">
      <h1>Settings</h1>
      <Link to={MainMenuScreen}>Back</Link>
    </div>
  );
}

export function GameScreen() {
  let { setScreen } = useUI();

  useUpdateEffect(dt => {
    systems.render.update(dt);
    systems.particle.update(dt);
    systems.animation.update(dt);
    systems.tween.update(dt);
  }, []);

  useInputHandler(event => {
    let success = false;

    /**
      * @param {Direction} direction
      */
    let move = (direction) => systems.movement.move(game.player, direction);

    if (event instanceof KeyboardEvent) {
      switch (event.key) {
        case config.keyCancel:
          setScreen(<MainMenuScreen />);
          break;
        case config.keyLeft:
          success = move(Direction.WEST);
          break;
        case config.keyRight:
          success = move(Direction.EAST);
          break;
        case config.keyUp:
          success = move(Direction.NORTH);
          break;
        case config.keyDown:
          success = move(Direction.SOUTH);
          break;
        case config.keyRest:
          success = true;
          break;
      }

      if (success) {
        systems.turn.update();
      }
    }

    return true;
  }, []);

  /**
   * @param {HTMLCanvasElement} canvas
   */
  function initRenderer(canvas) {
    if (canvas) {
      systems.render.init(canvas);
    }
  }

  useEffect(() => {
    function handleResize() {
      systems.render.resizeToParent();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div class="game-screen">
      <div class="viewport">
        <canvas ref={initRenderer} />
        <div class="hud">
          <div class="hud-top-left">
            <SanityPortrait sanity={game.player.sanity} maxSanity={game.player.maxSanity} />

            <HudBar color="red" value={game.player.health} max={game.player.maxHealth}>
              {game.player.health}/{game.player.maxHealth}
            </HudBar>

            <HudBar color="gold" value={game.player.sanity} max={game.player.maxSanity}>
              {game.player.sanity}/{game.player.maxSanity}
            </HudBar>
          </div>

          <div class="hud-top-right">
            <div class="hud-stats">
              <div class="hud-stat">
                <img src="/sprites/icon_coin.png" />
                <span id="hud-coins-label" class="outline">
                  {game.player.coins}
                </span>
              </div>
            </div>
          </div>

          <div class="hud-bottom">
            <HudItemSlot label="1" />
            <HudItemSlot label="2" />
            <HudItemSlot label="3" active />
          </div>
        </div>
      </div>
    </div>
  );
}
