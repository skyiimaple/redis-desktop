import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from "electron";
import path from "path";
import { spawn, exec, execSync } from "child_process";

const createWindow = () => {
  const win = new BrowserWindow({
    icon: `./public/favicon.ico`,
    webPreferences: {
      // webSecurity: false, 
      nodeIntegration: true,
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
  createTray();
  setEvent();
});

function createTray() {
  let tray = null;
  tray = new Tray('public/favicon.ico')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
}

function setEvent() {

  let suspensionMenu: Electron.Menu | null = null;
  ipcMain.on('createSuspensionMenu', (e) => {
    console.log(e);

    if (!suspensionMenu) {
      suspensionMenu = Menu.buildFromTemplate([
        {
          label: '打开NG',
          click: () => {
            // if (win === null) { //判断主窗口是否存在，已关闭则创建主窗口
            //   createWindow()
            // }
            // exec('mycli ng vs');
            exec('mycli ng vs', function (error, stdout, stderr) {
              if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
              }
            });
          }
        },
      ]);
    }
    suspensionMenu.popup({});
  });
}
