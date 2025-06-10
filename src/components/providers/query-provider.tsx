'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

/**
 * Props for the QueryProvider component
 */
type QueryProviderProps = {
  children: ReactNode;
};

/**
 * Provider component for React Query
 * Creates and maintains a QueryClient instance for data fetching
 */
export default function QueryProvider({ children }: QueryProviderProps) {
  // Create a client instance that persists across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}