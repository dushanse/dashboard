import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
    return redis;
  },
};
