import { ElMessage } from "element-plus";
import Redis, { RedisOptions } from "ioredis";
import { resolve } from "path";
import CommonUtils from "../utils/utils";

// 默认连接参数
const LOCALCONNECT = {
  host: '127.0.0.1',
  port: 6379,
  name: 'localhost',
};

//基础连接配置
const BaseConfig = {
  maxRetriesPerRequest: 5,
  retryStrategy: () => null
}
export default class RedisServer {

  private static redisClient = new Map(); // 存储当前处于连接状态的Redis对象

  static connectMaps: any = {}; // 存储连接Redis的基本信息

  /**
   * 更新Redis连接
   * 
   * @param key 连接key
   * @param value 更新的值
   * @param prop （可选）指定更新属性
   */
  static setConnectMaps(key: string, value: any, prop?: string) {
    if (prop) {
      this.connectMaps[key][prop] = value;
    } else {
      this.connectMaps[key] = value;
    }
    localStorage.setItem('connections', JSON.stringify(this.connectMaps));
  }

  /**
   * 从localStorage初始化Redis连接
   */
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

  /**
   * 创建Redis的对象
   * @param option 创建参数
   * @returns 
   */
  static createRedis(option: any = LOCALCONNECT) {
    const key = option.key || CommonUtils.getKey();
    const data = this.getConnectOption(option, key)
    const redis = this.createConnect(key, data)
    this.setConnectMaps(key, data);
    return { client: redis, data: data };
  }

  /**
   *  连接Redis服务
   * 
   * @param key 当前连接key
   * @param option 连接参数
   * @returns 当前连接的redis服务
   */
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

  /**
   *  格式化连接参数
   * @param option 
   * @param key 
   * @returns 
   */
  static getConnectOption(option: any, key: string) {
    return {
      ...option,
      auth: option.password,
      separator: ':',
      color: '#409eff',
      key,
    }
  }

  /**
   *  根据key获取Redis对象
   * @param key 
   * @returns 
   */
  static getClient(key: string): Redis {
    if (this.redisClient.has(key)) {
      return this.redisClient.get(key);
    }
    return this.createConnect(key, this.connectMaps[key])
  }


  /**
   * 根据key关闭Redis对象
   * @param key 
   * @returns 
   */
  static closeConnect(key: string) {
    if (this.redisClient.has(key)) {
      this.closeClient(this.redisClient.get(key), () => {
        this.redisClient.delete(key);
        return true;
      })
    }
    return null;
  }

  /**
   *  执行关闭操作并执行关闭后回调
   * @param client 关闭的Redis对象
   * @param callback 关闭后回调
   */
  private static closeClient(client: Redis, callback?: Function) {
    client.quit()
    callback && callback()
  }

  /**
   * 根据key删除Redis连接
   * @param key 
   */
  static deleteConnect(key: string) {
    this.closeConnect(key)
    this.connectMaps[key] && delete this.connectMaps[key]
    localStorage.setItem('connections', JSON.stringify(this.connectMaps));
  }

  /**
   * 判断当前Redis连接是否存在
   * @param data 
   * @returns 
   */
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

  /**
   *  根据key获取已经连接的Redis对象信息
   * @param key 
   * @returns 
   */
  static getRedisInfo(key: string) {
    const client = RedisServer.getClient(key)
    return client.info().then(info => {
      const infoMap = new Map();
      const infoObj: any = {};
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
            infoObj[key] = value
          }
        } else {
          infoMap.set(key, { ...obj, treeID: key })
          obj = {}
        }
      })
      return { infoObj, infoMap }
    })
  }

  /**
   * 判断指定Redis服务的键是否存在
   * @param client 指定Redis服务
   * @param key 键
   * @param callback 存在时的执行的回调
   */
  static existsKey(client: Redis, key: string, callback: any) {
    client.exists(key).then(res => {
      if (res) {
        callback && callback()
      } else {
        ElMessage.error(`【${key}】 键不存在`)
      }
    })
  }
}