import { Timers } from "silmarils";
import { h } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { useUI } from "./context.jsx";
import config from "../config.js";

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

