import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeTheme,
  Notification,
  Tray,
} from "electron";
import path from "path";
import { spawn, exec, execSync } from "child_process";
import { RedisServer } from "./redis/redis-server";

const createWindow = () => {
  // 添加log
  // let userDataDir = app.getPath("userData");
  // Log.transports.file.file = userDataDir + "/logs/info.log";
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }
  const win = new BrowserWindow({
    width: 1300,
    height: 700,
    // useContentSize: true,
    // frame: false, //要创建无边框窗口
    // transparent: true, // 窗口是否支持透明
    icon: path.join(__dirname, "../favicon.ico"),
    // autoHideMenuBar: true,
    // fullscreen: true,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      // preload: path.join(__dirname, "../electron-preload/index.js"), //需要注意引入的预加载文件应该是打包后的 js 文件
      contextIsolation: false, // 这里不能设置为false 
    },
  });

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
  console.log('123 :>> ', 123);

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

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
  });

  ipcMain.on("createDialog", (e, { title, content, type }) => {
    // const note = new Notification({ title: "通知", body: "哈哈哈测试" });
    // note.show();
    // dialog.showErrorBox(titel, content);
    dialog.showMessageBox({ title, message: content, type });
    // dialog.showOpenDialog();
  });
  ipcMain.on("createRedisConnect", (e, { title, content: body, type, callback }) => {
    const redis = new RedisServer();
    redis.connectRedis({ host: '127.0.0.1', username: '127.0.0.1', port: 6379 });
    // const local = redis.getRedisByName('127.0.0.1');
    if (callback) {
      callback(redis.getRedis());
    }
  });
}

