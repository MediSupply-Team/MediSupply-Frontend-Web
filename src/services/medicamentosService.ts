import { apiClient } from '@/lib/axios';
import type { 
  Medicamento, 
  ApiResponse, 
  PaginatedResponse, 
  FiltrosProductos 
} from '@/types';

// === DATOS MOCK ===
const medicamentosMock: Medicamento[] = [
  {
    id: '1',
    nombre: 'Acetaminofén',
    codigo: 'MED001',
    descripcion: 'Analgésico y antipirético',
    categoria: 'Analgésicos',
    laboratorio: 'Genfar',
    concentracion: '500mg',
    formaFarmaceutica: 'Tableta',
    fechaVencimiento: '2025-12-31',
    lote: 'LOT001',
    precio: 2500,
    stock: 150,
    stockMinimo: 50,
    estado: 'activo',
    fechaCreacion: '2024-01-15',
    fechaActualizacion: '2024-10-20',
  },
  {
    id: '2',
    nombre: 'Ibuprofeno',
    codigo: 'MED002',
    descripcion: 'Antiinflamatorio no esteroideo',
    categoria: 'Antiinflamatorios',
    laboratorio: 'Mk',
    concentracion: '600mg',
    formaFarmaceutica: 'Tableta',
    fechaVencimiento: '2025-08-15',
    lote: 'LOT002',
    precio: 3200,
    stock: 25,
    stockMinimo: 30,
    estado: 'activo',
    fechaCreacion: '2024-02-10',
    fechaActualizacion: '2024-10-18',
  },
  {
    id: '3',
    nombre: 'Amoxicilina',
    codigo: 'MED003',
    descripcion: 'Antibiótico betalactámico',
    categoria: 'Antibióticos',
    laboratorio: 'Pfizer',
    concentracion: '500mg',
    formaFarmaceutica: 'Cápsula',
    fechaVencimiento: '2024-12-01',
    lote: 'LOT003',
    precio: 4800,
    stock: 0,
    stockMinimo: 20,
    estado: 'agotado',
    fechaCreacion: '2024-01-05',
    fechaActualizacion: '2024-10-15',
  },
];

// === FUNCIONES DE SERVICIO ===

/**
 * Obtener todos los medicamentos con filtros opcionales
 */
export const getMedicamentos = async (
  filtros?: FiltrosProductos
): Promise<PaginatedResponse<Medicamento>> => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let medicamentosFiltrados = [...medicamentosMock];
      
      // Aplicar filtros
      if (filtros?.nombre) {
        medicamentosFiltrados = medicamentosFiltrados.filter(med =>
          med.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
        );
      }
      
      if (filtros?.categoria) {
        medicamentosFiltrados = medicamentosFiltrados.filter(med =>
          med.categoria === filtros.categoria
        );
      }
      
      if (filtros?.estado) {
        medicamentosFiltrados = medicamentosFiltrados.filter(med =>
          med.estado === filtros.estado
        );
      }
      
      if (filtros?.stockBajo) {
        medicamentosFiltrados = medicamentosFiltrados.filter(med =>
          med.stock <= med.stockMinimo
        );
      }
      
      // Paginación
      const page = filtros?.page || 1;
      const limit = filtros?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = medicamentosFiltrados.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: medicamentosFiltrados.length,
        page,
        limit,
        totalPages: Math.ceil(medicamentosFiltrados.length / limit),
      };
    }
    
    // Para producción, usar API real
    const response = await apiClient.get<PaginatedResponse<Medicamento>>('/medicamentos', {
      params: filtros,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    throw error;
  }
};

/**
 * Obtener un medicamento por ID
 */
export const getMedicamento = async (id: string): Promise<Medicamento> => {
  try {
    // En desarrollo, usar datos mock
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const medicamento = medicamentosMock.find(med => med.id === id);
      if (!medicamento) {
        throw new Error('Medicamento no encontrado');
      }
      
      return medicamento;
    }
    
    // Para producción, usar API real
    const response = await apiClient.get<ApiResponse<Medicamento>>(`/medicamentos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener medicamento:', error);
    throw error;
  }
};

/**
 * Crear un nuevo medicamento
 */
export const createMedicamento = async (
  medicamento: Omit<Medicamento, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<Medicamento> => {
  try {
    // En desarrollo, simular creación
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevoMedicamento: Medicamento = {
        ...medicamento,
        id: `${Date.now()}`,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      
      medicamentosMock.push(nuevoMedicamento);
      return nuevoMedicamento;
    }
    
    // Para producción, usar API real
    const response = await apiClient.post<ApiResponse<Medicamento>>('/medicamentos', medicamento);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear medicamento:', error);
    throw error;
  }
};

/**
 * Actualizar un medicamento existente
 */
export const updateMedicamento = async (
  id: string,
  medicamento: Partial<Omit<Medicamento, 'id' | 'fechaCreacion' | 'fechaActualizacion'>>
): Promise<Medicamento> => {
  try {
    // En desarrollo, simular actualización
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = medicamentosMock.findIndex(med => med.id === id);
      if (index === -1) {
        throw new Error('Medicamento no encontrado');
      }
      
      medicamentosMock[index] = {
        ...medicamentosMock[index],
        ...medicamento,
        fechaActualizacion: new Date().toISOString(),
      };
      
      return medicamentosMock[index];
    }
    
    // Para producción, usar API real
    const response = await apiClient.put<ApiResponse<Medicamento>>(`/medicamentos/${id}`, medicamento);
    return response.data.data;
  } catch (error) {
    console.error('Error al actualizar medicamento:', error);
    throw error;
  }
};

/**
 * Eliminar un medicamento
 */
export const deleteMedicamento = async (id: string): Promise<void> => {
  try {
    // En desarrollo, simular eliminación
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = medicamentosMock.findIndex(med => med.id === id);
      if (index === -1) {
        throw new Error('Medicamento no encontrado');
      }
      
      medicamentosMock.splice(index, 1);
      return;
    }
    
    // Para producción, usar API real
    await apiClient.delete(`/medicamentos/${id}`);
  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    throw error;
  }
};