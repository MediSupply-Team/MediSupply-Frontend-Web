const BASE_URL = 'https://medisupply-backend.duckdns.org/venta';

export interface CargaMasivaUploadResponse {
  filename: string;
  message: string;
  proveedor_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  status_url: string;
  task_id: string;
}

export interface CargaMasivaStatusResponse {
  completed_at: string | null;
  created_at: string;
  error: string | null;
  filename: string;
  progress: {
    failed: number;
    processed: number;
    successful: number;
    total: number;
  };
  proveedor_id: string;
  result: {
    errores: Array<{
      error: string;
      fila: number;
    }>;
    mensaje: string;
    productos_actualizados: string[];
    productos_creados: string[];
    resumen: {
      duplicados: number;
      exitosos: number;
      productos_actualizados: number;
      productos_creados: number;
      rechazados: number;
      total: number;
    };
  } | null;
  s3_key: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  task_id: string;
  updated_at: string;
}

export interface CargaMasivaResponse {
  success: boolean;
  message: string;
  data?: {
    imported: number;
    errors: number;
    total: number;
    errorDetails: string[];
    productos_creados: string[];
    productos_actualizados: string[];
    resumen: {
      duplicados: number;
      exitosos: number;
      productos_actualizados: number;
      productos_creados: number;
      rechazados: number;
      total: number;
    };
  };
}

export class CargaMasivaService {
  static async cargarProductosMasivamente(
    archivo: File,
    proveedorId: string = 'PROV001',
    reemplazarDuplicados: boolean = true
  ): Promise<CargaMasivaUploadResponse> {
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

      const data: CargaMasivaUploadResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error en carga masiva:', error);
      throw error;
    }
  }

  static async consultarStatusCargaMasiva(taskId: string): Promise<CargaMasivaStatusResponse> {
    try {
      const url = `${BASE_URL}/api/v1/catalog/bulk-upload/status/${taskId}`;
      
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: CargaMasivaStatusResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error consultando status:', error);
      throw error;
    }
  }

  static async procesarCargaMasivaCompleta(
    archivo: File,
    proveedorId: string = 'PROV001',
    reemplazarDuplicados: boolean = true,
    onProgressUpdate?: (status: CargaMasivaStatusResponse) => void
  ): Promise<CargaMasivaResponse> {
    try {
      // Paso 1: Subir archivo
      const uploadResponse = await this.cargarProductosMasivamente(archivo, proveedorId, reemplazarDuplicados);
      
      // Paso 2: Polling del status hasta completar
      const finalStatus = await this.pollStatusHastaCompletar(uploadResponse.task_id, onProgressUpdate);
      
      // Paso 3: Procesar respuesta final
      return this.procesarRespuestaFinal(finalStatus);
    } catch (error) {
      console.error('Error en proceso completo:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido en la carga masiva',
      };
    }
  }

  private static async pollStatusHastaCompletar(
    taskId: string, 
    onProgressUpdate?: (status: CargaMasivaStatusResponse) => void,
    maxIntentos: number = 60,
    intervaloMs: number = 2000
  ): Promise<CargaMasivaStatusResponse> {
    let intentos = 0;
    
    while (intentos < maxIntentos) {
      const status = await this.consultarStatusCargaMasiva(taskId);
      
      // Notificar progreso si hay callback
      if (onProgressUpdate) {
        onProgressUpdate(status);
      }
      
      // Si completó (exitoso o con error), retornar
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, intervaloMs));
      intentos++;
    }
    
    throw new Error('Timeout: El procesamiento del archivo tardó demasiado');
  }

  private static procesarRespuestaFinal(status: CargaMasivaStatusResponse): CargaMasivaResponse {
    if (status.status === 'failed') {
      return {
        success: false,
        message: status.error || 'Error en el procesamiento del archivo',
      };
    }

    if (!status.result) {
      return {
        success: false,
        message: 'No se recibieron resultados del procesamiento',
      };
    }

    const result = status.result;
    const errorDetails = (result.errores || []).map(error => `Fila ${error.fila}: ${error.error}`);

    return {
      success: true,
      message: result.mensaje,
      data: {
        imported: result.resumen.exitosos,
        errors: result.resumen.rechazados,
        total: result.resumen.total,
        errorDetails: errorDetails,
        productos_creados: result.productos_creados || [],
        productos_actualizados: result.productos_actualizados || [],
        resumen: result.resumen,
      },
    };
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