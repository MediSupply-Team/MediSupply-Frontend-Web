// === STORE EXPORTS ===
export { useAppStore, useUser, useTheme, useNotifications, useSidebar } from './store/appStore';

// === HOOKS EXPORTS ===
export { 
  useMedicamentos,
  useMedicamento,
  useCreateMedicamento,
  useUpdateMedicamento,
  useDeleteMedicamento,
  useMedicamentosStockBajo,
  useMedicamentosPorCategoria,
  usePrefetchMedicamentos,
} from './hooks/useMedicamentos';

// === SERVICES EXPORTS ===
export {
  getMedicamentos,
  getMedicamento,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
} from './services/medicamentosService';

export {
  getProveedores,
  getProveedor,
  createProveedor,
} from './services/proveedoresService';

// === LIB EXPORTS ===
export { apiClient } from './lib/axios';
export { queryClient, queryKeys } from './lib/react-query';

// === TYPES EXPORTS ===
export type {
  // API Types
  ApiResponse,
  PaginatedResponse,
  
  // Domain Types
  Medicamento,
  Proveedor,
  MovimientoInventario,
  Ruta,
  Orden,
  ProductoOrden,
  
  // Filter Types
  FiltrosProductos,
  FiltrosProveedores,
  FiltrosInventario,
  
  // App Types
  User,
  AppState,
  Notification,
} from './types';