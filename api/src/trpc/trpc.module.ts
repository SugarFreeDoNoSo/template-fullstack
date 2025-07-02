import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { TrpcController } from './trpc.controller';

@Module({
  imports: [ServiceModule],
  controllers: [TrpcController],
  exports: [TrpcController],
})
export class TrpcModule {}
