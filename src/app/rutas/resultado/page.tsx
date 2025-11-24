'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FileDown, RefreshCw, CheckCircle, Package, TrendingUp, Truck } from 'lucide-react';

// Importar el componente del mapa dinámicamente para evitar errores de SSR
const RouteMap = dynamic(() => import('@/components/RouteMap'), { ssr: false });

interface RouteStop {
  cajas: number;
  cliente: string;
  direccion: string;
  direccion_formateada: string;
  distancia_desde_anterior_km: number;
  hora_estimada: string;
  id_pedido: string;
  lat: number;
  lon: number;
  orden: number;
  tiempo_desde_anterior_min: number;
  urgencia: string;
  zona: string;
}

interface RouteSummary {
  capacidad_peso_usada_pct: number;
  capacidad_volumen_usada_pct: number;
  costo_estimado: number;
  distancia_total_km: number;
  hora_fin_estimada: string;
  hora_inicio: string;
  tiempo_conduccion_min: number;
  tiempo_entregas_min: number;
  tiempo_total_min: number;
  total_cajas: number;
  total_entregas: number;
}

interface RouteGeometry {
  coordinates: [number, number][];
  type: string;
}

interface RouteResult {
  alertas: string[];
  geometria: RouteGeometry;
  resumen: RouteSummary;
  secuencia_entregas: RouteStop[];
}

interface RouteConfiguration {
  bodega_origen: string;
  hora_inicio: string;
  camion_capacidad_kg: number;
  camion_capacidad_m3: number;
}

export default function ResultadoRutaPage() {
  const router = useRouter();
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [routeConfig, setRouteConfig] = useState<RouteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener los datos de sessionStorage
    const routeResultStr = sessionStorage.getItem('routeOptimizationResult');
    const routeConfigStr = sessionStorage.getItem('routeConfiguration');

    if (!routeResultStr) {
      router.push('/rutas');
      return;
    }

    try {
      const result = JSON.parse(routeResultStr);
      const config = routeConfigStr ? JSON.parse(routeConfigStr) : null;
      setRouteData(result);
      setRouteConfig(config);
    } catch (error) {
      console.error('Error al cargar los datos de la ruta:', error);
      router.push('/rutas');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRecalculate = () => {
    router.push('/rutas');
  };

  const handleAccept = async () => {
    if (!routeData) return;

    try {
      // Preparar el payload para crear la ruta
      const routePayload = {
        secuencia_entregas: routeData.secuencia_entregas,
        resumen: routeData.resumen,
        geometria: routeData.geometria,
        alertas: routeData.alertas,
        optimized_by: 'system',
        notes: `Ruta optimizada - ${routeData.resumen.total_entregas} entregas, ${routeData.resumen.total_cajas} cajas`,
      };

      // POST para crear la ruta
      const createResponse = await fetch(
        'https://medisupply-backend.duckdns.org/venta/api/v1/rutas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routePayload),
        }
      );

      if (!createResponse.ok) {
        throw new Error('Error al crear la ruta');
      }

      const createResult = await createResponse.json();
      const routeId = createResult.id;

      // GET para obtener los detalles completos de la ruta
      const detailsResponse = await fetch(
        `https://medisupply-backend.duckdns.org/venta/api/v1/rutas/${routeId}`
      );

      if (!detailsResponse.ok) {
        throw new Error('Error al obtener los detalles de la ruta');
      }

      const routeDetails = await detailsResponse.json();

      // Guardar los detalles en sessionStorage y navegar
      sessionStorage.setItem('routeDetails', JSON.stringify(routeDetails));
      router.push(`/rutas/detalle/${routeId}`);

    } catch (error) {
      console.error('Error al aceptar la ruta:', error);
      alert('Error al aceptar la ruta. Por favor, intenta nuevamente.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia.toLowerCase()) {
      case 'alta':
        return 'text-red-400';
      case 'media':
        return 'text-yellow-400';
      case 'baja':
        return 'text-green-400';
      default:
        return 'text-[var(--text-secondary)]';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Ruta Óptima Generada</h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {routeData.resumen.total_entregas} entregas programadas - Inicio: {routeData.resumen.hora_inicio}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRecalculate}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Recalcular</span>
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Aceptar Ruta</span>
            </button>
          </div>
        </div>
      </header>

      {/* Alertas */}
      {routeData.alertas && routeData.alertas.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            Alertas
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {routeData.alertas.map((alerta, index) => (
              <li key={index}>{alerta}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa con Ruta */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Mapa de la Ruta</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-color)]"></div>
                    <span className="text-[var(--text-secondary)]">Bodega</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-[var(--primary-color)]"></div>
                    <span className="text-[var(--text-secondary)]">Clientes</span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1 text-xs rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50 transition-colors">
                    <FileDown className="h-3 w-3" />
                    <span>Exportar PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="h-[500px]">
              <RouteMap
                stops={routeData.secuencia_entregas}
                geometry={routeData.geometria}
                warehouseAddress={routeConfig?.bodega_origen || 'Bodega Principal'}
              />
            </div>
          </div>

          {/* Resumen de Ruta */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--primary-color)]" />
              Resumen de Ruta
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {routeData.resumen.total_entregas}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Entregas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {routeData.resumen.distancia_total_km.toFixed(1)} km
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Distancia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {Math.floor(routeData.resumen.tiempo_total_min / 60)}h{' '}
                  {Math.round(routeData.resumen.tiempo_total_min % 60)}min
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Tiempo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {routeData.resumen.total_cajas}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Cajas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {formatCurrency(routeData.resumen.costo_estimado)}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Costo Est.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Detalle de Ruta */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Lista Ordenada de Paradas */}
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--primary-color)]" />
                Secuencia de Entregas
              </h3>

              <div className="space-y-3">
                {/* Bodega de origen */}
                <div className="flex items-center gap-3 p-3 bg-[var(--background-color)] rounded-lg">
                  <div className="w-6 h-6 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    0
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Bodega Principal</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {routeConfig?.bodega_origen || 'Punto de origen'}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {routeData.resumen.hora_inicio}
                  </span>
                </div>

                {/* Paradas */}
                {routeData.secuencia_entregas.map((stop) => (
                  <div
                    key={stop.id_pedido}
                    className="flex items-center gap-3 p-3 bg-[var(--background-color)] rounded-lg"
                  >
                    <div className="w-6 h-6 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {stop.orden}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{stop.cliente}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{stop.direccion}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-[var(--accent-color)]">{stop.cajas} cajas</p>
                        <span className="text-xs text-[var(--text-secondary)]">•</span>
                        <p className={`text-xs ${getUrgencyColor(stop.urgencia)}`}>
                          {stop.urgencia}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{stop.hora_estimada}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Información del Camión */}
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--primary-color)]" />
                Información del Camión
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Capacidad</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {routeConfig?.camion_capacidad_kg} kg / {routeConfig?.camion_capacidad_m3} m³
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Peso usado</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {routeData.resumen.capacidad_peso_usada_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Volumen usado</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {routeData.resumen.capacidad_volumen_usada_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Tiempo conducción</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {routeData.resumen.tiempo_conduccion_min} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Tiempo entregas</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {routeData.resumen.tiempo_entregas_min} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Hora fin estimada</span>
                  <span className="text-sm font-semibold text-[var(--accent-color)]">
                    {routeData.resumen.hora_fin_estimada}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
