export interface IElectronAPI {
  platform?: string;
  doThing?: Function;
  shell?: any;
  toggle?: Function;
  system?: Function;
  Redis?: Redis
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
export interface RedisData {
  host: string;
  key: string;
  name: string;
  port: number | string;
  separator?: string;
  order?: string;
  auth?: string;
  color?: string;
}

export interface KeyData {
  data: RedisData;
  key?: string;
  component?: any;
  info?: any
}
