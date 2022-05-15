import os from "os";
import { contextBridge, ipcRenderer, shell } from "electron";

contextBridge.exposeInMainWorld("electron", {
  platform: os.platform(),
  doThing: () => ipcRenderer.send("do-a-thing"),
  ipcRenderer,
  shell,
});
