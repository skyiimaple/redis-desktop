import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";


export default class WinState {

  static getLastState() {
    try {
      const data = fs.readFileSync(this.getStateFile());
      return JSON.parse(data.toString());
    } catch (error) {
      // todo 存报错信息
      return {};
    }
  }

  static watchState(win: BrowserWindow) {
    win.on('close', () => {
      const state = this.getWinState(win);
      if (!state) {
        return;
      }
      this.saveLastState(state);
    });
  }

  static getWinState(win: BrowserWindow) {
    try {
      const { x = null, y = null, width = 1000, height = 700 } = win?.getBounds();
      return { x, y, width, height, maximized: win?.isMaximized() };
    } catch (error) {
      console.log('error :>> ', error);
      // todo 存报错信息
      return false;
    }
  }

  static saveLastState(data: any) {
    fs.writeFile(this.getStateFile(), JSON.stringify(data), () => { });
  }


  static getStateFile() {
    const userPath = app.getPath('userData');
    const fileName = 'win-state.json';
    return path.join(userPath, fileName);
  }
}