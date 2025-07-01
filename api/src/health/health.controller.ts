import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async checkHealth() {
    try {
      // Check database connection
      const isConnected = this.dataSource.isInitialized;

      if (!isConnected) {
        throw new Error('Database not connected');
      }

      // Test database query
      await this.dataSource.query('SELECT 1');

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: 'connected',
          type: 'postgres',
        },
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: 'disconnected',
          error: error.message,
        },
        environment: process.env.NODE_ENV || 'development',
      };
    }
  }
}
