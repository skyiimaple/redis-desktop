import { app, BrowserWindow } from "electron";
import path from "path";

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      /**
       * 上下文隔离功能将确保您的 预加载脚本 和 Electron的内部逻辑 运行在所加载的 webcontent网页 之外的另一个独立的上下文环境里。
       * 这对安全性很重要，因为它有助于阻止网站访问 Electron 的内部组件 和 您的预加载脚本可访问的高等级权限的API 。
       */
      // contextIsolation:false, // 这里不能设置为false
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
});
