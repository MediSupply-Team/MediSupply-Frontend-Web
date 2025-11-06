'use client';

import { useState } from 'react';
import { CargaMasivaService } from '@/services/cargaMasivaService';
import { useCargaMasiva } from '@/hooks/useCargaMasiva';

export default function TestCargaMasivaPage() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const {
    isUploading,
    uploadProgress,
    importResults,
    iniciarCargaMasiva,
    resetUpload,
    descargarPlantilla,
  } = useCargaMasiva();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTestFile(file);
    }
  };

  const testUpload = () => {
    if (!testFile) {
      alert('Selecciona un archivo primero');
      return;
    }
    iniciarCargaMasiva(testFile);
  };

  const testDownload = () => {
    descargarPlantilla();
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Test Carga Masiva de Productos
          </h1>
          <p className="text-[var(--text-secondary)]">
            Página de prueba para verificar la funcionalidad de carga masiva
          </p>
        </header>

        {/* Test Download */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            1. Test Descarga de Plantilla
          </h2>
          <button
            onClick={testDownload}
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
          >
            Descargar Plantilla Excel
          </button>
        </div>

        {/* Test Upload */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            2. Test Carga de Archivo
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Seleccionar archivo Excel:
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--secondary-color)]"
              />
            </div>
            
            {testFile && (
              <div className="text-sm text-[var(--text-secondary)]">
                Archivo seleccionado: <strong>{testFile.name}</strong> ({(testFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            
            <button
              onClick={testUpload}
              disabled={!testFile || isUploading}
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-color)]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
            
            {isUploading && (
              <button
                onClick={resetUpload}
                className="ml-2 px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Progress Display */}
        {isUploading && (
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              3. Progreso de Carga
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validando estructura...</span>
                <span className={uploadProgress.validatingStructure ? 'text-[var(--primary-color)]' : uploadProgress.validatingData || uploadProgress.importing || uploadProgress.completed ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}>
                  {uploadProgress.validatingStructure ? 'En progreso' : uploadProgress.validatingData || uploadProgress.importing || uploadProgress.completed ? '✓' : 'Pendiente'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Validando datos...</span>
                <span className={uploadProgress.validatingData ? 'text-[var(--primary-color)]' : uploadProgress.importing || uploadProgress.completed ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}>
                  {uploadProgress.validatingData ? 'En progreso' : uploadProgress.importing || uploadProgress.completed ? '✓' : 'Pendiente'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Importando productos...</span>
                <span className={uploadProgress.importing ? 'text-[var(--primary-color)]' : uploadProgress.completed ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}>
                  {uploadProgress.importing ? 'En progreso' : uploadProgress.completed ? '✓' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {importResults && (
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              4. Resultados de Importación
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-[var(--accent-green)]/10 rounded-lg">
                <div className="text-2xl font-bold text-[var(--accent-green)]">
                  {importResults.imported}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Importados</div>
              </div>
              <div className="text-center p-4 bg-[var(--accent-red)]/10 rounded-lg">
                <div className="text-2xl font-bold text-[var(--accent-red)]">
                  {importResults.errors}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Errores</div>
              </div>
              <div className="text-center p-4 bg-[var(--primary-color)]/10 rounded-lg">
                <div className="text-2xl font-bold text-[var(--primary-color)]">
                  {importResults.total}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Total</div>
              </div>
            </div>

            {/* Resumen detallado */}
            {importResults.resumen && (
              <div className="mb-4">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Resumen detallado:</h3>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="bg-[var(--background-color)] p-2 rounded text-center">
                    <div className="font-bold">{importResults.resumen.productos_creados}</div>
                    <div>Creados</div>
                  </div>
                  <div className="bg-[var(--background-color)] p-2 rounded text-center">
                    <div className="font-bold">{importResults.resumen.productos_actualizados}</div>
                    <div>Actualizados</div>
                  </div>
                  <div className="bg-[var(--background-color)] p-2 rounded text-center">
                    <div className="font-bold">{importResults.resumen.duplicados}</div>
                    <div>Duplicados</div>
                  </div>
                  <div className="bg-[var(--background-color)] p-2 rounded text-center">
                    <div className="font-bold">{importResults.resumen.rechazados}</div>
                    <div>Rechazados</div>
                  </div>
                  <div className="bg-[var(--background-color)] p-2 rounded text-center">
                    <div className="font-bold">{importResults.resumen.exitosos}</div>
                    <div>Exitosos</div>
                  </div>
                </div>
              </div>
            )}

            {/* Productos creados y actualizados */}
            {(importResults.productos_creados?.length > 0 || importResults.productos_actualizados?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {importResults.productos_creados?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                      Productos Creados:
                    </h3>
                    <div className="bg-[var(--background-color)] rounded p-2 max-h-24 overflow-y-auto text-xs">
                      {importResults.productos_creados.map((producto: string, index: number) => (
                        <div key={index} className="text-[var(--accent-color)] font-mono">
                          {producto}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResults.productos_actualizados?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                      Productos Actualizados:
                    </h3>
                    <div className="bg-[var(--background-color)] rounded p-2 max-h-24 overflow-y-auto text-xs">
                      {importResults.productos_actualizados.map((producto: string, index: number) => (
                        <div key={index} className="text-[var(--primary-color)] font-mono">
                          {producto}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {importResults.errorDetails && importResults.errorDetails.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Detalles de errores:</h3>
                <div className="bg-[var(--background-color)] rounded-lg p-4 max-h-40 overflow-y-auto">
                  {importResults.errorDetails.map((error: string, index: number) => (
                    <div key={index} className="text-sm text-[var(--accent-red)] mb-1">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Test Section */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            5. Test Manual de API
          </h2>
          
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <div><strong>1. Endpoint Upload:</strong> https://medisupply-backend.duckdns.org/venta/api/v1/catalog/items/bulk-upload</div>
            <div><strong>Parámetros:</strong> proveedor_id=PROV001&reemplazar_duplicados=true</div>
            <div><strong>Método:</strong> POST con FormData</div>
            <div><strong>Respuesta:</strong> task_id y status_url</div>
            <div className="mt-3"><strong>2. Endpoint Status:</strong> https://medisupply-backend.duckdns.org/venta/api/v1/catalog/bulk-upload/status/[task_id]</div>
            <div><strong>Método:</strong> GET</div>
            <div><strong>Polling:</strong> Cada 2 segundos hasta status=&apos;completed&apos; o &apos;failed&apos;</div>
            <div><strong>Plantilla disponible:</strong> /ejemplo_carga_masiva_postman.xlsx</div>
          </div>
          
          <button
            onClick={() => {
              console.log('=== INFORMACIÓN DE ENDPOINTS ===');
              console.log('Upload endpoint:', 'https://medisupply-backend.duckdns.org/venta/api/v1/catalog/items/bulk-upload?proveedor_id=PROV001&reemplazar_duplicados=true');
              console.log('Status endpoint pattern:', 'https://medisupply-backend.duckdns.org/venta/api/v1/catalog/bulk-upload/status/[task_id]');
              console.log('Servicio CargaMasivaService:', CargaMasivaService);
              console.log('=== PROCESO ASÍNCRONO ===');
              console.log('1. POST archivo → recibe task_id');
              console.log('2. GET status cada 2s → hasta completed/failed');
              console.log('3. Mostrar resultados finales');
            }}
            className="mt-4 px-4 py-2 bg-[var(--text-secondary)] text-white rounded-lg hover:bg-[var(--text-primary)] transition-colors"
          >
            Log Info en Consola
          </button>
        </div>
      </div>
    </div>
  );
}