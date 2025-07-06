import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'trpc-config';

export const trpc = createTRPCReact<AppRouter>();
