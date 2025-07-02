// Exportar todo desde trpc-config
export * from './lib/trpc-config';

// Exports específicos para mejor tree-shaking
export {
  appRouter,
  createCaller,
  createTRPCContext,
  publicProcedure,
  router,
  trpcConfig,
  type AppRouter,
  type Context,
} from './lib/trpc-config';
