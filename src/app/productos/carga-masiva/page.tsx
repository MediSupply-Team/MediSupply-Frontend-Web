'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CargaMasivaPage() {
  // === ESTADO LOCAL ===
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    validatingStructure: false,
    validatingData: false,
    importing: false,
    completed: false,
  });
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // === HOOKS ===
  const { addNotification } = useNotifications();

  // === HANDLERS ===
  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      addNotification({
        tipo: 'error',
        titulo: 'Formato no válido',
        mensaje: 'Solo se permiten archivos .xlsx, .xls o .csv',
      });
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        tipo: 'error',
        titulo: 'Archivo muy grande',
        mensaje: 'El archivo no debe superar los 10MB',
      });
      return;
    }

    setSelectedFile(file);
    addNotification({
      tipo: 'success',
      titulo: 'Archivo seleccionado',
      mensaje: `${file.name} está listo para importar`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateImport = async () => {
    setIsUploading(true);
    setUploadProgress({
      validatingStructure: true,
      validatingData: false,
      importing: false,
      completed: false,
    });

    // Simular validación de estructura
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploadProgress(prev => ({
      ...prev,
      validatingStructure: false,
      validatingData: true,
    }));

    // Simular validación de datos
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploadProgress(prev => ({
      ...prev,
      validatingData: false,
      importing: true,
    }));

    // Simular importación
    await new Promise(resolve => setTimeout(resolve, 3000));
    setUploadProgress(prev => ({
      ...prev,
      importing: false,
      completed: true,
    }));

    // Mostrar resultados simulados
    setImportResults({
      imported: 485,
      errors: 65,
      total: 550,
      errorDetails: [
        'Fila 12: SKU duplicado "JER-10ML-001"',
        'Fila 25: Categoría inválida "Equipos Medicos" (debe ser "Equipos Médicos")',
        'Fila 38: Campo obligatorio "Nombre del Producto" vacío',
        'Fila 42: Precio inválido "abc" (debe ser numérico)',
        'Fila 67: Fecha de vencimiento inválida "32/13/2024"',
      ]
    });

    setIsUploading(false);
    addNotification({
      tipo: 'success',
      titulo: 'Importación completada',
      mensaje: '485 productos importados exitosamente',
    });
  };

  const handleStartImport = () => {
    if (!selectedFile) {
      addNotification({
        tipo: 'error',
        titulo: 'No hay archivo',
        mensaje: 'Selecciona un archivo antes de iniciar la importación',
      });
      return;
    }

    simulateImport();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress({
      validatingStructure: false,
      validatingData: false,
      importing: false,
      completed: false,
    });
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    addNotification({
      tipo: 'info',
      titulo: 'Descarga iniciada',
      mensaje: 'La plantilla Excel se descargará automáticamente',
    });
    // Aquí implementarías la descarga real del template
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver al inventario</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Carga Masiva de Productos
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Importe múltiples productos desde un archivo Excel o CSV
        </p>
      </header>

      {/* Upload Section */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-8">
        <div className="max-w-2xl mx-auto">
          <div 
            className={`flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-xl bg-[var(--background-color)] transition-all duration-300 ${
              dragOver 
                ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5' 
                : 'border-[var(--border-color)]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <>
                <span className="material-symbols-outlined text-6xl text-[var(--accent-color)] mb-4">
                  description
                </span>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {selectedFile.name}
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Archivo seleccionado - Listo para importar
                </p>
                <button 
                  onClick={resetUpload}
                  className="text-sm text-[var(--primary-color)] hover:underline"
                >
                  Cambiar archivo
                </button>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-6xl text-[var(--primary-color)] mb-4">
                  cloud_upload
                </span>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Arrastra y suelta tu archivo aquí
                </h3>
                <p className="text-[var(--text-secondary)] mb-1">o</p>
                <label 
                  className="cursor-pointer mt-4 inline-flex items-center justify-center rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-sm font-bold hover:bg-[var(--secondary-color)] transition-colors"
                  htmlFor="file-upload"
                >
                  <span className="material-symbols-outlined mr-2">folder_open</span>
                  <span>Seleccionar Archivo</span>
                </label>
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInputChange}
                />
                <p className="text-sm text-[var(--text-secondary)] mt-3">
                  Formatos soportados: .xlsx, .xls, .csv (máximo 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--primary-color)]">download</span>
            Plantilla de Importación
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Para asegurar una importación exitosa, descargue y utilice nuestra plantilla oficial.
          </p>
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Descargar Plantilla Excel</span>
          </button>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--accent-color)]">checklist</span>
            Campos Requeridos
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full"></span>
              <span><strong>Nombre del Producto</strong> (obligatorio)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full"></span>
              <span><strong>SKU</strong> (obligatorio, único)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full"></span>
              <span><strong>Categoría</strong> (obligatorio)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full"></span>
              <span>Código de Barras (opcional)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full"></span>
              <span>Stock Inicial (opcional, predeterminado: 0)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Detailed Instructions */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--accent-color)]">info</span>
          Instrucciones Detalladas
        </h3>
        
        <div className="space-y-4 text-sm text-[var(--text-secondary)]">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Prepare su archivo</h4>
              <p>
                Descargue la plantilla oficial y complete los datos. Asegúrese de no modificar los nombres de las columnas ni agregar filas adicionales en el encabezado.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Validación de datos</h4>
              <p>
                Los SKUs deben ser únicos. Las fechas deben estar en formato DD/MM/YYYY. Los números decimales deben usar punto como separador.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Revisión previa</h4>
              <p>
                Antes de la importación final, se mostrará una vista previa donde podrá revisar y corregir cualquier error detectado automáticamente.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Importación</h4>
              <p>
                Una vez validados los datos, se procesará la importación. Recibirá un resumen detallado con los productos importados exitosamente y cualquier error encontrado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {isUploading && (
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--primary-color)]">progress_activity</span>
            Procesando Archivo
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Validando estructura del archivo...</span>
              <span className={uploadProgress.validatingStructure ? "text-[var(--primary-color)]" : "text-[var(--accent-color)]"}>
                {uploadProgress.validatingStructure ? "En progreso" : "✓ Completo"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Verificando datos obligatorios...</span>
              <span className={
                uploadProgress.validatingData ? "text-[var(--primary-color)]" : 
                uploadProgress.validatingStructure ? "text-[var(--text-secondary)]" : "text-[var(--accent-color)]"
              }>
                {uploadProgress.validatingData ? "En progreso" : 
                 uploadProgress.validatingStructure ? "Pendiente" : "✓ Completo"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Importando productos...</span>
              <span className={
                uploadProgress.importing ? "text-[var(--primary-color)]" : 
                (uploadProgress.validatingData || uploadProgress.validatingStructure) ? "text-[var(--text-secondary)]" : "text-[var(--accent-color)]"
              }>
                {uploadProgress.importing ? "En progreso" : 
                 (uploadProgress.validatingData || uploadProgress.validatingStructure) ? "Pendiente" : "✓ Completo"}
              </span>
            </div>
            
            <div className="w-full bg-[var(--border-color)] rounded-full h-2">
              <div 
                className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${
                    uploadProgress.completed ? 100 :
                    uploadProgress.importing ? 75 :
                    uploadProgress.validatingData ? 50 :
                    uploadProgress.validatingStructure ? 25 : 0
                  }%` 
                }}
              ></div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] text-center">
              {uploadProgress.importing && "Procesando 245 de 550 productos..."}
              {uploadProgress.validatingData && "Validando datos de productos..."}
              {uploadProgress.validatingStructure && "Verificando formato del archivo..."}
              {uploadProgress.completed && "Importación completada"}
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {importResults && (
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--accent-color)]">task_alt</span>
            Resumen de Importación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-[var(--accent-green)]/10 rounded-lg">
              <div className="text-2xl font-bold text-[var(--accent-green)]">
                {importResults.imported}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Productos importados</div>
            </div>
            <div className="text-center p-4 bg-[var(--accent-red)]/10 rounded-lg">
              <div className="text-2xl font-bold text-[var(--accent-red)]">
                {importResults.errors}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Errores encontrados</div>
            </div>
            <div className="text-center p-4 bg-[var(--primary-color)]/10 rounded-lg">
              <div className="text-2xl font-bold text-[var(--primary-color)]">
                {importResults.total}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">Total procesados</div>
            </div>
          </div>
          
          {importResults.errorDetails.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--text-primary)]">Errores encontrados:</h4>
              <div className="bg-[var(--background-color)] rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-2 text-sm">
                  {importResults.errorDetails.map((error, index) => (
                    <div key={index} className="text-[var(--accent-red)]">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="material-symbols-outlined text-base align-middle mr-1">info</span>
          Los productos duplicados (mismo SKU) serán omitidos durante la importación.
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleStartImport}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">upload</span>
            <span>{isUploading ? 'Procesando...' : 'Iniciar Importación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}