import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  Medicamento, 
  FiltrosProductos 
} from '@/types';
import {
  getMedicamentos,
  getMedicamento,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
} from '@/services/medicamentosService';
import { queryKeys } from '@/lib/react-query';

// === HOOKS DE QUERY ===

/**
 * Hook para obtener medicamentos con filtros
 */
export const useMedicamentos = (filtros?: FiltrosProductos) => {
  return useQuery({
    queryKey: [...queryKeys.medicamentos, filtros],
    queryFn: () => getMedicamentos(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un medicamento específico
 */
export const useMedicamento = (id: string) => {
  return useQuery({
    queryKey: queryKeys.medicamento(id),
    queryFn: () => getMedicamento(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
};

// === HOOKS DE MUTACIÓN ===

/**
 * Hook para crear un nuevo medicamento
 */
export const useCreateMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMedicamento,
    onSuccess: (nuevoMedicamento) => {
      // Invalidar las queries de medicamentos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: queryKeys.medicamentos });
      
      // Agregar el nuevo medicamento al cache
      queryClient.setQueryData(
        queryKeys.medicamento(nuevoMedicamento.id),
        nuevoMedicamento
      );
      
      // Opcional: Mostrar notificación de éxito
      console.log('Medicamento creado exitosamente:', nuevoMedicamento.nombre);
    },
    onError: (error) => {
      console.error('Error al crear medicamento:', error);
      // Aquí podrías mostrar una notificación de error
    },
  });
};

/**
 * Hook para actualizar un medicamento existente
 */
export const useUpdateMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: Partial<Omit<Medicamento, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>
    }) => updateMedicamento(id, data),
    onSuccess: (medicamentoActualizado) => {
      // Actualizar el medicamento específico en el cache
      queryClient.setQueryData(
        queryKeys.medicamento(medicamentoActualizado.id),
        medicamentoActualizado
      );
      
      // Invalidar las queries de medicamentos para refrescar las listas
      queryClient.invalidateQueries({ queryKey: queryKeys.medicamentos });
      
      console.log('Medicamento actualizado exitosamente:', medicamentoActualizado.nombre);
    },
    onError: (error) => {
      console.error('Error al actualizar medicamento:', error);
    },
  });
};

/**
 * Hook para eliminar un medicamento
 */
export const useDeleteMedicamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMedicamento,
    onSuccess: (_, id) => {
      // Remover el medicamento del cache
      queryClient.removeQueries({ queryKey: queryKeys.medicamento(id) });
      
      // Invalidar las queries de medicamentos para refrescar las listas
      queryClient.invalidateQueries({ queryKey: queryKeys.medicamentos });
      
      console.log('Medicamento eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error al eliminar medicamento:', error);
    },
  });
};

// === HOOKS OPTIMIZADOS PARA CASOS ESPECÍFICOS ===

/**
 * Hook para obtener medicamentos con stock bajo
 */
export const useMedicamentosStockBajo = () => {
  return useMedicamentos({ stockBajo: true });
};

/**
 * Hook para obtener medicamentos por categoría
 */
export const useMedicamentosPorCategoria = (categoria: string) => {
  return useMedicamentos({ categoria });
};

/**
 * Hook para prefetch de medicamentos (útil para precargar datos)
 */
export const usePrefetchMedicamentos = () => {
  const queryClient = useQueryClient();
  
  const prefetchMedicamentos = (filtros?: FiltrosProductos) => {
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.medicamentos, filtros],
      queryFn: () => getMedicamentos(filtros),
      staleTime: 1000 * 60 * 5,
    });
  };
  
  const prefetchMedicamento = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.medicamento(id),
      queryFn: () => getMedicamento(id),
      staleTime: 1000 * 60 * 5,
    });
  };
  
  return {
    prefetchMedicamentos,
    prefetchMedicamento,
  };
};

// === HOOKS DE UTILIDAD ===

/**
 * Hook para obtener el estado de carga global de medicamentos
 */
export const useMedicamentosLoadingState = () => {
  const queryClient = useQueryClient();
  
  // Obtener todas las queries de medicamentos que están cargando
  const queries = queryClient.getQueriesData({ queryKey: queryKeys.medicamentos });
  const isSomeLoading = queries.some(([queryKey]) => {
    const queryState = queryClient.getQueryState(queryKey);
    return queryState?.status === 'pending';
  });
  
  return {
    isLoading: isSomeLoading,
    // Puedes agregar más estados aquí
  };
};