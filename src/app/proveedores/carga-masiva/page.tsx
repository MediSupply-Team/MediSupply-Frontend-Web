'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  task_id: string;
  status: string;
  message: string;
  progress: {
    total: number;
    processed: number;
    successful: number;
    failed: number;
  };
  result: {
    proveedores_procesados: number;
    errores: Array<{
      fila: number;
      error: string;
    }>;
  };
  took_ms: number;
}

export default function CargaMasivaProveedoresPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [reemplazarDuplicados, setReemplazarDuplicados] = useState(true);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setUploadResult(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setUploadResult(null);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx')) {
      alert('Por favor seleccione un archivo Excel válido (.xlsx)');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('El archivo es demasiado grande. Máximo 10MB.');
      return false;
    }
    
    return true;
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/ejemplo_carga_masiva_proveedores.xlsx';
    link.download = 'ejemplo_carga_masiva_proveedores.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor seleccione un archivo');
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `https://medisupply-backend.duckdns.org/venta/api/v1/proveedores/bulk-upload?reemplazar_duplicados=${reemplazarDuplicados}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar el archivo');
      }

      const result: UploadResult = await response.json();
      setUploadResult(result);

      // Si fue exitoso y no hay errores, limpiar el archivo
      if (result.progress.failed === 0) {
        setTimeout(() => {
          setFile(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      alert('Error al cargar el archivo. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/proveedores');
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            type="button"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Proveedores</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Carga Masiva de Proveedores
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Sube un archivo Excel con la información de múltiples proveedores
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descarga de Plantilla */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Download className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Descargar Plantilla
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Descarga la plantilla de Excel con el formato correcto para cargar proveedores.
                  El archivo contiene las columnas necesarias y ejemplos de datos.
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Plantilla Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Área de Carga */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Cargar Archivo
            </h3>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5'
                  : 'border-[var(--border-color)]'
              }`}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <FileSpreadsheet className="w-12 h-12 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium text-[var(--text-primary)]">{file.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-[var(--text-secondary)]" />
                  <div>
                    <p className="text-[var(--text-primary)] font-medium mb-1">
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Soporta archivos .xlsx hasta 10MB
                    </p>
                  </div>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Seleccionar Archivo
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Opción de reemplazar duplicados */}
            <div className="mt-4 flex items-center gap-3 p-4 bg-[var(--background-color)] rounded-lg">
              <input
                type="checkbox"
                id="reemplazar_duplicados"
                checked={reemplazarDuplicados}
                onChange={(e) => setReemplazarDuplicados(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              />
              <label htmlFor="reemplazar_duplicados" className="flex-1 text-sm">
                <span className="font-medium text-[var(--text-primary)]">
                  Reemplazar proveedores duplicados
                </span>
                <p className="text-[var(--text-secondary)] mt-1">
                  Si está marcado, los proveedores con NITs existentes serán actualizados.
                  De lo contrario, se omitirán.
                </p>
              </label>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Cargar Proveedores
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resultado de la Carga */}
          {uploadResult && (
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Resultado de la Carga
              </h3>

              {/* Resumen */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-[var(--background-color)] rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Total</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {uploadResult.progress.total}
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Exitosos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {uploadResult.progress.successful}
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">Fallidos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {uploadResult.progress.failed}
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Tiempo</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {uploadResult.took_ms}ms
                  </p>
                </div>
              </div>

              {/* Mensaje de Estado */}
              <div
                className={`flex items-start gap-3 p-4 rounded-lg mb-4 ${
                  uploadResult.progress.failed === 0
                    ? 'bg-green-500/10'
                    : 'bg-yellow-500/10'
                }`}
              >
                {uploadResult.progress.failed === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      uploadResult.progress.failed === 0 ? 'text-green-700' : 'text-yellow-700'
                    }`}
                  >
                    {uploadResult.message}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Se procesaron {uploadResult.result.proveedores_procesados} proveedores
                    correctamente.
                  </p>
                </div>
              </div>

              {/* Lista de Errores */}
              {uploadResult.result.errores.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Errores Encontrados ({uploadResult.result.errores.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uploadResult.result.errores.map((error, index) => (
                      <div
                        key={index}
                        className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                      >
                        <p className="text-sm">
                          <span className="font-medium text-red-600">Fila {error.fila}:</span>{' '}
                          <span className="text-[var(--text-secondary)]">{error.error}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para volver */}
              {uploadResult.progress.failed === 0 && (
                <button
                  onClick={handleCancel}
                  className="mt-6 w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
                >
                  Volver a Proveedores
                </button>
              )}
            </div>
          )}
        </div>

        {/* Panel de Instrucciones */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Instrucciones
            </h3>
            <ol className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold">
                  1
                </span>
                <span>Descarga la plantilla de Excel haciendo clic en el botón azul</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold">
                  2
                </span>
                <span>
                  Completa el archivo con la información de los proveedores. Asegúrate de incluir
                  todos los campos requeridos
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)} flex items-center justify-center font-semibold">
                  3
                </span>
                <span>Guarda el archivo en formato .xlsx</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold">
                  4
                </span>
                <span>Arrastra el archivo al área indicada o haz clic para seleccionarlo</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center font-semibold">
                  5
                </span>
                <span>Haz clic en &quot;Cargar Proveedores&quot; y espera la confirmación</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-700">Nota Importante</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Los campos marcados con * en la plantilla son obligatorios. El NIT debe ser
                    único para cada proveedor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
