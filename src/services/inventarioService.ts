const API_BASE_URL = 'https://medisupply-backend.duckdns.org/venta/api/v1';

export interface LoteInventario {
  pais: string;
  bodegaId: string;
  lote: string;
  cantidad: number;
  vence: string;
  condiciones: string;
}

export interface InventarioResponse {
  items: LoteInventario[];
  meta: {
    page: number;
    size: number;
    total: number;
    tookMs: number;
  };
}

export const inventarioService = {
  /**
   * Obtiene el inventario de un producto específico
   */
  async obtenerInventarioProducto(
    productoId: string,
    page: number = 1,
    size: number = 100
  ): Promise<InventarioResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/catalog/items/${productoId}/inventario?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener inventario: ${response.status}`);
      }

      const data: InventarioResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerInventarioProducto:', error);
      throw error;
    }
  },
};
