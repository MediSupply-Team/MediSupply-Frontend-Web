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

export interface CrearVendedorRequest {
  identificacion: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  pais: string;
  username: string;
  rol: string;
  rol_vendedor_id: number;
  territorio_id: number;
  fecha_ingreso: string;
  observaciones: string;
  activo: boolean;
  clientes_ids: string[];
  plan_venta: {
    tipo_plan_id: number;
    nombre_plan: string;
    fecha_inicio: string;
    fecha_fin: string;
    meta_ventas: number;
    comision_base: number;
    estructura_bonificaciones: {
      [key: string]: number;
    };
    observaciones: string;
    productos: {
      producto_id: string;
      meta_cantidad: number;
      precio_unitario: number;
    }[];
    region_ids: number[];
    zona_ids: number[];
  };
}

export interface CrearVendedorResponse extends Vendedor {
  generated_password: string | null;
  clientes_con_vendedor_previo: unknown;
  clientes_no_encontrados: unknown;
  created_by_user_id: string | null;
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

  /**
   * Crea un nuevo vendedor
   */
  async crearVendedor(data: CrearVendedorRequest): Promise<CrearVendedorResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vendedores/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al crear vendedor: ${response.status}`);
      }

      const resultado: CrearVendedorResponse = await response.json();
      return resultado;
    } catch (error) {
      console.error('Error en crearVendedor:', error);
      throw error;
    }
  },
};
