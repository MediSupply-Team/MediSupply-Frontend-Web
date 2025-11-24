'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  FileDown,
  XCircle,
  MapPin,
  Clock,
  Package,
  TrendingUp,
  Truck,
  Phone,
  MessageSquare,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Route as RouteIcon,
} from 'lucide-react';

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

interface RouteDetails {
  id: string;
  alertas: string[];
  created_at: string;
  updated_at: string;
  driver_id: string | null;
  driver_name: string | null;
  geometria: RouteGeometry;
  notes: string;
  optimized_by: string;
  resumen: RouteSummary;
  secuencia_entregas: RouteStop[];
  status: string;
}

export default function DetalleRutaPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params.id as string;
  
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar obtener de sessionStorage primero
    const storedDetails = sessionStorage.getItem('routeDetails');
    
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails);
        setRouteDetails(details);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error al parsear los detalles almacenados:', error);
      }
    }

    // Si no está en sessionStorage, hacer fetch al backend
    const fetchRouteDetails = async () => {
      try {
        const response = await fetch(
          `https://medisupply-backend.duckdns.org/venta/api/v1/rutas/${routeId}`
        );

        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la ruta');
        }

        const data = await response.json();
        setRouteDetails(data);
      } catch (error) {
        console.error('Error al cargar la ruta:', error);
        alert('Error al cargar los detalles de la ruta');
        router.push('/rutas');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [routeId, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      completed: { label: 'Completada', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!routeDetails) {
    return null;
  }

  // Calcular progreso (por ahora siempre será 0% ya que son rutas nuevas)
  const completedStops = 0; // Se actualizaría con lógica real

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/rutas')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a rutas</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Ruta #{routeDetails.id.slice(0, 8)}
              </h1>
              {getStatusBadge(routeDetails.status)}
            </div>
            <p className="text-[var(--text-secondary)]">
              Creada el {formatDate(routeDetails.created_at)}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors">
              <Edit className="h-4 w-4" />
              <span>Editar Ruta</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors">
              <FileDown className="h-4 w-4" />
              <span>Exportar PDF</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent-red)] text-white hover:opacity-90 transition-colors">
              <XCircle className="h-4 w-4" />
              <span>Cancelar Ruta</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tarjetas de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-lg flex items-center justify-center">
              <RouteIcon className="h-6 w-6 text-[var(--primary-color)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Distancia Total</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {routeDetails.resumen.distancia_total_km.toFixed(1)} km
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-[var(--accent-color)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Tiempo Estimado</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {Math.floor(routeDetails.resumen.tiempo_total_min / 60)}h{' '}
                {Math.round(routeDetails.resumen.tiempo_total_min % 60)}min
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-[var(--accent-color)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Total Entregas</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {routeDetails.resumen.total_entregas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Progreso</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {completedStops} de {routeDetails.resumen.total_entregas}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Camión */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Truck className="h-5 w-5 text-[var(--primary-color)]" />
              Información del Camión
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Conductor</label>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {routeDetails.driver_name || 'Sin asignar'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Optimizado por</label>
                  <p className="text-[var(--text-primary)] font-semibold">{routeDetails.optimized_by}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Hora de inicio</label>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {routeDetails.resumen.hora_inicio}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Hora fin estimada</label>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {routeDetails.resumen.hora_fin_estimada}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Peso usado</label>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {routeDetails.resumen.capacidad_peso_usada_pct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Volumen usado</label>
                  <p className="text-[var(--text-primary)] font-semibold">
                    {routeDetails.resumen.capacidad_volumen_usada_pct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {routeDetails.notes && (
              <div className="mt-6 p-4 bg-[var(--background-color)] rounded-lg">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Notas</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{routeDetails.notes}</p>
              </div>
            )}
          </div>

          {/* Timeline de Entregas */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[var(--primary-color)]" />
              Cronograma de Entregas
            </h3>

            <div className="space-y-4">
              {/* Bodega de origen */}
              <div className="relative pl-12 pb-4 border-l-2 border-[var(--border-color)] ml-4">
                <div className="absolute left-[-17px] top-0 w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      {routeDetails.resumen.hora_inicio} - Salida de bodega
                    </h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      Punto de origen
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Carga inicial: {routeDetails.resumen.total_cajas} cajas
                  </p>
                </div>
              </div>

              {/* Paradas */}
              {routeDetails.secuencia_entregas.map((stop, index) => (
                <div
                  key={stop.id_pedido}
                  className="relative pl-12 pb-4 border-l-2 border-[var(--border-color)] ml-4 last:border-l-0"
                >
                  <div className="absolute left-[-17px] top-0 w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{stop.orden}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                        {stop.hora_estimada} - {stop.cliente}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        stop.urgencia === 'alta'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : stop.urgencia === 'media'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {stop.urgencia}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{stop.direccion_formateada}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Entrega: {stop.cajas} cajas - {stop.id_pedido}
                    </p>
                    {index > 0 && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {stop.distancia_desde_anterior_km.toFixed(1)} km desde parada anterior (~
                        {stop.tiempo_desde_anterior_min.toFixed(0)} min)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Ubicación Actual */}
          {routeDetails.status === 'in_progress' && (
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-[var(--primary-color)]" />
                Ubicación Actual
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">En tránsito</p>
                    <p className="text-xs text-[var(--text-secondary)]">Siguiente parada</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  <Navigation className="h-4 w-4" />
                  <span>Rastrear en Tiempo Real</span>
                </button>
              </div>
            </div>
          )}

          {/* Contacto del Conductor */}
          {routeDetails.driver_name && (
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[var(--primary-color)]" />
                Conductor
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-full flex items-center justify-center">
                    <span className="text-[var(--primary-color)] text-lg font-bold">
                      {routeDetails.driver_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {routeDetails.driver_name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">Conductor profesional</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>Llamar</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Métricas de Rendimiento */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--primary-color)]" />
              Resumen
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Tiempo conducción</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {routeDetails.resumen.tiempo_conduccion_min} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Tiempo entregas</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {routeDetails.resumen.tiempo_entregas_min} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Total cajas</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {routeDetails.resumen.total_cajas}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Costo estimado</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {formatCurrency(routeDetails.resumen.costo_estimado)}
                </span>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[var(--accent-red)]" />
              Incidencias
            </h3>

            {routeDetails.alertas.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-[var(--accent-color)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">No hay incidencias reportadas</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  La ruta está lista para ejecutarse
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {routeDetails.alertas.map((alerta, index) => (
                  <li key={index} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>{alerta}</span>
                  </li>
                ))}
              </ul>
            )}

            <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--accent-red)] text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors">
              <AlertTriangle className="h-4 w-4" />
              <span>Reportar Incidencia</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
