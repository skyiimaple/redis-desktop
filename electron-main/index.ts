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

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 700,
    // useContentSize: true,
    // frame: false, //要创建无边框窗口
    // transparent: true, // 窗口是否支持透明
    icon: path.join(__dirname, "../favicon.ico"),
    webPreferences: {
      // webSecurity: false,
      // nodeIntegration: true,
      // contextIsolation:false, // 这里不能设置为falsewebSecurity: false
      preload: path.join(__dirname, "../electron-preload/index.js"), //需要注意引入的预加载文件应该是打包后的 js 文件
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
    // win.loadURL('https://crmtestb.kungeek.com/');
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

  /**
   * 这里开始初始化其它功能
   */
  setEvent();
  createTray();
});

function createTray() {
  let tray = null;

  // if (app.isPackaged) {
  tray = new Tray(path.join(__dirname, "../favicon.ico"));
  // } else {
  //   tray = new Tray("public/favicon.ico");
  // }
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}

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
  ipcMain.on("createNotification", (e, { title, content: body, type }) => {
    const note = new Notification({ title, body });
    note.show();
  });
}

// function createSuspension() {
//   let suspensionMenu: Electron.Menu | null = null;
// if (!suspensionMenu) {
//   suspensionMenu = Menu.buildFromTemplate([
//     {
//       label: "打开NG",
//       click: () => {
//         // if (win === null) { //判断主窗口是否存在，已关闭则创建主窗口
//         //   createWindow()
//         // }
//         // exec('mycli ng vs');
//         exec("mycli ng vs", function (error, stdout, stderr) {
//           if (error) {
//             console.log(error.stack);
//             console.log("Error code: " + error.code);
//             console.log("Signal received: " + error.signal);
//           }
//         });
//       },
//     },
//   ]);
// }
// suspensionMenu.popup({});
// }
