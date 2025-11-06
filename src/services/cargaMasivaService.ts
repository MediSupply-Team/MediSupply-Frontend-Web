const BASE_URL = 'https://medisupply-backend.duckdns.org/venta';

export interface CargaMasivaResponse {
  success: boolean;
  message: string;
  data?: {
    imported: number;
    errors: number;
    total: number;
    errorDetails: string[];
  };
}

export class CargaMasivaService {
  static async cargarProductosMasivamente(
    archivo: File,
    proveedorId: string = 'PROV001',
    reemplazarDuplicados: boolean = true
  ): Promise<CargaMasivaResponse> {
    try {
      const formData = new FormData();
      formData.append('file', archivo);

      const url = `${BASE_URL}/api/v1/catalog/items/bulk-upload?proveedor_id=${proveedorId}&reemplazar_duplicados=${reemplazarDuplicados}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'Productos cargados exitosamente',
        data: {
          imported: data.imported || 0,
          errors: data.errors || 0,
          total: data.total || 0,
          errorDetails: data.errorDetails || [],
        },
      };
    } catch (error) {
      console.error('Error en carga masiva:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido en la carga masiva',
      };
    }
  }

  static descargarPlantilla(): void {
    const link = document.createElement('a');
    link.href = '/ejemplo_carga_masiva_postman.xlsx';
    link.download = 'plantilla_carga_masiva_productos.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}