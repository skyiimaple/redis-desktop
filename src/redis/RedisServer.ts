import Redis, { RedisOptions } from "ioredis";
import CommonUtils from "../utils/utils";

export interface Connect {
    [propName: string]: RedisData;
}
export interface RedisData {
    host?: string;
    key: string;
    name?: string;
    port?: number | string;
    separator: string;
    order?: string;
    auth?: string;
    color?: string;
}
const LOCALCONNECT = {
    host: '127.0.0.1',
    port: 6379,
    name: 'localhost',
};
export default class RedisServer {

    static connectMaps: any = {}; // 存储连接redis的基本信息

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

    static createRedis(option: RedisOptions = LOCALCONNECT) {
        const redis = new Redis(option);
        const key = CommonUtils.getKey();
        this.redisClient.set(key, redis);
        this.connectMaps[key] = {
            key,
            host: option.host || '',
            port: option.port || '',
            name: option.name || '',
            auth: option.password,
            separator: ':'
        };
        localStorage.setItem('connections', JSON.stringify(this.connectMaps));
        return this.connectMaps[key];
    }

    static getClient(key: string) {
        if (this.redisClient.has(key)) {
            return this.redisClient.get(key);
        }
        return null;
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
        // redis.close
    }

}