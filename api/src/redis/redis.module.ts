import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

const REDIS_PROVIDER = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const redisUrl =
          configService.get('REDIS_URL') || 'redis://localhost:6379';

        const redis = new Redis(redisUrl, {
          connectTimeout: 10000,
          lazyConnect: true,
          maxRetriesPerRequest: 3,
        });

        redis.on('error', (error) => {
          console.error('Redis connection error:', error);
        });

        redis.on('connect', () => {
          console.log('Redis connected successfully');
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_PROVIDER],
})
export class RedisModule {}

// Export the token for injection
export { Redis, REDIS_PROVIDER };
