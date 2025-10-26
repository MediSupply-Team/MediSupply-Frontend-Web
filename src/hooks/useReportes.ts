import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getEstadisticasVentas, 
  getDatosGraficos, 
  getVentasVendedores, 
  exportarReporte 
} from '@/services/reportesService';
import type { FiltrosReportes } from '@/types';

// === QUERY KEYS ===
export const reportesKeys = {
  all: ['reportes'] as const,
  estadisticas: () => [...reportesKeys.all, 'estadisticas'] as const,
  graficos: () => [...reportesKeys.all, 'graficos'] as const,
  ventas: (filtros?: FiltrosReportes) => [...reportesKeys.all, 'ventas', filtros] as const,
};

/**
 * Hook para obtener estadísticas generales de ventas
 */
export const useEstadisticasVentas = () => {
  return useQuery({
    queryKey: reportesKeys.estadisticas(),
    queryFn: getEstadisticasVentas,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
};

/**
 * Hook para obtener datos de gráficos
 */
export const useDatosGraficos = () => {
  return useQuery({
    queryKey: reportesKeys.graficos(),
    queryFn: getDatosGraficos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
};

/**
 * Hook para obtener ventas de vendedores con filtros
 */
export const useVentasVendedores = (filtros?: FiltrosReportes) => {
  return useQuery({
    queryKey: reportesKeys.ventas(filtros),
    queryFn: () => getVentasVendedores(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000,    // 5 minutos
  });
};

/**
 * Hook para exportar reportes
 */
export const useExportarReporte = () => {
  return useMutation({
    mutationFn: ({ 
      formato, 
      filtros 
    }: { 
      formato: 'excel' | 'pdf'; 
      filtros?: FiltrosReportes; 
    }) => exportarReporte(formato, filtros),
    
    onSuccess: (blob, variables) => {
      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = variables.formato === 'excel' ? '.xlsx' : '.pdf';
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `reporte-vendedores-${fecha}${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar la URL
      window.URL.revokeObjectURL(url);
    },
    
    onError: (error) => {
      console.error('Error al exportar reporte:', error);
    },
  });
};