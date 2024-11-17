import { Injectable } from '@nestjs/common';
import { RedisService as NestRedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly redisService: NestRedisService) {
    this.redis = this.redisService.getClient();
  }

  async cacheList(key: string, value: any[], ttl: number): Promise<void> {
    await this.redis.rpush(key, JSON.stringify(value));
    await this.redis.expire(key, ttl);
  }

  async getAllFromCache(pattern: string): Promise<any[]> {
    const keys = await this.redis.keys(pattern);
    const values = await Promise.all(
      keys.map((key) => this.redis.lrange(key, 0, -1)),
    );
    return values.flat().map((value) => JSON.parse(value));
  }

  async getLastFromCache(key: string): Promise<any> {
    const value = await this.redis.lindex(key, -1);
    return value ? JSON.parse(value) : null;
  }
}
