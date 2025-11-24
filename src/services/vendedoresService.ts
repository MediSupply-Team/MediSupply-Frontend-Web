const API_BASE_URL = 'https://medisupply-backend.duckdns.org/cliente/api/v1';

export interface Vendedor {
  id: string;
  username: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  identificacion: string;
  pais: string;
  fecha_ingreso: string;
  activo: boolean;
  rol: string;
  rol_vendedor_id: number;
  territorio_id: number;
  supervisor_id: string | null;
  plan_venta_id: number;
  observaciones: string;
  clientes_asociados: string[];
  created_at: string;
  updated_at: string;
}

export interface VendedoresResponse {
  items: Vendedor[];
  page: number;
  size: number;
  total: number;
  took_ms: number;
}

export const vendedoresService = {
  /**
   * Obtiene el listado de vendedores
   */
  async obtenerVendedores(page: number = 1, size: number = 50): Promise<VendedoresResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendedores/?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener vendedores: ${response.status}`);
      }

      const data: VendedoresResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerVendedores:', error);
      throw error;
    }
  },
};
