import { ElMessage } from "element-plus";
import Redis, { RedisOptions } from "ioredis";
import CommonUtils from "../utils/utils";

const LOCALCONNECT = {
  host: '127.0.0.1',
  port: 6379,
  name: 'localhost',
};
const BaseConfig = {
  maxRetriesPerRequest: 5,
  retryStrategy: () => null
}
export default class RedisServer {

  static connectMaps: any = {}; // 存储连接redis的基本信息

  static setConnectMaps(key: string, value: any, prop?: string) {
    if (prop) {
      this.connectMaps[key][prop] = value;
    } else {
      this.connectMaps[key] = value;
    }
    localStorage.setItem('connections', JSON.stringify(this.connectMaps));
  }


  private static redisClient = new Map(); // 存储当前处于连接状态的redis对象


  static initConnectMaps() {
    if (localStorage.getItem('connections')) {
      const redis = JSON.parse(localStorage.getItem('connections') || '');
      for (const key in redis) {
        if (Object.prototype.hasOwnProperty.call(redis, key)) {
          this.connectMaps[key] = redis[key];
        }
      }
    }
  }

  static createRedis(option: any = LOCALCONNECT) {
    const key = option.key || CommonUtils.getKey();
    const data = this.getConnectOption(option, key)
    const redis = this.createConnect(key, data)
    this.setConnectMaps(key, data);
    return { client: redis, data: data };
  }

  static createConnect(key: string, option: any) {
    const redis = new Redis({ ...option, ...BaseConfig })
    redis.on('error', (error: Error) => {
      ElMessage.error(`服务连接失败：${error}`)
    });
    redis.on('ready', () => {
      this.redisClient.set(key, redis);
    })
    return redis
  }

  static getConnectOption(option: any, key: string) {
    return {
      ...option,
      auth: option.password,
      separator: ':',
      color: '#409eff',
      key,
    }
  }

  static getClient(key: string): Redis {
    if (this.redisClient.has(key)) {
      return this.redisClient.get(key);
    }
    return this.createConnect(key, this.connectMaps[key])
  }

  static closeConnect(key: string) {
    if (this.redisClient.has(key)) {
      this.closeClient(this.redisClient.get(key), () => {
        this.redisClient.delete(key);
        return true;
      })
    }
    return null;
  }

  private static closeClient(redis: Redis, callback?: Function) {
    callback && callback()
    // redis.close
  }

  static deleteConnect(key: string) {
    this.closeConnect(key)
    this.connectMaps[key] && delete this.connectMaps[key]
    localStorage.setItem('connections', JSON.stringify(this.connectMaps));
  }

  static isExistCheck(data: any) {
    const maps = new Map();
    for (const key in this.connectMaps) {
      if (Object.prototype.hasOwnProperty.call(this.connectMaps, key) && key !== data.key) {
        const { host, port } = this.connectMaps[key]
        maps.set(`${host}_${port}`, this.connectMaps[key])
      }
    }
    return maps.has(`${data.host}_${data.port}`)
  }

  static getRedisInfo(key: string) {
    const client = RedisServer.getClient(key)
    const infoMap = new Map();
    client.info().then(info => {
      const strList = info.replaceAll('\r', '').split('\n')
      let obj: any = {}
      let key = ''
      strList.forEach((res, index) => {
        if (res) {
          if (res.includes('#')) {
            key = res.split('#')[1].trim()
            infoMap.set(key, {})
          } else {
            const [key, value] = res.split(':')
            obj[key] = value
          }
        } else {
          infoMap.set(key, { ...obj, treeID: key })
          obj = {}
        }
      })
    })
    return infoMap
  }
}