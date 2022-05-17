import os from "os";
import { contextBridge, ipcRenderer, shell } from "electron";

contextBridge.exposeInMainWorld("electron", {
  platform: os.platform(),
  doThing: (validChannels: string, data?: any) => {
    ipcRenderer.send(validChannels, data);
  },
  ipcRenderer,
  shell,
});
