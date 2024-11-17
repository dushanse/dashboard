import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class UtilService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async cacheList(key: string, data: any[], ttl: number) {
    const pipeline = this.redis.pipeline();
    data.forEach((element) => pipeline.rpush(key, JSON.stringify(element)));
    pipeline.expire(key, ttl);
    await pipeline.exec();
  }

  async getKeys(pattern: string) {
    return await this.redis.keys(pattern);
  }

  async getCache(key: string) {
    const data = await this.redis.lrange(key, 0, -1);
    return data.map((item) => JSON.parse(item));
  }
}
