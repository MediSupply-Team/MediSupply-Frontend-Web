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
  fechaCreacion: string;
  fechaActualizacion: string;
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

// === TIPOS DE RUTAS ===
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