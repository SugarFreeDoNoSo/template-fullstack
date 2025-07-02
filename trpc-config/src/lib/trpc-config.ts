import { TRPCError, initTRPC } from '@trpc/server';
import Redis from 'ioredis';
import {
  Service,
  createServiceSchema,
  serviceResponseSchema,
  updateServiceSchema,
} from 'shared-types';
import superjson from 'superjson';
import { Repository } from 'typeorm';
import { z } from 'zod';

// Context type
export interface Context {
  serviceRepository: Repository<Service>;
  redis: Redis;
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Cache keys
const CACHE_KEYS = {
  ALL_SERVICES: 'services:all',
  SERVICE_BY_ID: (id: number) => `service:${id}`,
  SERVICE_PATTERN: 'service:*',
  SERVICES_PATTERN: 'services:*',
} as const;

// Cache TTL (5 minutes)
const CACHE_TTL = 300;

// Helper function to invalidate cache
async function invalidateServiceCache(redis: Redis, serviceId?: number) {
  try {
    const patterns: string[] = [CACHE_KEYS.SERVICES_PATTERN];
    if (serviceId) {
      patterns.push(CACHE_KEYS.SERVICE_BY_ID(serviceId));
    } else {
      patterns.push(CACHE_KEYS.SERVICE_PATTERN);
    }

    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys && keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch (error) {
    // Log error but don't throw - cache invalidation failure shouldn't break the operation
    console.warn('Failed to invalidate cache:', error);
  }
}

// Helper function to get cached data
async function getCachedData<T>(redis: Redis, key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;

    const parsed = superjson.deserialize(JSON.parse(cached));
    return parsed as T;
  } catch (error) {
    // Log error but return null - cache read failure shouldn't break the operation
    console.warn('Failed to read from cache:', error);
    return null;
  }
}

// Helper function to set cached data
async function setCachedData<T>(
  redis: Redis,
  key: string,
  data: T,
  ttl: number = CACHE_TTL
): Promise<void> {
  try {
    const serialized = superjson.serialize(data);
    await redis.set(key, JSON.stringify(serialized), 'EX', ttl);
  } catch (error) {
    // Log error but don't throw - cache write failure shouldn't break the operation
    console.warn('Failed to write to cache:', error);
  }
}

// App router
export const appRouter = router({
  // Create service
  createService: publicProcedure
    .input(createServiceSchema)
    .output(serviceResponseSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const service = ctx.serviceRepository.create(input);
        const savedService = await ctx.serviceRepository.save(service);

        // Invalidate cache
        await invalidateServiceCache(ctx.redis);

        return savedService;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create service',
          cause: error,
        });
      }
    }),

  // Get all services
  getServices: publicProcedure
    .output(z.array(serviceResponseSchema))
    .query(async ({ ctx }) => {
      try {
        // Try to get from cache first
        const cached = await getCachedData<Service[]>(
          ctx.redis,
          CACHE_KEYS.ALL_SERVICES
        );
        if (cached) {
          return cached;
        }

        // Fetch from database
        const services = await ctx.serviceRepository.find({
          order: { scheduledAt: 'DESC' },
        });

        // Cache the result
        await setCachedData(ctx.redis, CACHE_KEYS.ALL_SERVICES, services);

        return services;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch services',
          cause: error,
        });
      }
    }),

  // Get service by ID
  getService: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .output(serviceResponseSchema)
    .query(async ({ input, ctx }) => {
      try {
        const cacheKey = CACHE_KEYS.SERVICE_BY_ID(input.id);

        // Try to get from cache first
        const cached = await getCachedData<Service>(ctx.redis, cacheKey);
        if (cached) {
          return cached;
        }

        // Fetch from database
        const service = await ctx.serviceRepository.findOne({
          where: { id: input.id },
        });

        if (!service) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Service not found',
          });
        }

        // Cache the result
        await setCachedData(ctx.redis, cacheKey, service);

        return service;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch service',
          cause: error,
        });
      }
    }),

  // Update service
  updateService: publicProcedure
    .input(
      z
        .object({
          id: z.number().int().positive(),
        })
        .merge(updateServiceSchema)
    )
    .output(serviceResponseSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input;

        // Check if service exists
        const existingService = await ctx.serviceRepository.findOne({
          where: { id },
        });

        if (!existingService) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Service not found',
          });
        }

        // Update service
        const updatedService = { ...existingService, ...updateData };
        const savedService = await ctx.serviceRepository.save(updatedService);

        // Invalidate cache
        await invalidateServiceCache(ctx.redis, id);

        return savedService;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update service',
          cause: error,
        });
      }
    }),

  // Delete service
  deleteService: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if service exists
        const existingService = await ctx.serviceRepository.findOne({
          where: { id: input.id },
        });

        if (!existingService) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Service not found',
          });
        }

        // Delete service
        await ctx.serviceRepository.delete(input.id);

        // Invalidate cache
        await invalidateServiceCache(ctx.redis, input.id);

        return {
          success: true,
          message: 'Service deleted successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete service',
          cause: error,
        });
      }
    }),
});

// Export router type
export type AppRouter = typeof appRouter;

// Create caller for testing
export const createCaller = (ctx: Context) => {
  return appRouter.createCaller(ctx);
};

// Create tRPC context (this will be implemented in the NestJS integration)
export const createTRPCContext = (): Context => {
  // This is a placeholder - in the actual NestJS integration,
  // this will be replaced with proper dependency injection
  throw new Error(
    'createTRPCContext must be implemented in the NestJS integration'
  );
};

// Legacy function for backward compatibility
export function trpcConfig(): string {
  return 'trpc-config';
}
