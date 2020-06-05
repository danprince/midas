import { h, createContext } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";

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

  let [updateListeners, setUpdateListeners] = useState([]);
  let [inputListeners, setInputListeners] = useState([]);

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
      setUpdateListeners([...updateListeners, callback]);
    },

    removeUpdateListener(callback) {
      setUpdateListeners(updateListeners.filter(listener => listener !== callback));
    },

    addInputListener(callback) {
      setInputListeners([...inputListeners, callback]);
    },

    removeInputListener(callback) {
      setInputListeners(inputListeners.filter(listener => listener !== callback));
    },

    dispatch(event) {
      // Iterate through the listeners in reverse order so that we get
      // the ones on top of the stack first
      for (let i = inputListeners.length - 1; i >= 0; i--) {
        let callback = inputListeners[i];

        if (callback(event) === true) {
          break;
        }
      }
    },

    update(dt) {
      for (let callback of updateListeners) {
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
