import { Easing, Direction } from "silmarils";
import { useEffect, useState } from "preact/hooks";
import { useUI, useInputHandler, useSync } from "./context.jsx";
import { Renderer, Link, SanityPortrait, HudBar, HudItemSlot, GridCellContextMenu, Panel, Overlay } from "./components.jsx";

import config from "../config.js";
import { Game } from "../game.js";
import { load, save, hasSave } from "../storage.js";
import * as Levels from "../levels.js";
import * as Commands from "../commands.js";
import * as ObjectBuilder from "../builders/object-builder.js";
import * as ItemBuilder from "../builders/item-builder.js";

export function MainMenuScreen() {
  let { setScreen } = useUI();

  function loadGame() {
    load();
  }

  function newGame() {
    game = new Game();
    game.stage = Levels.sandbox();
    game.player = ObjectBuilder.build("midas");
    game.stage.add(game.player, 0, 0);
    systems.camera.target = game.player;
    game.player.items = [ItemBuilder.build("sword")];

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
      <Panel>
        <div style="display: flex; flex-direction: column; text-align: center">
          <Link to={GameScreen} onClick={loadGame}>Continue</Link>
          <Link to={GameScreen} onClick={newGame}>New Game</Link>
          <Link to={SettingsScreen}>Settings</Link>
        </div>
      </Panel>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div class="screen">
      <Panel>
        <strong>Settings</strong>
        <hr />
        <label>Audio</label>
        <div>
          <input type="checkbox" id="disable_sounds" />
          <label for="disable_sounds">Disable Sounds</label>
        </div>
        <div>
          <input type="radio" id="hello" name="radio" />
          <label for="hello">Hello radio</label>
        </div>
        <div>
          <input type="radio" id="hello2" name="radio" />
          <label for="hello2">Hello radio2</label>
        </div>
        <input type="text"/>
        <hr />
        <Link to={MainMenuScreen}>
          Back
        </Link>
      </Panel>
    </div>
  );
}

export function GameScreen() {
  let { setScreen, pushScreen } = useUI();

  useEffect(() => {
    onbeforeunload = () => save();
  }, []);

  useInputHandler(event => {
    if (event instanceof KeyboardEvent) {
      switch (event.key) {
        case config.keyCancel:
          save();
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
        default:
          return false;
      }
    }

    if (event instanceof MouseEvent) {
      let { x, y } = game.camera.screenToGrid(event.clientX, event.clientY);

      if (x === game.player.x && y === game.player.y) {
        return;
      }

      if (event.type === "mousedown") {
        let vector = [x - game.camera.x, y - game.camera.y];
        let direction = Direction.cardinalFromVector(vector);
        game.dispatch(Commands.move, direction);
      }
    }

    return true;
  }, []);

  useSync(() => [
    game.player.sanity,
    game.player.maxSanity,
    game.player.health,
    game.player.maxHealth,
    game.player.coins,
    game.player.items,
    game.player.activeItemIndex,
  ]);

  // TODO: Think about whether this is really the place that this should
  // be handled. Would it make more sense for the game to monitor the
  // game over state and message the UI or set a flag when that happens?
  useEffect(() => {
    if (game.player.health === 0) {
      pushScreen(<GameOverScreen />);
    }
  }, [game.player.health]);

  let [contextMenu, setContextMenu] = useState(null);

  /**
   * @param {MouseEvent} event
   */
  function handleContextMenu(event) {
    event.preventDefault();

    let { x, y } = game.camera.screenToGrid(event.clientX, event.clientY);

    setContextMenu(
      <GridCellContextMenu
        x={x}
        y={y}
        onRequestClose={() => setContextMenu(null)}
      />
    );
  }

  return (
    <div class="game-screen" onContextMenu={handleContextMenu}>
      {contextMenu}
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
                <img src="sprites/icon_coin.png" />
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

export function GameOverScreen() {
  return (
    <Overlay>
      <Panel>
        <h1>Game Over</h1>
        <Link to={MainMenuScreen}>
          Continue
        </Link>
      </Panel>
    </Overlay>
  );
}
