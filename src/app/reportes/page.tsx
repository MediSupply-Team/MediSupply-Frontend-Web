'use client';

import React, { useState } from 'react';
import { 
  useEstadisticasVentas, 
  useDatosGraficos, 
  useVentasVendedores, 
  useExportarReporte 
} from '@/hooks/useReportes';
import { useNotifications } from '@/store/appStore';
import type { FiltrosReportes } from '@/types';

const ReportesPage = () => {
  const [filtros, setFiltros] = useState<FiltrosReportes>({});
  const { addNotification } = useNotifications();
  
  // Queries
  const { data: estadisticas, isLoading: loadingEstadisticas } = useEstadisticasVentas();
  const { data: datosGraficos, isLoading: loadingGraficos } = useDatosGraficos();
  const { data: ventasData, isLoading: loadingVentas } = useVentasVendedores(filtros);
  
  // Mutations
  const exportarMutation = useExportarReporte();

  const handleExportar = (formato: 'excel' | 'pdf') => {
    exportarMutation.mutate(
      { formato, filtros },
      {
        onSuccess: () => {
          addNotification({
            tipo: 'success',
            titulo: 'Exportación exitosa',
            mensaje: `Reporte exportado exitosamente en formato ${formato.toUpperCase()}`,
          });
        },
        onError: () => {
          addNotification({
            tipo: 'error',
            titulo: 'Error de exportación',
            mensaje: 'Error al exportar el reporte',
          });
        },
      }
    );
  };

  const handleFiltroChange = (campo: keyof FiltrosReportes, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor || undefined,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({});
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Reportes e Informes
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Análisis de vendedores y estadísticas de ventas
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleExportar('excel')}
            disabled={exportarMutation.isPending}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--accent-green)',
              borderColor: 'var(--accent-green)'
            }}
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              description
            </span>
            {exportarMutation.isPending ? 'Exportando...' : 'Exportar Excel'}
          </button>
          
          <button
            onClick={() => handleExportar('pdf')}
            disabled={exportarMutation.isPending}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--accent-red)',
              borderColor: 'var(--accent-red)'
            }}
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              picture_as_pdf
            </span>
            {exportarMutation.isPending ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent) color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Ventas Totales
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {loadingEstadisticas ? (
                  <span 
                    className="animate-pulse h-8 w-24 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  `$${estadisticas?.ventasTotales?.toLocaleString() || '0'}`
                )}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'color-mix(in oklab, var(--primary-color) 15%, var(--surface-color))' }}
            >
              <span 
                className="material-symbols-outlined"
                style={{ color: 'var(--primary-color)' }}
              >
                trending_up
              </span>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Pedidos Pendientes
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {loadingEstadisticas ? (
                  <span 
                    className="animate-pulse h-8 w-16 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  estadisticas?.pedidosPendientes || '0'
                )}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'color-mix(in oklab, #f59e0b 15%, var(--surface-color))' }}
            >
              <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>
                pending
              </span>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Productos en Stock
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {loadingEstadisticas ? (
                  <span 
                    className="animate-pulse h-8 w-20 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  estadisticas?.productosEnStock?.toLocaleString() || '0'
                )}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'color-mix(in oklab, var(--accent-green) 15%, var(--surface-color))' }}
            >
              <span 
                className="material-symbols-outlined"
                style={{ color: 'var(--accent-green)' }}
              >
                inventory
              </span>
            </div>
          </div>
        </div>

        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Rendimiento Ventas
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {loadingEstadisticas ? (
                  <span 
                    className="animate-pulse h-8 w-16 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  `+${estadisticas?.rendimientoVentas?.porcentaje || '0'}%`
                )}
              </p>
              <p className="text-sm" style={{ color: 'var(--accent-green)' }}>
                {estadisticas?.rendimientoVentas?.comparacionAnterior && 
                  `+${estadisticas.rendimientoVentas.comparacionAnterior}% vs mes anterior`
                }
              </p>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'color-mix(in oklab, #a855f7 15%, var(--surface-color))' }}
            >
              <span className="material-symbols-outlined" style={{ color: '#a855f7' }}>
                analytics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de rendimiento de ventas */}
        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Rendimiento de Ventas
          </h3>
          
          {loadingGraficos ? (
            <div 
              className="animate-pulse h-48 rounded"
              style={{ backgroundColor: 'var(--border-color)' }}
            ></div>
          ) : (
            <div className="relative h-48 w-full">
              <svg viewBox="0 0 500 150" className="w-full h-full">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {datosGraficos?.puntos && (
                  <path
                    d={`M ${datosGraficos.puntos.map(p => `${p.x},${p.y}`).join(' L ')}`}
                    stroke="var(--primary-color)"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                )}
                
                {datosGraficos?.puntos && (
                  <path
                    d={`M ${datosGraficos.puntos.map(p => `${p.x},${p.y}`).join(' L ')} L ${datosGraficos.puntos[datosGraficos.puntos.length - 1]?.x},150 L ${datosGraficos.puntos[0]?.x},150 Z`}
                    fill="url(#gradient)"
                  />
                )}
                
                {datosGraficos?.puntos?.map((punto, index) => (
                  <circle
                    key={index}
                    cx={punto.x}
                    cy={punto.y}
                    r="4"
                    fill="var(--primary-color)"
                    className="drop-shadow-sm"
                  />
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Distribución de productos */}
        <div 
          className="rounded-xl shadow-sm p-6"
          style={{ 
            backgroundColor: 'var(--surface-color)',
            borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
            border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Distribución de Productos
          </h3>
          
          {loadingGraficos ? (
            <div 
              className="animate-pulse h-48 rounded"
              style={{ backgroundColor: 'var(--border-color)' }}
            ></div>
          ) : (
            <div className="space-y-4">
              {datosGraficos?.porcentajes?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.producto}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-20 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--border-color)' }}
                    >
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.porcentaje}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <span 
                      className="text-sm font-bold min-w-[3rem] text-right"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.porcentaje}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div 
        className="rounded-xl shadow-sm p-6"
        style={{ 
          backgroundColor: 'var(--surface-color)',
          borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
          border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
        }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Filtros de Búsqueda
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Producto
            </label>
            <input
              type="text"
              value={filtros.producto || ''}
              onChange={(e) => handleFiltroChange('producto', e.target.value)}
              placeholder="Buscar producto..."
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--surface-color)',
                borderColor: 'var(--border-color)',
                border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)',
                color: 'var(--text-primary)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--surface-color)',
                borderColor: 'var(--border-color)',
                border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)',
                color: 'var(--text-primary)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value="">Todos los estados</option>
              <option value="completado">Completado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio || ''}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--surface-color)',
                borderColor: 'var(--border-color)',
                border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)',
                color: 'var(--text-primary)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin || ''}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--surface-color)',
                borderColor: 'var(--border-color)',
                border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)',
                color: 'var(--text-primary)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--text-secondary)' }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de ventas por vendedor */}
      <div 
        className="rounded-xl shadow-sm overflow-hidden"
        style={{ 
          backgroundColor: 'var(--surface-color)',
          borderColor: 'color-mix(in oklab, var(--border-color) 25%, transparent)',
          border: '1px solid color-mix(in oklab, var(--border-color) 10%, transparent)'
        }}
      >
        <div 
          className="px-6 py-4"
          style={{ 
            borderBottomColor: 'var(--border-color)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid'
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Ventas por Vendedor
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loadingVentas ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-4 rounded w-full"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <table className="min-w-full">
              <thead style={{ backgroundColor: 'color-mix(in oklab, var(--border-color) 50%, var(--surface-color))' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody 
                className="divide-y"
                style={{ 
                  backgroundColor: 'var(--surface-color)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {ventasData?.data?.map((venta) => (
                  <tr 
                    key={venta.id} 
                    className="transition-colors hover:opacity-90"
                    style={{ backgroundColor: 'var(--surface-color)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {venta.vendedor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {venta.producto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {venta.cantidad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        ${venta.ingresos.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          venta.estado === 'completado' ? 'status-completed' : 'status-pending'
                        }`}
                      >
                        {venta.estado === 'completado' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {new Date(venta.fecha).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loadingVentas && (!ventasData?.data || ventasData.data.length === 0) && (
          <div className="text-center py-8">
            <span 
              className="material-symbols-outlined text-4xl mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              search_off
            </span>
            <p style={{ color: 'var(--text-secondary)' }}>
              No se encontraron ventas con los filtros aplicados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;