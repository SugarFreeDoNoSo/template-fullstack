'use client';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren, useState } from 'react';
import { trpc } from './client';

export function TrpcProvider({ children }: PropsWithChildren<{}>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        httpBatchLink({ url: '/api/trpc' }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
