import { Timers } from "silmarils";
import { h, render, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import { Provider, useUI } from "./context.jsx";
import { MainMenuScreen } from "./screens.jsx";

function App() {
  let { screens, dispatch, update } = useUI();

  useEffect(() => {
    window.addEventListener("keydown", dispatch);
    window.addEventListener("mousemove", dispatch);
    window.addEventListener("mousedown", dispatch);

    return () => {
      window.removeEventListener("keydown", dispatch);
      window.removeEventListener("mousemove", dispatch);
      window.removeEventListener("mousedown", dispatch);
    };
  }, [dispatch]);

  useEffect(() => {
    let timer = Timers.animation(update);
    return () => timer.stop();
  }, [update]);

  return (
    <Fragment>
      {screens.map(screen => {
        return <screen.component {...screen.props} />
      })}
    </Fragment>
  );
}
export function mount() {
  render(
    <Provider initialScreen={MainMenuScreen}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
}
