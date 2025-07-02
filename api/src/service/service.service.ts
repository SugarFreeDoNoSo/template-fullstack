import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { CreateServiceDto, Service, UpdateServiceDto } from 'shared-types';
import { Repository } from 'typeorm';
import { REDIS_PROVIDER } from '../redis/redis.module';

@Injectable()
export class ServiceService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEYS = {
    ALL_SERVICES: 'services:all',
    SERVICE_BY_ID: (id: number) => `service:${id}`,
    SERVICE_PATTERN: 'service:*',
    SERVICES_PATTERN: 'services:*',
  } as const;

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @Inject(REDIS_PROVIDER)
    private readonly redis: Redis
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    const savedService = await this.serviceRepository.save(service);

    // Invalidate cache
    await this.invalidateServiceCache();

    return savedService;
  }

  async findAll(): Promise<Service[]> {
    try {
      // Try to get from cache first
      const cached = await this.getCachedData<Service[]>(
        this.CACHE_KEYS.ALL_SERVICES
      );
      if (cached) {
        return cached;
      }

      // Fetch from database
      const services = await this.serviceRepository.find({
        order: { scheduledAt: 'DESC' },
      });

      // Cache the result
      await this.setCachedData(this.CACHE_KEYS.ALL_SERVICES, services);

      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Service> {
    try {
      const cacheKey = this.CACHE_KEYS.SERVICE_BY_ID(id);

      // Try to get from cache first
      const cached = await this.getCachedData<Service>(cacheKey);
      if (cached) {
        return cached;
      }

      // Fetch from database
      const service = await this.serviceRepository.findOne({
        where: { id },
      });

      if (!service) {
        throw new Error('Service not found');
      }

      // Cache the result
      await this.setCachedData(cacheKey, service);

      return service;
    } catch (error) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto
  ): Promise<Service> {
    try {
      // Check if service exists
      const existingService = await this.serviceRepository.findOne({
        where: { id },
      });

      if (!existingService) {
        throw new Error('Service not found');
      }

      // Update service
      const updatedService = { ...existingService, ...updateServiceDto };
      const savedService = await this.serviceRepository.save(updatedService);

      // Invalidate cache
      await this.invalidateServiceCache(id);

      return savedService;
    } catch (error) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    try {
      // Check if service exists
      const existingService = await this.serviceRepository.findOne({
        where: { id },
      });

      if (!existingService) {
        throw new Error('Service not found');
      }

      // Delete service
      await this.serviceRepository.delete(id);

      // Invalidate cache
      await this.invalidateServiceCache(id);

      return {
        success: true,
        message: 'Service deleted successfully',
      };
    } catch (error) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  }

  // Helper methods for cache management
  private async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      if (!cached) return null;

      return JSON.parse(cached, (key, value) => {
        // Parse Date objects
        if (
          typeof value === 'string' &&
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ) {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      return null;
    }
  }

  private async setCachedData<T>(
    key: string,
    data: T,
    ttl: number = this.CACHE_TTL
  ): Promise<void> {
    try {
      await this.redis.set(
        key,
        JSON.stringify(data, (key, value) => {
          // Serialize Date objects
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }),
        'EX',
        ttl
      );
    } catch (error) {
      console.warn('Failed to write to cache:', error);
    }
  }

  private async invalidateServiceCache(serviceId?: number): Promise<void> {
    try {
      const patterns: string[] = [this.CACHE_KEYS.SERVICES_PATTERN];
      if (serviceId) {
        patterns.push(this.CACHE_KEYS.SERVICE_BY_ID(serviceId));
      } else {
        patterns.push(this.CACHE_KEYS.SERVICE_PATTERN);
      }

      for (const pattern of patterns) {
        const keys = await this.redis.keys(pattern);
        if (keys && keys.length > 0) {
          await this.redis.del(...keys);
        }
      }
    } catch (error) {
      console.warn('Failed to invalidate cache:', error);
    }
  }
}
