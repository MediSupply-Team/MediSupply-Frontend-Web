import type { SalesPerformanceFilters, SalesPerformanceResponse } from '@/types';

// === CONFIGURACIÓN DEL BACKEND ===
const BACKEND_BASE_URL = 'https://medisupply-backend.duckdns.org'; // Llamadas directas al backend

/**
 * Cliente HTTP para el backend de producción
 */
class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza una petición HTTP genérica
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    try {
      console.log('🔍 Fetching:', url);
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error en petición a ${url}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene datos de performance de ventas
   */
  async getSalesPerformance(filters: SalesPerformanceFilters): Promise<SalesPerformanceResponse> {
    const params = new URLSearchParams({
      from: filters.from,
      to: filters.to,
    });

    if (filters.vendor_id) {
      params.append('vendor_id', filters.vendor_id);
    }

    if (filters.product_id) {
      params.append('product_id', filters.product_id);
    }

    const endpoint = `/venta/api/reports/sales-performance?${params.toString()}`;
    console.log('🌐 Llamando al backend:', `${this.baseUrl}${endpoint}`);
    
    const response = await this.request<SalesPerformanceResponse>(endpoint);
    console.log('✅ Respuesta del backend:', response);
    
    return response;
  }

  /**
   * Obtiene datos de performance de ventas con fechas por defecto (último mes)
   */
  async getSalesPerformanceDefault(): Promise<SalesPerformanceResponse> {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const filters: SalesPerformanceFilters = {
      from: lastMonth.toISOString().split('T')[0],
      to: endOfLastMonth.toISOString().split('T')[0],
    };

    return this.getSalesPerformance(filters);
  }

  /**
   * Exporta reporte en formato PDF
   */
  async exportSalesReport(filters: SalesPerformanceFilters, format: 'pdf' | 'csv'): Promise<{
    url: string;
    format: string;
    expires_in_seconds: number;
    message: string;
  }> {
    const params = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      format: format,
    });

    if (filters.vendor_id) {
      params.append('vendor_id', filters.vendor_id);
    }

    if (filters.product_id) {
      params.append('product_id', filters.product_id);
    }

    return this.request<{
      url: string;
      format: string;
      expires_in_seconds: number;
      message: string;
    }>(`/venta/api/reports/sales-performance/export?${params.toString()}`);
  }
}

// === INSTANCIA SINGLETON ===
export const backendService = new BackendService();

// === FUNCIONES DE CONVENIENCIA ===

/**
 * Obtiene datos de performance de ventas
 */
export const getSalesPerformance = (filters: SalesPerformanceFilters) => 
  backendService.getSalesPerformance(filters);

/**
 * Obtiene datos de performance de ventas del último mes
 */
export const getSalesPerformanceDefault = () => 
  backendService.getSalesPerformanceDefault();

/**
 * Exporta reporte de ventas en el formato especificado
 */
export const exportSalesReport = (filters: SalesPerformanceFilters, format: 'pdf' | 'csv') =>
  backendService.exportSalesReport(filters, format);

/**
 * Convierte datos del backend al formato esperado por la UI
 */
export const transformSalesDataForUI = (data: SalesPerformanceResponse) => {
  return {
    // Estadísticas para las tarjetas
    estadisticas: {
      ventasTotales: data.summary.total_sales,
      ordenesPendientes: data.summary.pending_orders,
      productosEnStock: data.summary.products_in_stock,
      cambioVentas: data.summary.sales_change_pct_vs_prev_period,
    },
    
    // Datos para gráficos
    graficos: {
      tendencia: data.charts.trend.map(item => ({
        fecha: item.date,
        ventas: item.total,
      })),
      productosTop: data.charts.top_products.map(item => ({
        nombre: item.product_name,
        valor: item.amount,
      })),
    },
    
    // Datos para la tabla
    tabla: data.table.rows.map((row, index) => ({
      id: `${index + 1}`,
      vendedorId: `vendor_${index + 1}`,
      vendedor: row.vendor_name,
      producto: row.product_name,
      cantidad: row.quantity,
      ingresos: row.revenue,
      estado: row.status,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual como placeholder
    })),
    
    // Metadatos
    metadata: {
      moneda: data.currency,
      formatosExportacion: data.export.available_formats,
      filtrosAplicados: data.filters_applied,
    },
  };
};