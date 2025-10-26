import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo antes de considerar los datos como obsoletos (5 minutos)
      staleTime: 1000 * 60 * 5,
      // Tiempo antes de eliminar los datos del cache (10 minutos)
      gcTime: 1000 * 60 * 10,
      // Reintentar failed queries
      retry: 2,
      // Intervalo de reintento
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // No refetch on window focus por defecto
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Tiempo de reintento para mutaciones
      retry: 1,
    },
  },
});

// Query keys para organizar las queries
export const queryKeys = {
  // Medicamentos
  medicamentos: ['medicamentos'] as const,
  medicamento: (id: string) => ['medicamentos', id] as const,
  medicamentosByCategoria: (categoria: string) => ['medicamentos', 'categoria', categoria] as const,
  
  // Proveedores
  proveedores: ['proveedores'] as const,
  proveedor: (id: string) => ['proveedores', id] as const,
  
  // Inventario
  inventario: ['inventario'] as const,
  movimientosInventario: (filtros?: Record<string, unknown>) => ['inventario', 'movimientos', filtros] as const,
  
  // Rutas y órdenes
  rutas: ['rutas'] as const,
  ruta: (id: string) => ['rutas', id] as const,
  ordenes: ['ordenes'] as const,
  orden: (id: string) => ['ordenes', id] as const,
  
  // Dashboard y estadísticas
  dashboard: ['dashboard'] as const,
  estadisticas: (periodo?: string) => ['estadisticas', periodo] as const,
} as const;