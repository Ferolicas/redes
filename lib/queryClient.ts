'use client'

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minuto
      refetchInterval: 1000 * 60, // Auto-refresh cada minuto
      refetchIntervalInBackground: false, // Solo cuando la pestaña está activa
    },
  },
})