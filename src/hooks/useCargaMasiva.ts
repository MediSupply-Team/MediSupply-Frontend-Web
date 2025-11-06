import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CargaMasivaService, CargaMasivaResponse } from '@/services/cargaMasivaService';
import { useNotifications } from '@/store/appStore';

interface UploadProgress {
  validatingStructure: boolean;
  validatingData: boolean;
  importing: boolean;
  completed: boolean;
}

interface ImportResults {
  imported: number;
  errors: number;
  total: number;
  errorDetails: string[];
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
      // Simular las fases de validación
      setUploadProgress({ validatingStructure: true, validatingData: false, importing: false, completed: false });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadProgress({ validatingStructure: false, validatingData: true, importing: false, completed: false });
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadProgress({ validatingStructure: false, validatingData: false, importing: true, completed: false });
      
      // Hacer la llamada real al backend
      const response = await CargaMasivaService.cargarProductosMasivamente(archivo);
      
      setUploadProgress({ validatingStructure: false, validatingData: false, importing: false, completed: true });
      
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