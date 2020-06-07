import { Easing, Direction } from "silmarils";
import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useUI, useInputHandler } from "./context.jsx";
import { Renderer, Link, SanityPortrait, HudBar, HudItemSlot } from "./components.jsx";

import config from "../config.js";
import { Game } from "../game.js";
import * as Levels from "../levels.js";
import * as Commands from "../commands.js";
import { load, save } from "../storage.js";
import { build, buildItem } from "../registry.js";

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
    game.player.items = [buildItem("sword")];

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

  useEffect(() => {
    onbeforeunload = () => save();
  }, []);

  useInputHandler(event => {
    if (event instanceof KeyboardEvent) {
      switch (event.key) {
        case config.keyCancel:
          setScreen(<MainMenuScreen />);
          break;
        case config.keyLeft:
          game.dispatch(Commands.move, Direction.WEST);
          break;
        case config.keyRight:
          game.dispatch(Commands.move, Direction.EAST);
          break;
        case config.keyUp:
          game.dispatch(Commands.move, Direction.NORTH);
          break;
        case config.keyDown:
          game.dispatch(Commands.move, Direction.SOUTH);
          break;
        case config.keyRest:
          game.dispatch(Commands.rest);
          break;
        case config.keyItem1:
          game.dispatch(Commands.setActiveItem, 0);
          break;
        case config.keyItem2:
          game.dispatch(Commands.setActiveItem, 1);
          break;
        case config.keyItem3:
          game.dispatch(Commands.setActiveItem, 2);
          break;
      }
    }

    return true;
  }, []);

  return (
    <div class="game-screen">
      <div class="viewport">
        <Renderer />
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
            <HudItemSlot
              label="1"
              sprite={game.player.items[0] && game.player.items[0].sprite}
              active={game.player.activeItemIndex === 0}
              onClick={() => game.dispatch(Commands.setActiveItem, 0)}
            />
            <HudItemSlot
              label="2"
              sprite={game.player.items[1] && game.player.items[1].sprite}
              active={game.player.activeItemIndex === 1}
              onClick={() => game.dispatch(Commands.setActiveItem, 1)}
            />
            <HudItemSlot
              label="3"
              sprite={game.player.items[2] && game.player.items[2].sprite}
              active={game.player.activeItemIndex === 2}
              onClick={() => game.dispatch(Commands.setActiveItem, 2)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
