import { render } from "preact";
import { useEffect } from "preact/hooks";
import { Provider, useUI } from "./context.jsx";
import { MainMenuScreen, GameScreen } from "./screens.jsx";
import { load, hasSave } from "../storage.js";

function App() {
  let { screens, dispatch } = useUI();

  useEffect(() => {
    window.addEventListener("keydown", dispatch);
    window.addEventListener("keyup", dispatch);
    window.addEventListener("mousemove", dispatch);
    window.addEventListener("mousedown", dispatch);
    window.addEventListener("mouseup", dispatch);
    window.addEventListener("click", dispatch);

    return () => {
      window.removeEventListener("keydown", dispatch);
      window.removeEventListener("keyup", dispatch);
      window.removeEventListener("mousemove", dispatch);
      window.removeEventListener("mousedown", dispatch);
      window.removeEventListener("mouseup", dispatch);
      window.removeEventListener("click", dispatch);
    };
  }, [dispatch]);

  return (
    <Fragment>
      {screens}
    </Fragment>
  );
}

export function mount() {
  let initialScreen = <MainMenuScreen />;

  if (hasSave()) {
    try {
      load();
      initialScreen = <GameScreen />;
    } catch (err) {
      console.error("could not load save", err);
    }
  }

  render(
    <Provider initialScreen={initialScreen}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
}
