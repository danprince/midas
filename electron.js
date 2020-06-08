let { app, BrowserWindow } = require("electron");

async function start() {
  await app.whenReady();

  let win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {}
  });

  win.setFullScreen(true);

  if (process.env.NODE_ENV === "development") {
    // Load url from snowpack
    win.loadURL("http://localhost:8080/");
  } else {
    // Load from built code
    win.loadFile("./build/index.html");
  }
}

start();
