import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  FiltrosInventario 
} from '@/types';
import {
  getProductos,
  getProducto,
  createProducto,
} from '@/services/productosService';

// === HOOKS DE QUERY ===

/**
 * Hook para obtener productos con filtros
 */
export const useProductos = (filtros?: FiltrosInventario) => {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => getProductos(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un producto específico
 */
export const useProducto = (id: string) => {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => getProducto(id),
    enabled: !!id, // Solo ejecutar si hay ID
  });
};

// === HOOKS DE MUTACIÓN ===

/**
 * Hook para crear un nuevo producto
 */
export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProducto,
    onSuccess: (nuevoProducto) => {
      // Invalidar las queries de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      
      // Agregar el nuevo producto al cache
      queryClient.setQueryData(['productos', nuevoProducto.id], nuevoProducto);
      
      console.log('Producto creado exitosamente:', nuevoProducto.nombre);
    },
    onError: (error) => {
      console.error('Error al crear producto:', error);
    },
  });
};

// === HOOKS OPTIMIZADOS PARA CASOS ESPECÍFICOS ===

/**
 * Hook para obtener productos con stock bajo
 */
export const useProductosStockBajo = () => {
  return useProductos({ stockBajo: true });
};

/**
 * Hook para obtener productos próximos a vencer
 */
export const useProductosProximosVencer = () => {
  return useProductos({ proximoVencer: true });
};

/**
 * Hook para obtener productos por categoría
 */
export const useProductosPorCategoria = (categoria: string) => {
  return useProductos({ categoria });
};