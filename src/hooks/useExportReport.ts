import { useMutation } from '@tanstack/react-query';
import { exportSalesReport } from '@/services/backendService';
import { downloadFileFromUrl } from '@/utils/export';
import type { SalesPerformanceFilters } from '@/types';

/**
 * Hook para exportar reportes usando el backend
 */
export const useExportSalesReport = () => {
  return useMutation({
    mutationFn: async ({
      filters,
      format
    }: {
      filters: SalesPerformanceFilters;
      format: 'pdf' | 'csv';
    }) => {
      // Llamar al endpoint de exportación del backend
      const response = await exportSalesReport(filters, format);
      
      // Descargar el archivo desde la URL proporcionada
      await downloadFileFromUrl(response.url);
      
      return response;
    },
    onError: (error) => {
      console.error('Error al exportar reporte:', error);
    }
  });
};

/**
 * Hook para exportar reportes con manejo de estado mejorado
 */
export const useExportReport = () => {
  const exportMutation = useExportSalesReport();

  const exportReport = async (
    filters: SalesPerformanceFilters, 
    format: 'pdf' | 'csv'
  ) => {
    try {
      const result = await exportMutation.mutateAsync({ filters, format });
      return {
        success: true,
        message: result.message,
        format: result.format
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        format
      };
    }
  };

  return {
    exportReport,
    isLoading: exportMutation.isPending,
    error: exportMutation.error,
    isError: exportMutation.isError
  };
};