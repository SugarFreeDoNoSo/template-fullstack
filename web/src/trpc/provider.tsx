'use client';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren, useState } from 'react';
import { trpc } from './client';

export function TrpcProvider({ children }: PropsWithChildren<{}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 5,
            retry: 1,
            onError: (err) => console.error('Query error', err),
          },
          mutations: {
            onError: (err) => console.error('Mutation error', err),
          },
        },
      })
  );
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
