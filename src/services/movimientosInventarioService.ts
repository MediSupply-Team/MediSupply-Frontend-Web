const BASE_URL = 'https://medisupply-backend.duckdns.org/venta';

export interface ProductoDetalle {
  categoria: string;
  certificadoSanitario: string | null;
  codigo: string;
  id: string;
  nombre: string;
  precioUnitario: number;
  presentacion: string;
  proveedorId: string | null;
  requisitosAlmacenamiento: string;
  tiempoEntregaDias: number | null;
}

export interface MovimientoInventario {
  producto_id: string;
  bodega_id: string;
  pais: string;
  lote: string;
  tipo_movimiento: 'INGRESO' | 'SALIDA';
  motivo: 'COMPRA' | 'VENTA';
  cantidad: number;
  fecha_vencimiento?: string; // Solo para INGRESO
  usuario_id: string;
  referencia_documento: string;
  observaciones?: string;
}

export interface MovimientoResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export class MovimientosInventarioService {
  static async obtenerDetalleProducto(productoId: string): Promise<ProductoDetalle> {
    try {
      const url = `${BASE_URL}/api/v1/catalog/items/${productoId}`;
      
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: ProductoDetalle = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo detalle del producto:', error);
      throw error;
    }
  }

  static async registrarMovimiento(movimiento: MovimientoInventario): Promise<MovimientoResponse> {
    try {
      const url = `${BASE_URL}/api/v1/inventory/movements`;
      
      console.log('Enviando movimiento:', JSON.stringify(movimiento, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimiento),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Movimiento registrado exitosamente',
        data,
      };
    } catch (error) {
      console.error('Error registrando movimiento:', error);
      throw error;
    }
  }
}
