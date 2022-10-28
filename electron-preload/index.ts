import os from 'os'
import { contextBridge, ipcRenderer, shell } from 'electron'

const gWindow = window as any
gWindow.electron = {
  platform: os.platform(),
  shell,
  doThing: (validChannels: string, data: any) => {
    console.log(data)
    ipcRenderer.send(validChannels, data)
  },
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
}
// contextBridge.exposeInMainWorld("electron", {
//   platform: os.platform(),
//   ipcRenderer,
//   shell,
//   doThing: (validChannels: string, data: any) => {
//     console.log(data);
//     ipcRenderer.send(validChannels, data);
//   },
//   toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
//   system: () => ipcRenderer.invoke("dark-mode:system"),
// });

// contextBridge.exposeInMainWorld("darkMode", {
//   toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
//   system: () => ipcRenderer.invoke("dark-mode:system"),
// });
