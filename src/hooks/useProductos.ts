import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
  getProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto 
} from '@/services/productosService';
import { crearProductoBackend } from '@/services/productosBackendService';
import { obtenerProductosBackend } from '@/services/productosBackendListService';
import type { Producto, FiltrosInventario } from '@/types';
import type { FormularioProducto } from '@/services/productosBackendService';

// === QUERY KEYS ===
export const productosKeys = {
  all: ['productos'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: (filtros?: FiltrosInventario) => [...productosKeys.lists(), filtros] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: string) => [...productosKeys.details(), id] as const,
};

/**
 * Hook para obtener productos con filtros
 */
export const useProductos = (filtros?: FiltrosInventario) => {
  return useQuery({
    queryKey: productosKeys.list(filtros),
    queryFn: () => getProductos(filtros),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
};

/**
 * Hook para obtener productos desde el backend real
 */
export const useProductosBackend = (filtros?: FiltrosInventario) => {
  return useQuery({
    queryKey: [...productosKeys.list(filtros), 'backend'],
    queryFn: () => obtenerProductosBackend(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos para búsqueda más fresca
    gcTime: 10 * 60 * 1000,   // 10 minutos
    // Habilitar refetch en background para mantener datos actualizados
    refetchOnWindowFocus: false,
    // Reducir tiempo de retry para búsquedas más rápidas
    retry: 1,
  });
};

/**
 * Hook especializado para búsqueda de productos con debounce
 */
export const useProductosBackendSearch = (filtros?: FiltrosInventario) => {
  const [debouncedFiltros, setDebouncedFiltros] = useState(filtros);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFiltros(filtros);
    }, 300); // 300ms de delay

    return () => clearTimeout(timer);
  }, [filtros]);

  return useQuery({
    queryKey: [...productosKeys.list(debouncedFiltros), 'backend', 'search'],
    queryFn: () => obtenerProductosBackend(debouncedFiltros),
    staleTime: 30 * 1000, // 30 segundos para búsqueda
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1,
    // Solo ejecutar si hay filtros de búsqueda o no hay filtros en absoluto
    enabled: !debouncedFiltros?.busqueda || debouncedFiltros.busqueda.length >= 2,
  });
};

/**
 * Hook para crear un nuevo producto
 */
export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      // Invalidar todas las queries de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
    },
    onError: (error) => {
      console.error('Error al crear producto:', error);
    },
  });
};

/**
 * Hook para actualizar un producto existente
 */
export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProducto,
    onSuccess: (updatedProducto: Producto) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: productosKeys.all });
      
      // Actualizar cache específico si existe
      queryClient.setQueryData(
        productosKeys.detail(updatedProducto.id),
        updatedProducto
      );
    },
    onError: (error) => {
      console.error('Error al actualizar producto:', error);
    },
  });
};

/**
 * Hook para eliminar un producto
 */
export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: (_, deletedId: string) => {
      // Remover del cache
      queryClient.removeQueries({ queryKey: productosKeys.detail(deletedId) });
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
    },
    onError: (error) => {
      console.error('Error al eliminar producto:', error);
    },
  });
};

/**
 * Hook para crear un producto usando el backend
 */
export const useCreateProductoBackend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formulario: FormularioProducto) => crearProductoBackend(formulario),
    onSuccess: (newProducto) => {
      console.log('Producto creado exitosamente en backend:', newProducto);
      
      // Invalidar todas las listas de productos para refrescar los datos
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
    },
    onError: (error) => {
      console.error('Error al crear producto en backend:', error);
    },
  });
};
