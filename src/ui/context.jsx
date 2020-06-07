import { h, createContext } from "preact";
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

    setScreen(screen) {
      context.popScreen();
      context.pushScreen(screen);
    },

    addInputListener(callback) {
      inputListenersRef.current.push(callback);
    },

    removeInputListener(callback) {
      inputListenersRef.current = inputListenersRef.current
        .filter(listener => listener !== callback);
    },

    dispatch(event) {
      // Iterate through the listeners in reverse order so that we get
      // the ones on top of the stack first
      for (let i = inputListenersRef.current.length - 1; i >= 0; i--) {
        let callback = inputListenersRef.current[i];

        if (callback(event) === true) {
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
