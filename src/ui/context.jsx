import { h, createContext } from "preact";
import { useState, useContext, useEffect, useRef } from "preact/hooks";

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
 * @param {(dt: number) => void} callback
 * @param {any[]} deps
 */
export function useUpdateEffect(callback, deps) {
  let { addUpdateListener, removeUpdateListener } = useContext(UIContext);

  useEffect(() => {
    addUpdateListener(callback);
    return () => removeUpdateListener(callback);
  }, deps);
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

/**
 * @template Props
 * @param {object} props
 * @param {any} props.children
 * @param {Component<Props>} props.initialScreen
 * @param {Props} [props.initialScreenProps]
 */
export function Provider({ children, initialScreen, initialScreenProps }) {
  let [screens, setScreens] = useState([
    { component: initialScreen, props: initialScreenProps }
  ]);

  let updateListenersRef = useRef([]);
  let inputListenersRef = useRef([]);

  /**
   * @type {UIContext}
   */
  let context = {
    screens,

    pushScreen(component, props) {
      let screen = { component, props };
      setScreens([...screens, screen]);
    },

    popScreen() {
      if (screens.length > 0) {
        screens = screens.slice(0, -1);
        setScreens(screens);
      }
    },

    setScreen(component, props = {}) {
      context.popScreen();
      context.pushScreen(component, props);
    },

    addUpdateListener(callback) {
      updateListenersRef.current.push(callback);
    },

    removeUpdateListener(callback) {
      updateListenersRef.current = updateListenersRef.current
        .filter(listener => listener !== callback);
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

    update(dt) {
      for (let callback of updateListenersRef.current) {
        callback(dt);
      }
    },
  };

  return (
    <UIContext.Provider value={context}>
      {children}
    </UIContext.Provider>
  );
}
