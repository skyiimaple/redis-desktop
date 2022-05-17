export interface IElectronAPI {
  platform: string;
  doThing: Function;
  shell: any
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
