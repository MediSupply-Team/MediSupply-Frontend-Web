import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto 
} from '@/services/productosService';
import { crearProductoBackend } from '@/services/productosBackendService';
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
