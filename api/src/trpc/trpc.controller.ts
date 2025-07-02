import { All, Controller, Inject, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRPCError } from '@trpc/server';
import { FastifyReply, FastifyRequest } from 'fastify';
import Redis from 'ioredis';
import { Service } from 'shared-types';
import { appRouter } from 'trpc-config';
import { Repository } from 'typeorm';
import { REDIS_PROVIDER } from '../redis/redis.module';

@Controller('trpc')
export class TrpcController {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @Inject(REDIS_PROVIDER)
    private readonly redis: Redis
  ) {}

  @All('*')
  async handleTrpcRequest(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ) {
    try {
      const path = req.url.replace('/api/trpc/', '');
      const caller = appRouter.createCaller({
        serviceRepository: this.serviceRepository,
        redis: this.redis,
      });

      // Handle different HTTP methods and paths
      let result: any;
      const [procedure, method] = path.split('.');

      switch (req.method) {
        case 'GET':
          if (procedure === 'getServices') {
            result = await caller.getServices();
          } else if (procedure === 'getService') {
            const id = parseInt(req.query['id'] as string);
            result = await caller.getService({ id });
          }
          break;
        case 'POST':
          if (procedure === 'createService') {
            result = await caller.createService(req.body as any);
          } else if (procedure === 'updateService') {
            result = await caller.updateService(req.body as any);
          } else if (procedure === 'deleteService') {
            result = await caller.deleteService(req.body as any);
          }
          break;
      }

      res.header('Content-Type', 'application/json');
      res.status(200);
      res.send({ result: { data: result } });
    } catch (error) {
      const statusCode = error instanceof TRPCError ? 400 : 500;
      res.status(statusCode);
      res.send({
        error: {
          message: error.message,
          code:
            error instanceof TRPCError ? error.code : 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  }
}
