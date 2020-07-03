import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/errors/AppError';

import cacheConfig from '@config/cache';

const redisClient = redis.createClient({
  host: cacheConfig.config.redis.host,
  port: Number(cacheConfig.config.redis.port),
  password: cacheConfig.config.redis.password,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    next();
  } catch (error) {
    throw new AppError('Too many request', 429);
  }
}
