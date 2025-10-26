import { apiClient } from '@/lib/axios';
import type { 
  Producto, 
  ApiResponse, 
  PaginatedResponse, 
  FiltrosInventario 
} from '@/types';

// === DATOS MOCK ===
const productosMock: Producto[] = [
  {
    id: '1',
    nombre: 'Jeringas Desechables 10ml',
    sku: 'JER-10ML-001',
    categoria: 'Insumos Descartables',
    ubicacion: 'Almacén Principal',
    ubicacionDetalle: 'Pasillo A - Estante 3',
    stock: 2450,
    unidadMedida: 'unidades',
    estadoStock: 'disponible',
    fechaVencimiento: '2025-08-15',
    icono: 'medical_services',
    colorIcono: 'var(--primary-color)',
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-10-20',
  },
  {
    id: '2',
    nombre: 'Guantes de Látex Talla M',
    sku: 'GLV-LAT-M-002',
    categoria: 'Equipos de Protección',
    ubicacion: 'Almacén Quirófano',
    ubicacionDetalle: 'Pasillo B - Estante 1',
    stock: 150,
    unidadMedida: 'cajas',
    estadoStock: 'stock-bajo',
    fechaVencimiento: '2024-12-30',
    icono: 'healing',
    colorIcono: 'var(--accent-color)',
    fechaCreacion: '2024-02-10',
    fechaActualizacion: '2024-10-18',
  },
  {
    id: '3',
    nombre: 'Paracetamol 500mg',
    sku: 'PAR-500-003',
    categoria: 'Medicamentos',
    ubicacion: 'Bodega Refrigerada',
    ubicacionDetalle: 'Área C - Nivel 2',
    stock: 0,
    unidadMedida: 'tabletas',
    estadoStock: 'agotado',
    fechaVencimiento: undefined,
    icono: 'medication',
    colorIcono: 'var(--accent-red)',
    fechaCreacion: '2024-01-05',
    fechaActualizacion: '2024-10-15',
  },
  {
    id: '4',
    nombre: 'Mascarillas N95',
    sku: 'MAS-N95-004',
    categoria: 'Equipos de Protección',
    ubicacion: 'Almacén Principal',
    ubicacionDetalle: 'Pasillo D - Estante 2',
    stock: 850,
    unidadMedida: 'unidades',
    estadoStock: 'disponible',
    fechaVencimiento: '2025-06-20',
    icono: 'masks',
    colorIcono: 'var(--primary-color)',
    fechaCreacion: '2024-03-12',
    fechaActualizacion: '2024-10-22',
  },
  {
    id: '5',
    nombre: 'Termómetro Digital',
    sku: 'TER-DIG-005',
    categoria: 'Equipos Médicos',
    ubicacion: 'Almacén Quirófano',
    ubicacionDetalle: 'Área E - Estante 1',
    stock: 25,
    unidadMedida: 'unidades',
    estadoStock: 'stock-bajo',
    fechaVencimiento: '2026-01-15',
    icono: 'device_thermostat',
    colorIcono: 'var(--secondary-color)',
    fechaCreacion: '2024-04-08',
    fechaActualizacion: '2024-10-19',
  },
  {
    id: '6',
    nombre: 'Gasas Estériles 5x5cm',
    sku: 'GAS-EST-006',
    categoria: 'Material Quirúrgico',
    ubicacion: 'Almacén Principal',
    ubicacionDetalle: 'Pasillo C - Estante 4',
    stock: 1200,
    unidadMedida: 'paquetes',
    estadoStock: 'disponible',
    fechaVencimiento: '2025-09-10',
    icono: 'medical_information',
    colorIcono: 'var(--accent-color)',
    fechaCreacion: '2024-02-18',
    fechaActualizacion: '2024-10-21',
  },
];

// === FUNCIONES DE SERVICIO ===

/**
 * Obtener todos los productos con filtros opcionales
 */
export const getProductos = async (
  filtros?: FiltrosInventario
): Promise<PaginatedResponse<Producto>> => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let productosFiltrados = [...productosMock];
      
      // Aplicar filtros
      if (filtros?.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(prod =>
          prod.nombre.toLowerCase().includes(busqueda) ||
          prod.sku.toLowerCase().includes(busqueda)
        );
      }
      
      if (filtros?.categoria && filtros.categoria !== 'Todas las categorías') {
        productosFiltrados = productosFiltrados.filter(prod =>
          prod.categoria === filtros.categoria
        );
      }
      
      if (filtros?.ubicacion && filtros.ubicacion !== 'Ubicación') {
        productosFiltrados = productosFiltrados.filter(prod =>
          prod.ubicacion === filtros.ubicacion
        );
      }
      
      if (filtros?.stockBajo) {
        productosFiltrados = productosFiltrados.filter(prod =>
          prod.estadoStock === 'stock-bajo'
        );
      }
      
      if (filtros?.proximoVencer) {
        // Filtrar productos que vencen en los próximos 30 días
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 30);
        
        productosFiltrados = productosFiltrados.filter(prod => {
          if (!prod.fechaVencimiento) return false;
          const fechaVenc = new Date(prod.fechaVencimiento);
          return fechaVenc <= fechaLimite;
        });
      }
      
      // Ordenar
      if (filtros?.ordenarPor) {
        productosFiltrados.sort((a, b) => {
          switch (filtros.ordenarPor) {
            case 'nombre':
              return a.nombre.localeCompare(b.nombre);
            case 'stock':
              return b.stock - a.stock;
            case 'actualizacion':
              return new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime();
            case 'ubicacion':
              return a.ubicacion.localeCompare(b.ubicacion);
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
      const paginatedData = productosFiltrados.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: productosFiltrados.length,
        page,
        limit,
        totalPages: Math.ceil(productosFiltrados.length / limit),
      };
    }
    
    // Para producción, usar API real
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
 * Obtener un producto por ID
 */
export const getProducto = async (id: string): Promise<Producto> => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const producto = productosMock.find(prod => prod.id === id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      
      return producto;
    }
    
    // Para producción, usar API real
    const response = await apiClient.get<ApiResponse<Producto>>(`/productos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

/**
 * Crear un nuevo producto
 */
export const createProducto = async (
  producto: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<Producto> => {
  try {
    // En desarrollo, simular creación
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const nuevoProducto: Producto = {
        ...producto,
        id: `${Date.now()}`,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      
      productosMock.push(nuevoProducto);
      return nuevoProducto;
    }
    
    // Para producción, usar API real
    const response = await apiClient.post<ApiResponse<Producto>>('/productos', producto);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};