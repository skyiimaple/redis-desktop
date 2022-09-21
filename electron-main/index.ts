import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
} from "electron";
import path from "path";
import WinState from "./win-state";

const createWindow = () => {
  // 添加log
  // let userDataDir = app.getPath("userData");
  // Log.transports.file.file = userDataDir + "/logs/info.log";
  // const gotTheLock = app.requestSingleInstanceLock();
  // if (!gotTheLock) {
  //   app.quit();
  // }
  const { x = 0, y = 0, width = 1300, height = 700, maximized = true } = WinState.getLastState();
  const win = new BrowserWindow({
    x, y,
    width: width < 300 ? 1300 : width,
    height: height < 300 ? 700 : height,
    // transparent: true, // 窗口是否支持透明
    icon: path.join(__dirname, "../favicon.ico"),
    autoHideMenuBar: true,
    // fullscreen: true,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      // preload: path.join(__dirname, "../electron-preload/index.js"), //需要注意引入的预加载文件应该是打包后的 js 文件
      contextIsolation: false, // 如果需要执行preload 这里不能设置为false 
    },
  });
  if (maximized) {
    win.maximize();
  }
  WinState.watchState(win);

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
    // win.loadURL('https://crmtestb.kungeek.com/');
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    win.loadURL(url);
    // win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  }
  win.on('close', () => {
    win.webContents.send('closingWindow');
  });

};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  /**
   * 这里开始初始化其它功能
   */
  setEvent();
});


function setEvent() {
  ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = "light";
    } else {
      nativeTheme.themeSource = "dark";
    }
    return nativeTheme.shouldUseDarkColors;
  });
}

