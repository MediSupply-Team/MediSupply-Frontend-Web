// === TIPOS GENERALES ===
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// === TIPOS DE MEDICAMENTOS ===
export interface Medicamento {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  categoria: string;
  laboratorio: string;
  concentracion: string;
  formaFarmaceutica: string;
  fechaVencimiento: string;
  lote: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  estado: 'activo' | 'inactivo' | 'vencido' | 'agotado';
  fechaCreacion: string;
  fechaActualizacion: string;
}

// === TIPOS DE BODEGAS DE INVENTARIO ===
export interface BodegaInventario {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string;
  pais: string;
  cantidad: number;
}

// === TIPOS DE PRODUCTOS ===
export interface Producto {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  ubicacion: string;
  ubicacionDetalle: string;
  stock: number;
  unidadMedida: string;
  estadoStock: 'disponible' | 'stock-bajo' | 'agotado';
  fechaVencimiento?: string;
  icono: string;
  colorIcono: string;
  precio?: number;
  proveedor?: string;
  lote?: string;
  descripcion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  bodegas?: BodegaInventario[];
}

// === RESPUESTA DE PRODUCTOS ===
export interface ProductosResponse {
  data: Producto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// === TIPOS DE PROVEEDORES ===
export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  contacto: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}

// === TIPOS DE INVENTARIO ===
export interface MovimientoInventario {
  id: string;
  medicamentoId: string;
  medicamento?: Medicamento;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  cantidadAnterior: number;
  cantidadActual: number;
  motivo: string;
  referencia?: string; // Número de factura, orden, etc.
  fecha: string;
  usuario: string;
}

// === TIPOS DE REPORTES Y VENDEDORES ===
export interface Vendedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  territorio: string;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
  metaMensual: number;
  ventasActuales: number;
}

export interface VentaVendedor {
  id: string;
  vendedorId: string;
  vendedor: string;
  producto: string;
  cantidad: number;
  ingresos: number;
  estado: 'completado' | 'pendiente' | 'cancelado';
  fecha: string;
}

export interface EstadisticasVentas {
  ventasTotales: number;
  pedidosPendientes: number;
  productosEnStock: number;
  rendimientoVentas: {
    porcentaje: number;
    comparacionAnterior: number;
  };
}

export interface DatosGrafico {
  puntos: { x: number; y: number }[];
  porcentajes: { producto: string; porcentaje: number; color: string }[];
}

export interface FiltrosReportes {
  fechaInicio?: string;
  fechaFin?: string;
  vendedorId?: string;
  producto?: string;
  estado?: string;
}
export interface Ruta {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: string;
  estado: 'activa' | 'inactiva';
  ordenes: Orden[];
  distanciaTotal: number;
  tiempoEstimado: number;
}

export interface Orden {
  id: string;
  numeroOrden: string;
  cliente: string;
  direccion: string;
  telefono: string;
  productos: ProductoOrden[];
  total: number;
  estado: 'pendiente' | 'en_ruta' | 'entregada' | 'cancelada';
  fechaCreacion: string;
  fechaEntrega?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  notas?: string;
}

export interface ProductoOrden {
  medicamentoId: string;
  medicamento?: Medicamento;
  cantidad: number;
  precio: number;
  subtotal: number;
}

// === TIPOS DE FILTROS ===
export interface FiltrosProductos {
  nombre?: string;
  categoria?: string;
  laboratorio?: string;
  estado?: string;
  stockBajo?: boolean;
  page?: number;
  limit?: number;
}

export interface FiltrosInventario {
  busqueda?: string;
  categoria?: string;
  ubicacion?: string;
  stockBajo?: boolean;
  proximoVencer?: boolean;
  masSolicitados?: boolean;
  ordenarPor?: 'nombre' | 'stock' | 'actualizacion' | 'ubicacion';
  page?: number;
  limit?: number;
}

export interface FiltrosProveedores {
  nombre?: string;
  ciudad?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

export interface FiltrosInventario {
  medicamentoId?: string;
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
}

// === TIPOS DE STORE GLOBAL ===
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'farmaceutico' | 'vendedor' | 'repartidor';
  avatar?: string;
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

// === TIPOS PARA BACKEND DE PRODUCCIÓN ===
export interface SalesPerformanceFilters {
  from: string;  // YYYY-MM-DD
  to: string;    // YYYY-MM-DD
  vendor_id?: string;
  product_id?: string;
}

export interface SalesPerformanceResponse {
  filters_applied: {
    period: {
      from_: string;
      to: string;
    };
    vendor_id: string | null;
    product_id: string | null;
  };
  summary: {
    total_sales: number;
    pending_orders: number;
    products_in_stock: number;
    sales_change_pct_vs_prev_period: number;
  };
  charts: {
    trend: Array<{
      date: string;
      total: number;
    }>;
    top_products: Array<{
      product_name: string;
      amount: number;
    }>;
    others_amount: number;
  };
  table: {
    rows: Array<{
      vendor_name: string;
      product_name: string;
      quantity: number;
      revenue: number;
      status: 'pendiente' | 'completado';
    }>;
  };
  currency: string;
  export: {
    available_formats: string[];
  };
}