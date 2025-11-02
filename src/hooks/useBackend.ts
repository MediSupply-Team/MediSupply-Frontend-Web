import { useQuery } from '@tanstack/react-query';
import { 
  getSalesPerformance, 
  getSalesPerformanceDefault, 
  transformSalesDataForUI 
} from '@/services/backendService';
import type { SalesPerformanceFilters } from '@/types';

// === QUERY KEYS ===
export const backendKeys = {
  all: ['backend'] as const,
  salesPerformance: (filters?: SalesPerformanceFilters) => 
    [...backendKeys.all, 'sales-performance', filters] as const,
};

/**
 * Hook para obtener datos de performance de ventas del backend
 */
export const useSalesPerformance = (filters?: SalesPerformanceFilters) => {
  return useQuery({
    queryKey: backendKeys.salesPerformance(filters),
    queryFn: () => filters 
      ? getSalesPerformance(filters)
      : getSalesPerformanceDefault(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    select: transformSalesDataForUI, // Transformar datos automáticamente
  });
};

/**
 * Hook para obtener datos de performance de ventas con transformación manual
 */
export const useSalesPerformanceRaw = (filters?: SalesPerformanceFilters) => {
  return useQuery({
    queryKey: [...backendKeys.salesPerformance(filters), 'raw'],
    queryFn: () => filters 
      ? getSalesPerformance(filters)
      : getSalesPerformanceDefault(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    // No transformar datos, devolver tal como vienen del backend
  });
};

/**
 * Hook para obtener estadísticas de ventas (solo el summary)
 */
export const useSalesSummary = (filters?: SalesPerformanceFilters) => {
  return useQuery({
    queryKey: [...backendKeys.salesPerformance(filters), 'summary'],
    queryFn: () => filters 
      ? getSalesPerformance(filters)
      : getSalesPerformanceDefault(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.summary, // Solo devolver el resumen
  });
};

/**
 * Hook para obtener datos de gráficos (tendencia y top productos)
 */
export const useSalesCharts = (filters?: SalesPerformanceFilters) => {
  return useQuery({
    queryKey: [...backendKeys.salesPerformance(filters), 'charts'],
    queryFn: () => filters 
      ? getSalesPerformance(filters)
      : getSalesPerformanceDefault(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.charts, // Solo devolver los gráficos
  });
};

/**
 * Hook para obtener datos de la tabla de ventas
 */
export const useSalesTable = (filters?: SalesPerformanceFilters) => {
  return useQuery({
    queryKey: [...backendKeys.salesPerformance(filters), 'table'],
    queryFn: () => filters 
      ? getSalesPerformance(filters)
      : getSalesPerformanceDefault(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.table.rows, // Solo devolver las filas de la tabla
  });
};