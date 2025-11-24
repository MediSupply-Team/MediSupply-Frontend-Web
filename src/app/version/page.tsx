'use client';

import { useEffect, useState } from 'react';
import { versionService, VersionInfo } from '@/services/versionService';
import { 
  Package, 
  Globe, 
  Smartphone, 
  Server, 
  Database, 
  Cloud, 
  GitBranch, 
  Calendar,
  Cpu,
  Monitor,
  Code,
  Loader2
} from 'lucide-react';

export default function VersionPage() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarVersion();
  }, []);

  const cargarVersion = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await versionService.obtenerVersionSistema();
      setVersionInfo(data);
    } catch (error) {
      console.error('Error al cargar versión:', error);
      setError('No se pudo cargar la información de versiones');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[var(--primary-color)]" />
            <p className="text-[var(--muted-foreground)]">Cargando información del sistema...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !versionInfo) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-700 dark:text-red-300">{error || 'Error desconocido'}</p>
          <button
            onClick={cargarVersion}
            className="mt-4 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)] flex items-center gap-3">
          <Package className="w-8 h-8 text-[var(--primary-color)]" />
          Información de Versiones
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Estado actual del sistema {versionInfo.platform}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Información Principal */}
        <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
            <Code className="w-5 h-5 text-[var(--primary-color)]" />
            Plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Versión del Producto</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.productVersion}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Fecha de Build
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {new Date(versionInfo.buildDate).toLocaleString('es-CO')}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                Git Commit
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.gitCommit}
              </p>
            </div>
          </div>
        </div>

        {/* Aplicaciones */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Web */}
          <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[var(--primary-color)]" />
              Aplicación Web
            </h2>
            <div className="flex items-center justify-between bg-[var(--accent)] rounded-lg p-4">
              <span className="text-[var(--foreground)]">Versión</span>
              <span className="text-lg font-bold text-[var(--primary-color)]">
                {versionInfo.web.version}
              </span>
            </div>
          </div>

          {/* Mobile */}
          <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[var(--primary-color)]" />
              Aplicaciones Móviles
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[var(--accent)] rounded-lg p-4">
                <span className="text-[var(--foreground)]">App Ventas</span>
                <span className="text-lg font-bold text-[var(--primary-color)]">
                  {versionInfo.mobile.ventas}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[var(--accent)] rounded-lg p-4">
                <span className="text-[var(--foreground)]">App Clientes</span>
                <span className="text-lg font-bold text-[var(--primary-color)]">
                  {versionInfo.mobile.clientes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Microservicios */}
        <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
            <Server className="w-5 h-5 text-[var(--primary-color)]" />
            Microservicios ({versionInfo.services.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {versionInfo.services.map((service, index) => (
              <div
                key={index}
                className="bg-[var(--accent)] rounded-lg p-4 border-2 border-[var(--border)] hover:border-[var(--primary-color)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-[var(--primary-color)]" />
                  <span className="font-semibold text-[var(--foreground)]">
                    {service.name}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  v{service.version}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Infraestructura */}
        <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--foreground)] flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[var(--primary-color)]" />
            Infraestructura
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--accent)] rounded-lg p-4">
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Cloud className="w-4 h-4" />
                Proveedor Cloud
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.infrastructure.cloud}
              </p>
            </div>
            <div className="bg-[var(--accent)] rounded-lg p-4">
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Región
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.infrastructure.region}
              </p>
            </div>
            <div className="bg-[var(--accent)] rounded-lg p-4">
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Server className="w-4 h-4" />
                Orquestación
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.infrastructure.orchestration}
              </p>
            </div>
            <div className="bg-[var(--accent)] rounded-lg p-4">
              <p className="text-sm text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Database className="w-4 h-4" />
                Base de Datos
              </p>
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {versionInfo.infrastructure.database}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
