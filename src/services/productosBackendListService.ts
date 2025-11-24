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
  private cacheProductos: ProductoBackendResponse[] | null = null;
  private cacheTimestamp: number = 0;
  private cacheDurationMs = 2 * 60 * 1000; // 2 minutos

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
    
    // Manejar caso donde inventarioResumen puede ser null
    const cantidadTotal = productoBackend.inventarioResumen?.cantidadTotal ?? 0;
    
    return {
      id: productoBackend.id,
      nombre: productoBackend.nombre,
      sku: productoBackend.codigo,
      categoria: categoriaUI,
      stock: cantidadTotal,
      unidadMedida: productoBackend.presentacion || 'unidad',
      ubicacion: 'Almacén Principal', // Placeholder por defecto
      ubicacionDetalle: 'Estante A-1', // Placeholder por defecto
      estadoStock: this.determinarEstadoStock(cantidadTotal),
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
  private construirParams(page = 1, size = 50): URLSearchParams {
    const params = new URLSearchParams();
    
    params.set('page', page.toString());
    params.set('size', size.toString());
    
    return params;
  }

  /**
   * Obtiene TODOS los productos del backend haciendo múltiples llamadas si es necesario
   */
  private async obtenerTodosLosProductos(filtros?: FiltrosInventario): Promise<ProductoBackendResponse[]> {
    // Verificar cache (solo para productos sin filtro de categoría para simplicidad)
    const ahoraMs = Date.now();
    const usarCache = !filtros?.categoria || filtros.categoria === 'Todas las categorías';
    
    if (usarCache && this.cacheProductos && (ahoraMs - this.cacheTimestamp) < this.cacheDurationMs) {
      console.log('Usando productos desde cache');
      return this.cacheProductos;
    }

    const maxSize = 50; // Límite máximo del backend
    let page = 1;
    let todosLosProductos: ProductoBackendResponse[] = [];
    let hayMasPaginas = true;

    // Construir parámetros base (solo categoría si existe)
    const baseParams = new URLSearchParams();
    if (filtros?.categoria && filtros.categoria !== 'Todas las categorías') {
      const mapeoCategoria: Record<string, string> = {
        'Equipos Médicos': 'MEDICAL_EQUIPMENT',
        'Insumos Descartables': 'DISPOSABLES',
        'Medicamentos': 'ANALGESICS',
        'Material Quirúrgico': 'SURGICAL',
        'Equipos de Protección': 'PROTECTION'
      };
      
      const categoriaBackend = mapeoCategoria[filtros.categoria];
      if (categoriaBackend) {
        baseParams.set('categoria', categoriaBackend);
      }
    }

    console.log('Obteniendo todos los productos del backend...');

    while (hayMasPaginas) {
      const params = new URLSearchParams(baseParams);
      params.set('page', page.toString());
      params.set('size', maxSize.toString());
      
      const endpoint = `/venta/api/v1/catalog/items?${params.toString()}`;
      
      try {
        console.log(`Página ${page}: ${this.baseUrl}${endpoint}`);
        const response = await this.request<ProductosBackendResponse>(endpoint);
        
        todosLosProductos = [...todosLosProductos, ...response.items];
        
        console.log(`Página ${page}: ${response.items.length} productos, total acumulado: ${todosLosProductos.length}`);
        
        // Verificar si hay más páginas
        const totalPaginas = Math.ceil(response.meta.total / maxSize);
        hayMasPaginas = page < totalPaginas;
        page++;
        
      } catch (error) {
        console.error(`Error obteniendo página ${page}:`, error);
        break;
      }
    }

    console.log(`Total productos obtenidos: ${todosLosProductos.length}`);
    
    // Guardar en cache solo si no hay filtro de categoría
    if (usarCache) {
      this.cacheProductos = todosLosProductos;
      this.cacheTimestamp = ahoraMs;
      console.log('Productos guardados en cache');
    }
    
    return todosLosProductos;
  }

  /**
   * Aplica filtros de búsqueda localmente
   */
  private aplicarFiltrosBusqueda(productos: Producto[], filtros?: FiltrosInventario): Producto[] {
    let productosFiltrados = [...productos];
    
    // Filtro de búsqueda por nombre, SKU o código
    if (filtros?.busqueda && filtros.busqueda.trim()) {
      const busqueda = filtros.busqueda.toLowerCase().trim();
      productosFiltrados = productosFiltrados.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.sku.toLowerCase().includes(busqueda) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda))
      );
    }
    
    // Filtro de stock bajo
    if (filtros?.stockBajo) {
      productosFiltrados = productosFiltrados.filter(p => p.estadoStock === 'stock-bajo');
    }
    
    // Filtro de próximo a vencer - productos que vencen en 30 días
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
    
    return productosFiltrados;
  }

  /**
   * Obtiene productos desde el backend
   */
  async obtenerProductos(filtros?: FiltrosInventario): Promise<ProductosResponse> {
    console.log('Filtros aplicados:', {
      busqueda: filtros?.busqueda,
      categoria: filtros?.categoria,
      page: filtros?.page,
      limit: filtros?.limit,
      stockBajo: filtros?.stockBajo,
      proximoVencer: filtros?.proximoVencer,
      masSolicitados: filtros?.masSolicitados
    });
    
    // Siempre traer todos los productos para hacer filtrado local
    const todosLosProductosBackend = await this.obtenerTodosLosProductos(filtros);
    
    // Convertir respuesta del backend al formato de la UI
    const productosUI = todosLosProductosBackend.map(item => this.convertirProductoBackendToUI(item));
    
    console.log(`Productos convertidos a UI: ${productosUI.length}`);
    
    // Aplicar filtros locales (búsqueda, stock bajo, etc.)
    const productosFiltrados = this.aplicarFiltrosBusqueda(productosUI, filtros);
    
    console.log(`Productos después del filtrado: ${productosFiltrados.length}`);
    
    // Ordenamiento (cliente)
    let productosOrdenados = productosFiltrados;
    if (filtros?.ordenarPor) {
      productosOrdenados = [...productosFiltrados].sort((a, b) => {
        switch (filtros.ordenarPor) {
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          case 'stock':
            return b.stock - a.stock;
          case 'ubicacion':
            return a.ubicacion.localeCompare(b.ubicacion);
          case 'actualizacion':
            return a.nombre.localeCompare(b.nombre);
          default:
            return 0;
        }
      });
    }
    
    // Calcular paginación local
    const totalFiltrados = productosOrdenados.length;
    const page = filtros?.page || 1;
    const limit = filtros?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const datosPaginados = productosOrdenados.slice(startIndex, endIndex);
    
    const resultado = {
      data: datosPaginados,
      page: page,
      limit: limit,
      total: totalFiltrados,
      totalPages: Math.ceil(totalFiltrados / limit),
    };
    
    console.log('Resultado final:', {
      totalProductos: todosLosProductosBackend.length,
      totalFiltrado: totalFiltrados,
      page: page,
      totalPages: resultado.totalPages,
      datosEnPagina: datosPaginados.length,
      rango: `${startIndex + 1}-${Math.min(endIndex, totalFiltrados)} de ${totalFiltrados}`
    });
    
    return resultado;
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