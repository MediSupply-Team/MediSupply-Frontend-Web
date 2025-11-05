import type { FiltrosInventario, Producto, ProductosResponse } from '@/types';

// === CONFIGURACIÓN DEL BACKEND ===
const BACKEND_BASE_URL = 'https://medisupply-backend.duckdns.org'; // Llamadas directas al backend

// === TIPOS DEL BACKEND ===
export interface ProductoBackendResponse {
  categoria: string;
  codigo: string;
  id: string;
  inventarioResumen: {
    cantidadTotal: number;
    paises: string[];
  };
  nombre: string;
  precioUnitario: number;
  presentacion: string;
  requisitosAlmacenamiento: string;
}

export interface ProductosBackendResponse {
  items: ProductoBackendResponse[];
  meta: {
    page: number;
    size: number;
    tookMs: number;
    total: number;
  };
}

/**
 * Cliente HTTP para obtener productos del backend
 */
class ProductosBackendListService {
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
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error en petición a ${url}:`, error);
      throw error;
    }
  }

  /**
   * Mapea la categoría del backend a categoría de UI
   */
  private mapearCategoriaBackendToUI(categoria: string): string {
    const mapeoCategoria: Record<string, string> = {
      'MEDICAL_EQUIPMENT': 'Equipos Médicos',
      'DISPOSABLES': 'Insumos Descartables',
      'ANALGESICS': 'Medicamentos',
      'ANTIBIOTICS': 'Medicamentos',
      'CARDIOVASCULAR': 'Medicamentos',
      'RESPIRATORY': 'Medicamentos',
      'GASTROINTESTINAL': 'Medicamentos',
      'SURGICAL': 'Material Quirúrgico',
      'PROTECTION': 'Equipos de Protección',
      'GENERAL': 'Equipos Médicos'
    };
    
    return mapeoCategoria[categoria] || 'Equipos Médicos';
  }

  /**
   * Genera un icono basado en la categoría
   */
  private obtenerIconoPorCategoria(categoria: string): string {
    const iconos: Record<string, string> = {
      'ANALGESICS': 'medication',
      'ANTIBIOTICS': 'medication',
      'CARDIOVASCULAR': 'heart_plus',
      'RESPIRATORY': 'air',
      'GASTROINTESTINAL': 'medication',
      'MEDICAL_EQUIPMENT': 'medical_services',
      'DISPOSABLES': 'inventory_2',
      'SURGICAL': 'surgical',
      'PROTECTION': 'shield',
      'GENERAL': 'inventory'
    };
    
    return iconos[categoria] || 'inventory';
  }

  /**
   * Genera un color de icono basado en la categoría
   */
  private obtenerColorIcono(categoria: string): string {
    const colores: Record<string, string> = {
      'ANALGESICS': '#3B82F6',
      'ANTIBIOTICS': '#10B981',
      'CARDIOVASCULAR': '#EF4444',
      'RESPIRATORY': '#06B6D4',
      'GASTROINTESTINAL': '#8B5CF6',
      'MEDICAL_EQUIPMENT': '#F59E0B',
      'DISPOSABLES': '#6B7280',
      'SURGICAL': '#EC4899',
      'PROTECTION': '#84CC16',
      'GENERAL': '#6366F1'
    };
    
    return colores[categoria] || '#6366F1';
  }

  /**
   * Determina el estado del stock basado en la cantidad
   */
  private determinarEstadoStock(cantidadTotal: number): 'disponible' | 'stock-bajo' | 'agotado' {
    if (cantidadTotal === 0) return 'agotado';
    if (cantidadTotal <= 100) return 'stock-bajo';
    return 'disponible';
  }

  /**
   * Genera fecha de vencimiento por defecto (6 meses desde hoy)
   */
  private generarFechaVencimientoDefault(): string {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 6);
    return fecha.toISOString().split('T')[0];
  }

  /**
   * Convierte producto del backend al formato de la UI
   */
  private convertirProductoBackendToUI(productoBackend: ProductoBackendResponse): Producto {
    const categoriaUI = this.mapearCategoriaBackendToUI(productoBackend.categoria);
    
    return {
      id: productoBackend.id,
      nombre: productoBackend.nombre,
      sku: productoBackend.codigo,
      categoria: categoriaUI,
      stock: productoBackend.inventarioResumen.cantidadTotal,
      unidadMedida: productoBackend.presentacion || 'unidad',
      ubicacion: 'Almacén Principal', // Placeholder por defecto
      ubicacionDetalle: 'Estante A-1', // Placeholder por defecto
      estadoStock: this.determinarEstadoStock(productoBackend.inventarioResumen.cantidadTotal),
      fechaVencimiento: this.generarFechaVencimientoDefault(), // Fecha por defecto
      icono: this.obtenerIconoPorCategoria(productoBackend.categoria),
      colorIcono: this.obtenerColorIcono(productoBackend.categoria),
      precio: productoBackend.precioUnitario,
      proveedor: 'Por Definir', // Placeholder
      lote: 'LOTE-2024-001', // Placeholder
      descripcion: productoBackend.requisitosAlmacenamiento || '',
    };
  }

  /**
   * Construye parámetros de query para el backend
   */
  private construirParams(filtros?: FiltrosInventario): URLSearchParams {
    const params = new URLSearchParams();
    
    // Paginación
    params.set('page', (filtros?.page || 1).toString());
    params.set('size', (filtros?.limit || 10).toString());
    
    // Búsqueda por nombre o código
    if (filtros?.busqueda) {
      // El backend podría tener parámetros específicos para búsqueda
      // Por ahora usamos un parámetro genérico
      params.set('search', filtros.busqueda);
    }
    
    // Categoría (mapear de UI a backend)
    if (filtros?.categoria && filtros.categoria !== 'Todas las categorías') {
      const mapeoCategoria: Record<string, string> = {
        'Equipos Médicos': 'MEDICAL_EQUIPMENT',
        'Insumos Descartables': 'DISPOSABLES',
        'Medicamentos': 'ANALGESICS', // Usamos ANALGESICS como categoría base
        'Material Quirúrgico': 'SURGICAL',
        'Equipos de Protección': 'PROTECTION'
      };
      
      const categoriaBackend = mapeoCategoria[filtros.categoria];
      if (categoriaBackend) {
        params.set('categoria', categoriaBackend);
      }
    }
    
    return params;
  }

  /**
   * Obtiene productos desde el backend
   */
  async obtenerProductos(filtros?: FiltrosInventario): Promise<ProductosResponse> {
    const params = this.construirParams(filtros);
    const endpoint = `/venta/api/v1/catalog/items?${params.toString()}`;
    
    console.log('Obteniendo productos desde backend:', `${this.baseUrl}${endpoint}`);
    
    const response = await this.request<ProductosBackendResponse>(endpoint);
    
    // Convertir respuesta del backend al formato de la UI
    const productosUI = response.items.map(item => this.convertirProductoBackendToUI(item));
    
    // Aplicar filtros adicionales que el backend no soporte
    let productosFiltrados = productosUI;
    
    // Filtro de stock bajo (cliente)
    if (filtros?.stockBajo) {
      productosFiltrados = productosFiltrados.filter(p => p.estadoStock === 'stock-bajo');
    }
    
    // Filtro de próximo a vencer (cliente) - productos que vencen en 30 días
    if (filtros?.proximoVencer) {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + 30);
      
      productosFiltrados = productosFiltrados.filter(p => {
        if (!p.fechaVencimiento) return false;
        const fechaVenc = new Date(p.fechaVencimiento);
        return fechaVenc <= fechaLimite;
      });
    }
    
    // Filtro de más solicitados (simulado)
    if (filtros?.masSolicitados) {
      productosFiltrados = productosFiltrados.filter(p => p.stock > 1000);
    }
    
    // Ordenamiento (cliente)
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
            // Como no tenemos fecha de actualización, usar nombre
            return a.nombre.localeCompare(b.nombre);
          default:
            return 0;
        }
      });
    }
    
    return {
      data: productosFiltrados,
      page: response.meta.page,
      limit: response.meta.size,
      total: response.meta.total,
      totalPages: Math.ceil(response.meta.total / response.meta.size),
    };
  }
}

// === INSTANCIA SINGLETON ===
export const productosBackendListService = new ProductosBackendListService();

// === FUNCIONES DE CONVENIENCIA ===

/**
 * Obtiene productos desde el backend
 */
export const obtenerProductosBackend = (filtros?: FiltrosInventario) => 
  productosBackendListService.obtenerProductos(filtros);