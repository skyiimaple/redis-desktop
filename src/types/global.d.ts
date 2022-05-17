export interface IElectronAPI {
  platform: string;
  doThing: Function;
  shell: any;
  toggle: Function;
  system: Function;
}
export interface DarkModeAPI {
  toggle: Function;
  system: Function;
}

declare global {
  interface Window {
    electron: IElectronAPI;
    darkMode: DarkModeAPI;
  }
}
