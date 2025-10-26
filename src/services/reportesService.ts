import { apiClient } from '@/lib/axios';
import type { 
  VentaVendedor,
  EstadisticasVentas,
  DatosGrafico,
  FiltrosReportes,
  PaginatedResponse
} from '@/types';

// === DATOS MOCK ===
const ventasVendedoresMock: VentaVendedor[] = [
  {
    id: '1',
    vendedorId: '1',
    vendedor: 'Juan Pérez',
    producto: 'Jeringas Desechables',
    cantidad: 50,
    ingresos: 10000,
    estado: 'completado',
    fecha: '2024-10-20',
  },
  {
    id: '2',
    vendedorId: '2',
    vendedor: 'María García',
    producto: 'Guantes de Látex',
    cantidad: 30,
    ingresos: 7500,
    estado: 'pendiente',
    fecha: '2024-10-19',
  },
  {
    id: '3',
    vendedorId: '3',
    vendedor: 'Pedro Rodríguez',
    producto: 'Mascarillas N95',
    cantidad: 40,
    ingresos: 8000,
    estado: 'completado',
    fecha: '2024-10-18',
  },
  {
    id: '4',
    vendedorId: '4',
    vendedor: 'Ana López',
    producto: 'Batas Quirúrgicas',
    cantidad: 25,
    ingresos: 5000,
    estado: 'pendiente',
    fecha: '2024-10-17',
  },
  {
    id: '5',
    vendedorId: '5',
    vendedor: 'Carlos Martínez',
    producto: 'Alcohol en Gel',
    cantidad: 35,
    ingresos: 6500,
    estado: 'completado',
    fecha: '2024-10-16',
  },
];

const estadisticasMock: EstadisticasVentas = {
  ventasTotales: 250000,
  pedidosPendientes: 75,
  productosEnStock: 1200,
  rendimientoVentas: {
    porcentaje: 15,
    comparacionAnterior: 1.8,
  },
};

const datosGraficoMock: DatosGrafico = {
  puntos: [
    { x: 0, y: 109 },
    { x: 36, y: 21 },
    { x: 72, y: 41 },
    { x: 108, y: 93 },
    { x: 145, y: 33 },
    { x: 181, y: 101 },
    { x: 217, y: 61 },
    { x: 254, y: 45 },
    { x: 290, y: 121 },
    { x: 326, y: 149 },
    { x: 363, y: 1 },
    { x: 399, y: 81 },
    { x: 435, y: 129 },
    { x: 472, y: 25 },
  ],
  porcentajes: [
    { producto: 'Producto A', porcentaje: 25, color: 'var(--primary-color)' },
    { producto: 'Producto B', porcentaje: 30, color: 'var(--secondary-color)' },
    { producto: 'Producto C', porcentaje: 35, color: 'var(--accent-color)' },
    { producto: 'Producto D', porcentaje: 20, color: 'var(--primary-color)' },
    { producto: 'Producto E', porcentaje: 10, color: 'var(--accent-red)' },
  ],
};

// === FUNCIONES DE SERVICIO ===

/**
 * Obtener estadísticas generales de ventas
 */
export const getEstadisticasVentas = async (): Promise<EstadisticasVentas> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return estadisticasMock;
    }
    
    const response = await apiClient.get<EstadisticasVentas>('/reportes/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * Obtener datos para los gráficos
 */
export const getDatosGraficos = async (): Promise<DatosGrafico> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 400));
      return datosGraficoMock;
    }
    
    const response = await apiClient.get<DatosGrafico>('/reportes/graficos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de gráficos:', error);
    throw error;
  }
};

/**
 * Obtener ventas de vendedores con filtros
 */
export const getVentasVendedores = async (
  filtros?: FiltrosReportes
): Promise<PaginatedResponse<VentaVendedor>> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let ventasFiltradas = [...ventasVendedoresMock];
      
      // Aplicar filtros
      if (filtros?.vendedorId) {
        ventasFiltradas = ventasFiltradas.filter(venta =>
          venta.vendedorId === filtros.vendedorId
        );
      }
      
      if (filtros?.producto) {
        ventasFiltradas = ventasFiltradas.filter(venta =>
          venta.producto.toLowerCase().includes(filtros.producto!.toLowerCase())
        );
      }
      
      if (filtros?.estado) {
        ventasFiltradas = ventasFiltradas.filter(venta =>
          venta.estado === filtros.estado
        );
      }
      
      // Filtrar por fecha (simplificado para mock)
      if (filtros?.fechaInicio || filtros?.fechaFin) {
        const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : new Date('2024-01-01');
        const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : new Date();
        
        ventasFiltradas = ventasFiltradas.filter(venta => {
          const fechaVenta = new Date(venta.fecha);
          return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
        });
      }
      
      return {
        data: ventasFiltradas,
        total: ventasFiltradas.length,
        page: 1,
        limit: ventasFiltradas.length,
        totalPages: 1,
      };
    }
    
    const response = await apiClient.get<PaginatedResponse<VentaVendedor>>('/reportes/ventas-vendedores', {
      params: filtros,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas de vendedores:', error);
    throw error;
  }
};

/**
 * Exportar reporte a Excel/PDF
 */
export const exportarReporte = async (
  formato: 'excel' | 'pdf',
  filtros?: FiltrosReportes
): Promise<Blob> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Simular descarga en desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear un blob simulado para la descarga
      const contenido = `Reporte de Vendedores - Formato: ${formato.toUpperCase()}
      
Fecha de generación: ${new Date().toLocaleDateString()}
Filtros aplicados: ${JSON.stringify(filtros, null, 2)}

Datos incluidos:
- Estadísticas generales
- Ventas por vendedor
- Gráficos de rendimiento

Este es un archivo de ejemplo generado en modo desarrollo.`;
      
      return new Blob([contenido], { 
        type: formato === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          : 'application/pdf' 
      });
    }
    
    const response = await apiClient.get(`/reportes/exportar/${formato}`, {
      params: filtros,
      responseType: 'blob',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al exportar reporte:', error);
    throw error;
  }
};