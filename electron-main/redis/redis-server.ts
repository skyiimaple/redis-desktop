import Redis from "ioredis";
import { RedisOptions } from "ioredis/built/cluster/util";

export class RedisServer {
  public redis: Redis | undefined;

  constructor() {
  }

  connectRedis(params: RedisOptions) {
    const redis = new Redis();
    this.redis = redis;
    console.log('redis :>> ', redis.options);
  }


  getRedis() {
    return this.redis;
  }
}