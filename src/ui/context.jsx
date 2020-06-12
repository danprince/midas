import { createContext } from "preact";
import { useState, useContext, useEffect, useRef, useReducer } from "preact/hooks";

/**
 * @type {preact.Context<UIContext>}
 */
export let UIContext = createContext(null);

/**
 * @return {UIContext}
 */
export function useUI() {
  return useContext(UIContext);
}

/**
 * @param {(event: Event) => boolean} callback
 * @param {any[]} deps
 */
export function useInputHandler(callback, deps) {
  let { addInputListener, removeInputListener } = useContext(UIContext);

  useEffect(() => {
    addInputListener(callback);
    return () => removeInputListener(callback);
  }, deps);
}

function useForceUpdate() {
  let [, setState] = useState(0);
  return () => setState(n => n + 1);
}

/**
 * Hook that allows the UI to declare its data dependencies on the game.
 * When the dependencies change (shallow equality) then the component
 * will be forced to update.
 *
 * @param {() => any[]} getDeps
 */
export function useSync(getDeps) {
  let depsRef = useRef([]);
  let forceUpdate = useForceUpdate();

  useEffect(() => {
    function handleUpdate() {
      let deps = getDeps();

      if (!shallowEqual(deps, depsRef.current)) {
        forceUpdate();
        depsRef.current = deps;
      }
    }

    game.addUpdateListener(handleUpdate);
    return () => game.removeUpdateListener(handleUpdate);
  }, [getDeps]);
}

/**
 * @param {any[]} xs
 * @param {any[]} ys
 * @return {boolean}
 */
function shallowEqual(xs, ys) {
  if (xs.length !== ys.length) {
    return false;
  }

  for (let i = 0; i < xs.length; i++) {
    if (xs[i] !== ys[i]) {
      return false;
    }
  }

  return true;
}


/**
 * @param {object} props
 * @param {any} props.children
 * @param {JSXElement} props.initialScreen
 */
export function Provider({ children, initialScreen }) {
  let [screens, setScreens] = useState([initialScreen]);
  let inputListenersRef = useRef([]);

  /**
   * @type {UIContext}
   */
  let context = {
    screens,

    pushScreen(screen) {
      setScreens([...screens, screen]);
    },

    popScreen() {
      if (screens.length > 0) {
        screens = screens.slice(0, -1);
        setScreens(screens);
      }
    },

    replaceScreen(screen) {
      context.popScreen();
      context.pushScreen(screen);
    },

    setScreen(screen) {
      setScreens([screen]);
    },

    addInputListener(callback) {
      inputListenersRef.current.push(callback);
    },

    removeInputListener(callback) {
      inputListenersRef.current = inputListenersRef.current
        .filter(listener => listener !== callback);
    },

    dispatch(event) {
      // Never want to intercept meta-key events which are probably
      // system shortcuts.
      if (event instanceof KeyboardEvent && event.metaKey) {
        return;
      }

      for (let callback of inputListenersRef.current) {
        if (callback(event) === true) {
          event.preventDefault();
          break;
        }
      }
    },
  };

  return (
    <UIContext.Provider value={context}>
      {children}
    </UIContext.Provider>
  );
}
