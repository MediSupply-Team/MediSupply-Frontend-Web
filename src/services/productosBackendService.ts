import { v4 as uuidv4 } from 'uuid';

// === CONFIGURACIÓN DEL BACKEND ===
const BACKEND_BASE_URL = 'https://medisupply-backend.duckdns.org'; // Llamadas directas al backend

export interface CrearProductoBackend {
  id: string;
  nombre: string;
  codigo: string;
  categoria: string;
  precioUnitario: number;
  presentacion: string;
  requisitosAlmacenamiento: string;
  stockMinimo: number;
  stockCritico: number;
  requiereLote: boolean;
  requiereVencimiento: boolean;
  proveedorId: string;
  bodegasIniciales: {
    bodega_id: string;
    pais: string;
    lote: string;
    fecha_vencimiento: string;
  }[];
}

export interface FormularioProducto {
  nombre: string;
  sku: string;
  codigoBarras?: string;
  categoria: string;
  marca?: string;
  descripcion?: string;
  stockInicial: number;
  stockMinimo: number;
  unidadMedida: string;
  almacen: string;
  ubicacion?: string;
  temperatura: string;
  fechaVencimiento?: string;
  precioCosto: number;
  precioVenta: number;
  proveedor?: string;
  registroSanitario?: string;
}

/**
 * Cliente HTTP para el backend de productos
 */
class ProductosBackendService {
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
   * Genera un ID único para el producto
   */
  private generarIdProducto(): string {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `PROD${uuid}`;
  }

  /**
   * Genera un código único para el producto
   */
  private generarCodigoProducto(nombre: string): string {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    const prefijo = nombre.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    return `${prefijo}${uuid}`;
  }

  /**
   * Mapea la categoría del formulario a las categorías del backend
   */
  private mapearCategoria(categoria: string): string {
    const mapeoCategoria: Record<string, string> = {
      'Equipos Médicos': 'MEDICAL_EQUIPMENT',
      'Insumos Descartables': 'DISPOSABLES',
      'Medicamentos': 'ANALGESICS',
      'Material Quirúrgico': 'SURGICAL',
      'Equipos de Protección': 'PROTECTION'
    };
    
    return mapeoCategoria[categoria] || 'GENERAL';
  }

  /**
   * Mapea el almacén a bodega_id
   */
  private mapearAlmacen(almacen: string): string {
    const mapeoBodega: Record<string, string> = {
      'Almacén Principal': 'MED_PRINCIPAL',
      'Almacén Quirófano': 'MED_QUIROFANO',
      'Bodega Refrigerada': 'MED_REFRIGERADA',
      'Área de Cuarentena': 'MED_CUARENTENA'
    };
    
    return mapeoBodega[almacen] || 'MED_PRINCIPAL';
  }

  /**
   * Convierte datos del formulario al formato del backend
   */
  public convertirFormularioABackend(formulario: FormularioProducto): CrearProductoBackend {
    const id = this.generarIdProducto();
    const codigo = this.generarCodigoProducto(formulario.nombre);
    
    // Calcular stock crítico (20% del stock mínimo)
    const stockCritico = Math.max(1, Math.floor(formulario.stockMinimo * 0.2));
    
    // Generar lote único
    const lote = `LOTE_${new Date().getFullYear()}_${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Fecha de vencimiento o fecha por defecto (2 años)
    const fechaVencimiento = formulario.fechaVencimiento || 
      new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      id,
      nombre: formulario.nombre,
      codigo,
      categoria: this.mapearCategoria(formulario.categoria),
      precioUnitario: formulario.precioVenta || formulario.precioCosto || 0,
      presentacion: formulario.unidadMedida || 'unidad',
      requisitosAlmacenamiento: this.generarRequisitosAlmacenamiento(formulario.temperatura, formulario.descripcion),
      stockMinimo: formulario.stockMinimo,
      stockCritico,
      requiereLote: true,
      requiereVencimiento: !!formulario.fechaVencimiento || formulario.categoria === 'Medicamentos',
      proveedorId: uuidv4(), // Generar UUID válido para el proveedor
      bodegasIniciales: [
        {
          bodega_id: this.mapearAlmacen(formulario.almacen),
          pais: 'CO',
          lote,
          fecha_vencimiento: fechaVencimiento
        }
      ]
    };
  }

  /**
   * Genera requisitos de almacenamiento basado en temperatura y descripción
   */
  private generarRequisitosAlmacenamiento(temperatura: string, descripcion?: string): string {
    let requisitos = '';
    
    switch (temperatura) {
      case 'Refrigerado (2-8°C)':
        requisitos = 'Mantener refrigerado entre 2-8°C';
        break;
      case 'Congelado (-18°C)':
        requisitos = 'Mantener congelado a -18°C';
        break;
      case 'Ambiente Controlado':
        requisitos = 'Temperatura ambiente controlada, lugar seco';
        break;
      default:
        requisitos = 'Lugar seco, temperatura ambiente';
    }
    
    if (descripcion) {
      requisitos += `. ${descripcion}`;
    }
    
    return requisitos;
  }

  /**
   * Crea un nuevo producto en el backend
   */
  async crearProducto(formulario: FormularioProducto): Promise<CrearProductoBackend> {
    const productoBackend = this.convertirFormularioABackend(formulario);
    
    console.log('Creando producto en backend:', productoBackend);
    
    return this.request<CrearProductoBackend>(
      '/venta/api/v1/catalog/items',
      {
        method: 'POST',
        body: JSON.stringify(productoBackend),
      }
    );
  }
}

// === INSTANCIA SINGLETON ===
export const productosBackendService = new ProductosBackendService();

// === FUNCIONES DE CONVENIENCIA ===

/**
 * Crea un producto usando el backend
 */
export const crearProductoBackend = (formulario: FormularioProducto) => 
  productosBackendService.crearProducto(formulario);