import { Timers } from "silmarils";
import { createPortal } from "preact/compat";
import { useRef, useEffect, useState } from "preact/hooks";
import { useUI } from "./context.jsx";
import config from "../config.js";

import Objects from "../data/objects.json";

export function Renderer() {
  let canvasRef = useRef(/** @type {HTMLCanvasElement} */(null));

  useEffect(() => {
    if (canvasRef.current) {
      systems.render.init(canvasRef.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    let resize = () => systems.render.resizeToParent();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let timer = Timers.animation(dt => game.update(dt));
    return () => timer.stop();
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
}

/**
 * @param {object} props
 * @param {preact.ComponentType} props.to
 * @param {boolean} [props.push]
 * @param {any} props.children
 * @param {any} [props.onClick]
 */
export function Link({ to, push, children, onClick }) {
  let { pushScreen, setScreen } = useUI();

  let screen = h(to, {});

  return (
    <a
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }

        if (push) {
          pushScreen(screen);
        } else {
          setScreen(screen);
        }
      }}
    >
      {children}
    </a>
  )
}

export function SanityPortrait({ sanity, maxSanity }) {
  let percent = sanity / maxSanity;
  let index = 1;

  if (percent === 1) {
    index = 1;
  } else if (percent > 0.75) {
    index = 2;
  } else if (percent > 0.5) {
    index = 3;
  } else if (percent > 0.25) {
    index = 4
  } else {
    index = 5;
  }

  return (
    <div class="hud-portrait">
      <img src={`/sprites/midas_face_${index}.png`} />
    </div>
  );
}

export function HudBar({ color, value, max, children }) {
  let percent = value / max * 100;

  return (
    <div class={`bar ${color}-bar`}>
      <div class="bar-start"></div>
      <div class="bar-track">
        <div class="bar-filled" style={{ width: `${percent}%` }}></div>
        <div class="bar-empty" style={{ width: `${100 - percent}%` }}></div>
      </div>
      <div class="bar-end"></div>
      <div class="bar-label outline">{children}</div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {number} [props.sprite]
 * @param {any} [props.label]
 * @param {boolean} [props.active]
 * @param {(event: MouseEvent) => any} [props.onClick]
 *
 */
export function HudItemSlot({ sprite, label, active, onClick }) {
  let x = (sprite % 10) * config.tileWidth;
  let y = (sprite / 10 | 0) * config.tileHeight;

  let style = {
    backgroundPosition: `-${x}px -${y}px`
  };

  return (
    <div class="hud-item-slot" data-active={active} onClick={onClick}>
      <div class="hud-item" style={style}></div>
      <div class="hud-item-label outline">{label}</div>
    </div>
  );
}

export function GridAnchor({ x, y, children }) {
  let gridCoords = game.camera.gridToScreen(x, y);

  let style = {
    left: `${gridCoords.x}px`,
    top: `${gridCoords.y}px`,
  };

  return (
    <div class="grid-anchor" style={style}>{children}</div>
  );
}

/**
 * @param {object} props
 * @param {any} props.children
 * @param {(event: MouseEvent) => any} [props.onRequestClose]
 */
export function ContextMenu({ children, onRequestClose }) {
  return (
    <ul class="context-menu" onMouseLeave={onRequestClose}>
      {children}
    </ul>
  );
}

/**
 * @param {object} props
 * @param {any} props.children
 * @param {any} [props.items]
 * @param {(event: MouseEvent) => any} [props.onClick]
 */
export function ContextMenuItem({ children, items = [], onClick }) {
  let [expanded, setExpanded] = useState(false);

  return (
    <li
      class="context-menu-item"
      onClick={onClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {children}
      {expanded && items.length > 0 && (
        <ContextMenu onRequestClose={() => setExpanded(false)}>
          {items}
        </ContextMenu>
      )}
    </li>
  );
}

export function ContextMenuDivider() {
  return (
    <hr class="context-menu-divider" />
  );
}

export function GridCellContextMenu({ x, y, onRequestClose }) {
  let object = game.stage.getObjectAt(x, y);

  let spawnMenu = Object.keys(Objects).map(id => {
    return (
      <ContextMenuItem onClick={() => game.stage.spawn(id, x, y)}>
        {id}
      </ContextMenuItem>
    );
  });

  function teleport() {
    game.stage.move(game.player, x, y);
  }

  return (
    <GridAnchor x={x + 1} y={y}>
      <ContextMenu onRequestClose={onRequestClose}>
        <ContextMenuItem>
          x: {x} y: {y}
        </ContextMenuItem>
        <ContextMenuItem onClick={teleport}>
          Teleport
        </ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem items={spawnMenu}>Spawn</ContextMenuItem>
        {object && <ContextMenuDivider />}
        {object && (
          <ContextMenuItem
            onClick={() => console.log(object)}
            items={[
              <ContextMenuItem onClick={() => game.stage.remove(object)}>Despawn</ContextMenuItem>
            ]}
          >
            #{object.id}
          </ContextMenuItem>
        )}
      </ContextMenu>
    </GridAnchor>
  );
}

export function Panel({ children }) {
  return (
    <div class="panel">
      {children}
    </div>
  );
}

export function Overlay({ children }) {
  let container = document.getElementById("portal");

  return createPortal(
    <div class="overlay">{children}</div>,
    container,
  );
}
