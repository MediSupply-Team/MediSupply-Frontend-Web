import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CargaMasivaService, CargaMasivaResponse } from '@/services/cargaMasivaService';
import { useNotifications } from '@/store/appStore';

interface UploadProgress {
  validatingStructure: boolean;
  validatingData: boolean;
  importing: boolean;
  completed: boolean;
  currentStatus?: string;
  progress?: {
    processed: number;
    total: number;
    successful: number;
    failed: number;
  };
}

interface ImportResults {
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
}

export function useCargaMasiva() {
  const { addNotification } = useNotifications();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    validatingStructure: false,
    validatingData: false,
    importing: false,
    completed: false,
  });
  const [importResults, setImportResults] = useState<ImportResults | null>(null);

  const cargaMasivaMutation = useMutation({
    mutationFn: async (archivo: File) => {
      // Resetear progreso
      setUploadProgress({ 
        validatingStructure: true, 
        validatingData: false, 
        importing: false, 
        completed: false,
        currentStatus: 'Subiendo archivo...'
      });

      // Usar el método completo que maneja todo el proceso
      const response = await CargaMasivaService.procesarCargaMasivaCompleta(
        archivo,
        'PROV001',
        true,
        (status) => {
          // Callback para actualizar progreso en tiempo real
          const progress = status.progress;
          
          switch (status.status) {
            case 'pending':
              setUploadProgress({
                validatingStructure: false,
                validatingData: true,
                importing: false,
                completed: false,
                currentStatus: 'Archivo en cola de procesamiento...',
                progress,
              });
              break;
            case 'processing':
              setUploadProgress({
                validatingStructure: false,
                validatingData: false,
                importing: true,
                completed: false,
                currentStatus: `Procesando productos... (${progress.processed}/${progress.total})`,
                progress,
              });
              break;
            case 'completed':
              setUploadProgress({
                validatingStructure: false,
                validatingData: false,
                importing: false,
                completed: true,
                currentStatus: 'Procesamiento completado',
                progress,
              });
              break;
            case 'failed':
              setUploadProgress({
                validatingStructure: false,
                validatingData: false,
                importing: false,
                completed: false,
                currentStatus: 'Error en el procesamiento',
                progress,
              });
              break;
          }
        }
      );
      
      return response;
    },
    onSuccess: (response: CargaMasivaResponse) => {
      if (response.success && response.data) {
        setImportResults(response.data);
        addNotification({
          tipo: 'success',
          titulo: 'Importación completada',
          mensaje: `${response.data.imported} productos importados exitosamente`,
        });
      } else {
        addNotification({
          tipo: 'error',
          titulo: 'Error en la importación',
          mensaje: response.message,
        });
      }
    },
    onError: (error: Error) => {
      addNotification({
        tipo: 'error',
        titulo: 'Error en la carga masiva',
        mensaje: error.message,
      });
      // Reset progress on error
      setUploadProgress({
        validatingStructure: false,
        validatingData: false,
        importing: false,
        completed: false,
      });
    },
  });

  const resetUpload = () => {
    setUploadProgress({
      validatingStructure: false,
      validatingData: false,
      importing: false,
      completed: false,
      currentStatus: undefined,
      progress: undefined,
    });
    setImportResults(null);
    cargaMasivaMutation.reset();
  };

  const descargarPlantilla = () => {
    try {
      CargaMasivaService.descargarPlantilla();
      addNotification({
        tipo: 'info',
        titulo: 'Descarga iniciada',
        mensaje: 'La plantilla Excel se descargará automáticamente',
      });
    } catch {
      addNotification({
        tipo: 'error',
        titulo: 'Error en la descarga',
        mensaje: 'No se pudo descargar la plantilla',
      });
    }
  };

  return {
    // Estados
    isUploading: cargaMasivaMutation.isPending,
    uploadProgress,
    importResults,
    error: cargaMasivaMutation.error,
    
    // Acciones
    iniciarCargaMasiva: cargaMasivaMutation.mutate,
    resetUpload,
    descargarPlantilla,
  };
}