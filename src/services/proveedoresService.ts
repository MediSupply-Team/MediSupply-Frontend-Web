import { apiClient } from '@/lib/axios';
import type { 
  Proveedor, 
  ApiResponse, 
  PaginatedResponse, 
  FiltrosProveedores 
} from '@/types';

// === DATOS MOCK ===
const proveedoresMock: Proveedor[] = [
  {
    id: '1',
    nombre: 'Laboratorios Genfar S.A.',
    nit: '860123456-1',
    telefono: '+57 1 234 5678',
    email: 'contacto@genfar.com',
    direccion: 'Calle 100 # 11A-35',
    ciudad: 'Bogotá',
    contacto: 'María González',
    estado: 'activo',
    fechaCreacion: '2024-01-10',
    fechaActualizacion: '2024-10-15',
  },
  {
    id: '2',
    nombre: 'Pfizer Colombia',
    nit: '860987654-2',
    telefono: '+57 1 987 6543',
    email: 'info@pfizer.com.co',
    direccion: 'Carrera 7 # 71-21',
    ciudad: 'Bogotá',
    contacto: 'Carlos Rodríguez',
    estado: 'activo',
    fechaCreacion: '2024-02-05',
    fechaActualizacion: '2024-09-20',
  },
  {
    id: '3',
    nombre: 'Mk Laboratorios',
    nit: '860456789-3',
    telefono: '+57 4 321 9876',
    email: 'ventas@mk.com.co',
    direccion: 'Calle 30 Sur # 45-15',
    ciudad: 'Medellín',
    contacto: 'Ana Martínez',
    estado: 'inactivo',
    fechaCreacion: '2024-01-20',
    fechaActualizacion: '2024-08-10',
  },
];

// === FUNCIONES DE SERVICIO ===

/**
 * Obtener todos los proveedores con filtros opcionales
 */
export const getProveedores = async (
  filtros?: FiltrosProveedores
): Promise<PaginatedResponse<Proveedor>> => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let proveedoresFiltrados = [...proveedoresMock];
      
      // Aplicar filtros
      if (filtros?.nombre) {
        proveedoresFiltrados = proveedoresFiltrados.filter(prov =>
          prov.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
        );
      }
      
      if (filtros?.ciudad) {
        proveedoresFiltrados = proveedoresFiltrados.filter(prov =>
          prov.ciudad.toLowerCase().includes(filtros.ciudad!.toLowerCase())
        );
      }
      
      if (filtros?.estado) {
        proveedoresFiltrados = proveedoresFiltrados.filter(prov =>
          prov.estado === filtros.estado
        );
      }
      
      // Paginación
      const page = filtros?.page || 1;
      const limit = filtros?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = proveedoresFiltrados.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: proveedoresFiltrados.length,
        page,
        limit,
        totalPages: Math.ceil(proveedoresFiltrados.length / limit),
      };
    }
    
    // Para producción, usar API real
    const response = await apiClient.get<PaginatedResponse<Proveedor>>('/proveedores', {
      params: filtros,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

/**
 * Obtener un proveedor por ID
 */
export const getProveedor = async (id: string): Promise<Proveedor> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const proveedor = proveedoresMock.find(prov => prov.id === id);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }
      
      return proveedor;
    }
    
    const response = await apiClient.get<ApiResponse<Proveedor>>(`/proveedores/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    throw error;
  }
};

/**
 * Crear un nuevo proveedor
 */
export const createProveedor = async (
  proveedor: Omit<Proveedor, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<Proveedor> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const nuevoProveedor: Proveedor = {
        ...proveedor,
        id: `${Date.now()}`,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      
      proveedoresMock.push(nuevoProveedor);
      return nuevoProveedor;
    }
    
    const response = await apiClient.post<ApiResponse<Proveedor>>('/proveedores', proveedor);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
};