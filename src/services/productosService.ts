import { apiClient } from '@/lib/axios';
import type { 
  Producto, 
  FiltrosInventario, 
  PaginatedResponse
} from '@/types';

// === DATOS MOCK ===
const productosMock: Producto[] = [
  {
    id: '1',
    nombre: 'Jeringas Desechables 10ml',
    sku: 'JER-10ML-001',
    categoria: 'Instrumental Médico',
    ubicacion: 'A-1',
    ubicacionDetalle: 'Estante A, Nivel 1, Posición 15',
    stock: 250,
    unidadMedida: 'unidad',
    estadoStock: 'disponible',
    fechaVencimiento: '2025-12-31',
    icono: 'syringe',
    colorIcono: '#0ea5a8',
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-10-20'
  },
  {
    id: '2',
    nombre: 'Guantes de Látex Talla M',
    sku: 'GLV-LAT-M-002',
    categoria: 'Protección Personal',
    ubicacion: 'B-2',
    ubicacionDetalle: 'Estante B, Nivel 2, Posición 08',
    stock: 15,
    unidadMedida: 'caja',
    estadoStock: 'stock-bajo',
    fechaVencimiento: '2026-06-15',
    icono: 'medical_services',
    colorIcono: '#22c55e',
    fechaCreacion: '2024-02-10',
    fechaActualizacion: '2024-10-18'
  },
  {
    id: '3',
    nombre: 'Mascarillas N95',
    sku: 'MAS-N95-003',
    categoria: 'Protección Personal',
    ubicacion: 'C-1',
    ubicacionDetalle: 'Estante C, Nivel 1, Posición 05',
    stock: 0,
    unidadMedida: 'caja',
    estadoStock: 'agotado',
    fechaVencimiento: '2025-08-20',
    icono: 'masks',
    colorIcono: '#ef4444',
    fechaCreacion: '2024-01-20',
    fechaActualizacion: '2024-10-15'
  },
  {
    id: '4',
    nombre: 'Batas Quirúrgicas Desechables',
    sku: 'BAT-QUI-004',
    categoria: 'Vestimenta Médica',
    ubicacion: 'D-3',
    ubicacionDetalle: 'Estante D, Nivel 3, Posición 12',
    stock: 180,
    unidadMedida: 'unidad',
    estadoStock: 'disponible',
    fechaVencimiento: '2027-03-10',
    icono: 'personal_injury',
    colorIcono: '#0ea5a8',
    fechaCreacion: '2024-03-05',
    fechaActualizacion: '2024-10-22'
  },
  {
    id: '5',
    nombre: 'Alcohol en Gel 500ml',
    sku: 'ALC-GEL-005',
    categoria: 'Higiene y Limpieza',
    ubicacion: 'E-1',
    ubicacionDetalle: 'Estante E, Nivel 1, Posición 20',
    stock: 320,
    unidadMedida: 'frasco',
    estadoStock: 'disponible',
    fechaVencimiento: '2025-11-30',
    icono: 'sanitizer',
    colorIcono: '#22c55e',
    fechaCreacion: '2024-02-28',
    fechaActualizacion: '2024-10-25'
  },
  {
    id: '6',
    nombre: 'Termómetros Digitales',
    sku: 'TER-DIG-006',
    categoria: 'Instrumental Médico',
    ubicacion: 'F-2',
    ubicacionDetalle: 'Estante F, Nivel 2, Posición 30',
    stock: 85,
    unidadMedida: 'unidad',
    estadoStock: 'disponible',
    fechaVencimiento: '2028-01-15',
    icono: 'device_thermostat',
    colorIcono: '#0ea5a8',
    fechaCreacion: '2024-04-10',
    fechaActualizacion: '2024-10-20'
  },
  {
    id: '7',
    nombre: 'Vendas Elásticas 10cm',
    sku: 'VEN-ELA-007',
    categoria: 'Material de Curación',
    ubicacion: 'G-1',
    ubicacionDetalle: 'Estante G, Nivel 1, Posición 18',
    stock: 45,
    unidadMedida: 'rollo',
    estadoStock: 'stock-bajo',
    fechaVencimiento: '2026-09-25',
    icono: 'healing',
    colorIcono: '#f59e0b',
    fechaCreacion: '2024-03-15',
    fechaActualizacion: '2024-10-19'
  }
];

// === FUNCIONES DE SERVICIO ===

/**
 * Obtener productos con filtros y paginación
 */
export const getProductos = async (
  filtros?: FiltrosInventario
): Promise<PaginatedResponse<Producto>> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let productosFiltrados = [...productosMock];
      
      // Aplicar filtros
      if (filtros?.busqueda) {
        const termino = filtros.busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(producto =>
          producto.nombre.toLowerCase().includes(termino) ||
          producto.sku.toLowerCase().includes(termino) ||
          producto.categoria.toLowerCase().includes(termino)
        );
      }
      
      if (filtros?.categoria && filtros.categoria !== 'Todas las categorías') {
        productosFiltrados = productosFiltrados.filter(producto =>
          producto.categoria === filtros.categoria
        );
      }
      
      if (filtros?.ubicacion && filtros.ubicacion !== 'Ubicación') {
        productosFiltrados = productosFiltrados.filter(producto =>
          producto.ubicacion === filtros.ubicacion
        );
      }
      
      // Filtros rápidos
      if (filtros?.stockBajo) {
        productosFiltrados = productosFiltrados.filter(producto =>
          producto.estadoStock === 'stock-bajo'
        );
      }
      
      if (filtros?.proximoVencer) {
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() + 3);
        
        productosFiltrados = productosFiltrados.filter(producto => {
          if (!producto.fechaVencimiento) return false;
          const fechaVencimiento = new Date(producto.fechaVencimiento);
          return fechaVencimiento <= fechaLimite;
        });
      }
      
      if (filtros?.masSolicitados) {
        // Para el mock, simplemente ordenar por stock descendente
        productosFiltrados.sort((a, b) => b.stock - a.stock);
      }
      
      // Ordenar
      if (filtros?.ordenarPor) {
        productosFiltrados.sort((a, b) => {
          switch (filtros.ordenarPor) {
            case 'nombre':
              return a.nombre.localeCompare(b.nombre);
            case 'stock':
              return b.stock - a.stock;
            case 'ubicacion':
              return a.ubicacion.localeCompare(b.ubicacion);
            case 'actualizacion':
              return new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime();
            default:
              return 0;
          }
        });
      }
      
      // Paginación
      const page = filtros?.page || 1;
      const limit = filtros?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = productosFiltrados.slice(startIndex, endIndex);
      
      return {
        data: paginatedProducts,
        total: productosFiltrados.length,
        page,
        limit,
        totalPages: Math.ceil(productosFiltrados.length / limit),
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<Producto>>('/productos', {
      params: filtros,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Crear un nuevo producto
 */
export const createProducto = async (data: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Producto> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const nuevoProducto: Producto = {
        ...data,
        id: Date.now().toString(),
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
      
      // En un entorno real, esto se guardaría en la base de datos
      productosMock.unshift(nuevoProducto);
      
      return nuevoProducto;
    }
    
    const response = await apiClient.post<Producto>('/productos', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualizar un producto existente
 */
export const updateProducto = async (data: Partial<Producto> & { id: string }): Promise<Producto> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = productosMock.findIndex(p => p.id === data.id);
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }
      
      const productoActualizado: Producto = { 
        ...productosMock[index], 
        ...data,
        fechaActualizacion: new Date().toISOString().split('T')[0]
      };
      productosMock[index] = productoActualizado;
      
      return productoActualizado;
    }
    
    const response = await apiClient.put<Producto>(`/productos/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Eliminar un producto
 */
export const deleteProducto = async (id: string): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const index = productosMock.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }
      
      productosMock.splice(index, 1);
      return;
    }
    
    await apiClient.delete(`/productos/${id}`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};
