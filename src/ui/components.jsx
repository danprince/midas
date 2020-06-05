import { h } from "preact";
import { useUI } from "./context.jsx";

/**
 * @param {object} props
 * @param {any} props.to
 * @param {boolean} [props.push]
 * @param {boolean} [props.props]
 * @param {any} props.children
 * @param {any} [props.onClick]
 */
export function Link({ to, props, push, children, onClick }) {
  let { pushScreen, setScreen } = useUI();

  return (
    <a
      onClick={(event) => {
        if (onClick) {
          onClick(event);
        }

        if (push) {
          pushScreen(to, props);
        } else {
          setScreen(to, props);
        }
      }}
    >
      {children}
    </a>
  )
}

export function SanityPortrait({ sanity, maxSanity }) {
  let percent = sanity / maxSanity;
  let index = Math.ceil(percent * 5);

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
 */
export function HudItemSlot({ sprite, label, active }) {
  let x = sprite % 10;
  let y = sprite / 10 | 0;

  let style = {
    backgroundPosition: `-${x}px -${y}px`
  };

  return (
    <div class="hud-item-slot" data-active={active}>
      <div class="hud-item" style={style}></div>
      <div class="hud-item-label outline">{label}</div>
    </div>
  );
}
