import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'shared-types';
import { RedisModule } from '../redis/redis.module';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), RedisModule],
  providers: [ServiceService],
  exports: [ServiceService, TypeOrmModule],
})
export class ServiceModule {}
