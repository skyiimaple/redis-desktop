import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      // contextIsolation:false, // 这里不能设置为falsewebSecurity: false
      preload: path.join(__dirname, "../electron-preload/index.js"), //需要注意引入的预加载文件应该是打包后的 js 文件
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    win.loadURL(url);
  }
};
let tray = null;
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
  // createTray();
});

// function createTray() {
//   tray = new Tray('public/favicon.ico')
//   const contextMenu = Menu.buildFromTemplate([
//     { label: 'Item1', type: 'radio' },
//     { label: 'Item2', type: 'radio' },
//     { label: 'Item3', type: 'radio', checked: true },
//     { label: 'Item4', type: 'radio' }
//   ])
//   tray.setToolTip('This is my application.')
//   tray.setContextMenu(contextMenu)
// }
