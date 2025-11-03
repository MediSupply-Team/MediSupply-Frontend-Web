'use client';

import React, { useState } from 'react';
import { 
  useEstadisticasVentas, 
  useDatosGraficos, 
  useVentasVendedores
} from '@/hooks/useReportes';
import { 
  useSalesPerformance, 
  useSalesSummary, 
  useSalesCharts, 
  useSalesTable 
} from '@/hooks/useBackend';
import { useNotifications } from '@/store/appStore';
import { 
  exportToCSV, 
  exportToPDF, 
  calculateSummary,
  type FilterData 
} from '@/utils/export';
import { useExportReport } from '@/hooks/useExportReport';
import type { FiltrosReportes, SalesPerformanceFilters } from '@/types';

const ReportesPage = () => {
  // === ESTADO LOCAL ===
  const [filtros, setFiltros] = useState<FiltrosReportes>({});
  const [useBackendData, setUseBackendData] = useState(true); // Toggle para usar backend vs mock
  const [backendFilters, setBackendFilters] = useState<SalesPerformanceFilters>({
    from: '2025-09-01',
    to: '2025-09-30'
  });
  
  const { addNotification } = useNotifications();
  
  // === QUERIES MOCK DATA ===
  const { data: estadisticasMock, isLoading: loadingEstadisticasMock } = useEstadisticasVentas();
  const { data: datosGraficosMock, isLoading: loadingGraficosMock } = useDatosGraficos();
  const { data: ventasDataMock, isLoading: loadingVentasMock } = useVentasVendedores(filtros);
  
  // === QUERIES BACKEND DATA ===
  const { isLoading: loadingSalesData, error: salesError } = useSalesPerformance(backendFilters);
  const { data: salesSummary, isLoading: loadingSummary } = useSalesSummary(backendFilters);
  const { data: salesCharts, isLoading: loadingCharts } = useSalesCharts(backendFilters);
  const { data: salesTable, isLoading: loadingTable } = useSalesTable(backendFilters);
  
  // === MUTATIONS ===
  const { exportReport, isLoading: isExporting } = useExportReport();

  // === DATOS SELECCIONADOS ===
  const isLoading = useBackendData 
    ? loadingSalesData || loadingSummary || loadingCharts || loadingTable
    : loadingEstadisticasMock || loadingGraficosMock || loadingVentasMock;

  // === FUNCIONES AUXILIARES PARA MANEJAR DIFERENTES TIPOS DE DATOS ===
  const getEstadisticas = () => {
    if (useBackendData) {
      if (salesSummary && !salesError) {
        // Datos reales del backend
        return {
          ventasTotales: salesSummary.total_sales,
          pedidosPendientes: salesSummary.pending_orders,
          productosEnStock: salesSummary.products_in_stock,
          rendimientoVentas: {
            porcentaje: salesSummary.sales_change_pct_vs_prev_period,
            comparacionAnterior: salesSummary.sales_change_pct_vs_prev_period,
          }
        };
      } else {
        // Datos mock en formato del backend cuando hay error
        return {
          ventasTotales: 89306.1,
          pedidosPendientes: 4,
          productosEnStock: 2500,
          rendimientoVentas: {
            porcentaje: 0.0,
            comparacionAnterior: 0.0,
          }
        };
      }
    }
    return estadisticasMock;
  };

  const getDatosGraficos = () => {
    if (useBackendData) {
      if (salesCharts && !salesError) {
        // Datos reales del backend
        const puntos = salesCharts.trend.map((item, index) => ({
          x: index * 50 + 25, // Espaciado horizontal
          y: 150 - (item.total / 1000), // Convertir a coordenadas Y (invertidas)
        }));
        
        const porcentajes = salesCharts.top_products.map((product, index) => ({
          producto: product.product_name,
          porcentaje: Math.round((product.amount / salesCharts.top_products.reduce((sum, p) => sum + p.amount, 0)) * 100),
          color: ['#0ea5a8', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'][index % 5]
        }));
        
        return {
          puntos,
          porcentajes,
          productos: salesCharts.top_products,
        };
      } else {
        // Datos mock en formato del backend cuando hay error
        const mockTrend = [
          { date: '2025-09-01', total: 36999.5 },
          { date: '2025-09-02', total: 23714.0 },
          { date: '2025-09-03', total: 28592.6 }
        ];
        
        const mockProducts = [
          { product_name: 'Jeringas Desechables', amount: 26000.0 },
          { product_name: 'Mascarillas N95', amount: 21000.0 },
          { product_name: 'Guantes de Látex', amount: 18750.0 },
          { product_name: 'Alcohol en Gel', amount: 13556.1 },
          { product_name: 'Batas Quirúrgicas', amount: 10000.0 }
        ];

        const puntos = mockTrend.map((item, index) => ({
          x: index * 50 + 25,
          y: 150 - (item.total / 1000),
        }));
        
        const porcentajes = mockProducts.map((product, index) => ({
          producto: product.product_name,
          porcentaje: Math.round((product.amount / mockProducts.reduce((sum, p) => sum + p.amount, 0)) * 100),
          color: ['#0ea5a8', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'][index % 5]
        }));
        
        return {
          puntos,
          porcentajes,
          productos: mockProducts,
        };
      }
    }
    return datosGraficosMock;
  };

  const getVentasData = () => {
    let baseData;
    
    if (useBackendData) {
      if (salesTable && !salesError) {
        // Datos reales del backend
        baseData = {
          data: salesTable.map((row, index) => ({
            id: `backend_${index}`,
            vendedorId: `vendor_${index}`,
            vendedor: row.vendor_name,
            producto: row.product_name,
            cantidad: row.quantity,
            ingresos: row.revenue,
            estado: row.status as 'completado' | 'pendiente',
            fecha: new Date().toISOString().split('T')[0],
          }))
        };
      } else {
        // Datos mock en formato del backend cuando hay error
        const mockTableData = [
          {
            vendor_name: 'Ana López',
            product_name: 'Batas Quirúrgicas',
            quantity: 50,
            revenue: 10000.0,
            status: 'pendiente'
          },
          {
            vendor_name: 'Carlos Martínez',
            product_name: 'Alcohol en Gel',
            quantity: 73,
            revenue: 13556.1,
            status: 'completado'
          },
          {
            vendor_name: 'Juan Pérez',
            product_name: 'Jeringas Desechables',
            quantity: 130,
            revenue: 26000.0,
            status: 'completado'
          },
          {
            vendor_name: 'María García',
            product_name: 'Guantes de Látex',
            quantity: 75,
            revenue: 18750.0,
            status: 'pendiente'
          },
          {
            vendor_name: 'Pedro Rodríguez',
            product_name: 'Mascarillas N95',
            quantity: 105,
            revenue: 21000.0,
            status: 'completado'
          }
        ];

        baseData = {
          data: mockTableData.map((row, index) => ({
            id: `mock_backend_${index}`,
            vendedorId: `vendor_${index}`,
            vendedor: row.vendor_name,
            producto: row.product_name,
            cantidad: row.quantity,
            ingresos: row.revenue,
            estado: row.status as 'completado' | 'pendiente',
            fecha: new Date().toISOString().split('T')[0],
          }))
        };
      }
    } else {
      baseData = ventasDataMock;
    }

    // Aplicar filtros en el frontend
    if (baseData && baseData.data) {
      let filteredData = [...baseData.data];

      // Filtro por producto
      if (filtros.producto) {
        filteredData = filteredData.filter(item => 
          item.producto.toLowerCase().includes(filtros.producto!.toLowerCase()) ||
          item.vendedor.toLowerCase().includes(filtros.producto!.toLowerCase())
        );
      }

      // Filtro por estado
      if (filtros.estado) {
        filteredData = filteredData.filter(item => item.estado === filtros.estado);
      }

      // Filtro por fecha de inicio
      if (filtros.fechaInicio) {
        filteredData = filteredData.filter(item => item.fecha >= filtros.fechaInicio!);
      }

      // Filtro por fecha de fin
      if (filtros.fechaFin) {
        filteredData = filteredData.filter(item => item.fecha <= filtros.fechaFin!);
      }

      return {
        ...baseData,
        data: filteredData
      };
    }

    return baseData || { data: [] };
  };

  // Variables computadas
  const estadisticasActuales = getEstadisticas();
  const datosGraficosActuales = getDatosGraficos();
  const ventasDataActuales = getVentasData();

  const handleExportar = async (formato: 'excel' | 'pdf') => {
    try {
      if (useBackendData) {
        // Usar el endpoint del backend para exportación
        const result = await exportReport(backendFilters, formato === 'excel' ? 'csv' : 'pdf');
        
        if (result.success) {
          addNotification({
            tipo: 'success',
            titulo: 'Exportación exitosa',
            mensaje: result.message || `Reporte exportado exitosamente en formato ${formato.toUpperCase()}`,
          });
        } else {
          addNotification({
            tipo: 'error',
            titulo: 'Error de exportación',
            mensaje: result.error || 'Error al exportar el reporte desde el servidor',
          });
        }
      } else {
        // Fallback para datos mock usando generación local
        const ventasData = getVentasData();
        
        if (!ventasData?.data || ventasData.data.length === 0) {
          addNotification({
            tipo: 'warning',
            titulo: 'Sin datos para exportar',
            mensaje: 'No hay datos disponibles para exportar',
          });
          return;
        }

        // Adaptar datos de VentaVendedor a formato de exportación
        const exportData = ventasData.data.map(venta => ({
          id: venta.id,
          producto: venta.producto,
          proveedor: venta.vendedor, // Usando vendedor como proveedor
          fecha: venta.fecha,
          cantidad: venta.cantidad,
          precioUnitario: venta.ingresos / venta.cantidad, // Calculando precio unitario
          total: venta.ingresos,
          estado: venta.estado
        }));
        
        // Calcular resumen
        const summary = calculateSummary(exportData);
        
        // Crear objeto de filtros para incluir en el reporte
        const filterData: FilterData = {
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
          estado: filtros.estado,
          busqueda: filtros.producto // Usando producto como búsqueda
        };

        if (formato === 'excel') {
          exportToCSV(exportData, filterData);
        } else {
          exportToPDF(exportData, summary, filterData);
        }

        addNotification({
          tipo: 'success',
          titulo: 'Exportación exitosa',
          mensaje: `Reporte exportado exitosamente en formato ${formato.toUpperCase()}`,
        });
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Error de exportación',
        mensaje: 'Error al exportar el reporte. Intente nuevamente.',
      });
    }
  };

  const handleFiltroChange = (campo: keyof FiltrosReportes, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor || undefined,
    }));
  };

  const handleBackendFiltersChange = (filters: Partial<SalesPerformanceFilters>) => {
    setBackendFilters(prev => ({
      ...prev,
      ...filters,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({});
    setBackendFilters({
      from: '2025-09-01',
      to: '2025-09-30'
    });
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
          
          {/* Toggle para alternar entre datos mock y backend */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Datos Mock
            </span>
            <button
              onClick={() => setUseBackendData(!useBackendData)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useBackendData 
                  ? 'bg-[var(--primary-color)]' 
                  : 'bg-[var(--border-color)]'
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useBackendData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Backend Producción
            </span>
            {salesError && (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                Error de conexión
              </span>
            )}
          </div>
          
          {/* Filtros de Backend */}
          {useBackendData && (
            <div className="flex items-center gap-4 mt-2 p-3 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Período:
              </span>
              <input
                type="date"
                value={backendFilters.from}
                onChange={(e) => handleBackendFiltersChange({ from: e.target.value })}
                className="px-3 py-1 text-sm border border-[var(--border-color)] rounded"
                style={{ 
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>a</span>
              <input
                type="date"
                value={backendFilters.to}
                onChange={(e) => handleBackendFiltersChange({ to: e.target.value })}
                className="px-3 py-1 text-sm border border-[var(--border-color)] rounded"
                style={{ 
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={() => handleBackendFiltersChange({
                  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  to: new Date().toISOString().split('T')[0]
                })}
                className="px-3 py-1 text-xs bg-[var(--primary-color)] text-white rounded hover:opacity-90 transition-colors"
              >
                Últimos 30 días
              </button>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleExportar('excel')}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--accent-green)',
              borderColor: 'var(--accent-green)'
            }}
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              description
            </span>
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
          
          <button
            onClick={() => handleExportar('pdf')}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--accent-red)',
              borderColor: 'var(--accent-red)'
            }}
          >
            <span className="material-symbols-outlined mr-2 text-lg">
              picture_as_pdf
            </span>
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Indicador de fuente de datos */}
        <div className="lg:col-span-4 mb-4">
          <div 
            className="flex items-center justify-between p-4 rounded-lg border"
            style={{ 
              backgroundColor: useBackendData 
                ? 'color-mix(in oklab, var(--accent-green) 10%, var(--surface-color))'
                : 'color-mix(in oklab, var(--primary-color) 10%, var(--surface-color))',
              borderColor: useBackendData 
                ? 'var(--accent-green)'
                : 'var(--primary-color)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                useBackendData && !salesError 
                  ? 'bg-[var(--accent-green)]' 
                  : useBackendData && salesError 
                  ? 'bg-[var(--accent-red)]' 
                  : 'bg-[var(--primary-color)]'
              }`}></div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {useBackendData 
                  ? salesError 
                    ? 'Backend no disponible - Mostrando datos de ejemplo'
                    : 'Conectado al Backend de Producción'
                  : 'Usando Datos de Demostración'
                }
              </span>
            </div>
            
            {useBackendData && !salesError && (
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Datos del servidor de producción
              </div>
            )}
            
            {salesError && (
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Mostrando datos de demostración debido a problemas de conectividad
              </div>
            )}
          </div>
        </div>
        
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
                {isLoading ? (
                  <span 
                    className="animate-pulse h-8 w-24 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  `$${estadisticasActuales?.ventasTotales?.toLocaleString() || '0'}`
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
                {isLoading ? (
                  <span 
                    className="animate-pulse h-8 w-16 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  estadisticasActuales?.pedidosPendientes || '0'
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
                {isLoading ? (
                  <span 
                    className="animate-pulse h-8 w-20 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  estadisticasActuales?.productosEnStock?.toLocaleString() || '0'
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
                {isLoading ? (
                  <span 
                    className="animate-pulse h-8 w-16 rounded"
                    style={{ backgroundColor: 'var(--border-color)' }}
                  ></span>
                ) : (
                  `+${estadisticasActuales?.rendimientoVentas?.porcentaje || '0'}%`
                )}
              </p>
              <p className="text-sm" style={{ color: 'var(--accent-green)' }}>
                {estadisticasActuales?.rendimientoVentas?.comparacionAnterior && 
                  `+${estadisticasActuales.rendimientoVentas.comparacionAnterior}% vs mes anterior`
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
          
          {isLoading ? (
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
                
                {datosGraficosActuales?.puntos && (
                  <path
                    d={`M ${datosGraficosActuales.puntos.map((p: {x: number, y: number}) => `${p.x},${p.y}`).join(' L ')}`}
                    stroke="var(--primary-color)"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                )}
                
                {datosGraficosActuales?.puntos && (
                  <path
                    d={`M ${datosGraficosActuales.puntos.map((p: {x: number, y: number}) => `${p.x},${p.y}`).join(' L ')} L ${datosGraficosActuales.puntos[datosGraficosActuales.puntos.length - 1]?.x},150 L ${datosGraficosActuales.puntos[0]?.x},150 Z`}
                    fill="url(#gradient)"
                  />
                )}
                
                {datosGraficosActuales?.puntos?.map((punto: {x: number, y: number}, index: number) => (
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
          
          {isLoading ? (
            <div 
              className="animate-pulse h-48 rounded"
              style={{ backgroundColor: 'var(--border-color)' }}
            ></div>
          ) : (
            <div className="space-y-4">
              {datosGraficosActuales?.porcentajes?.map((item: {producto: string, porcentaje: number, color: string}, index: number) => (
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
          {(filtros.producto || filtros.estado || filtros.fechaInicio || filtros.fechaFin) && (
            <span className="ml-2 text-sm px-2 py-1 rounded-full bg-[var(--primary-color)] text-white">
              Filtros aplicados
            </span>
          )}
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Ventas por Vendedor
            </h3>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {ventasDataActuales?.data ? (
                <>
                  {ventasDataActuales.data.length} resultado{ventasDataActuales.data.length !== 1 ? 's' : ''}
                  {(filtros.producto || filtros.estado || filtros.fechaInicio || filtros.fechaFin) && (
                    <span className="ml-2 text-xs px-2 py-1 rounded bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      filtrados
                    </span>
                  )}
                </>
              ) : (
                'Cargando...'
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
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
                {ventasDataActuales?.data?.map((venta) => (
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
        
        {!isLoading && (!ventasDataActuales?.data || ventasDataActuales.data.length === 0) && (
          <div className="text-center py-8">
            <span 
              className="material-symbols-outlined text-4xl mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {(filtros.producto || filtros.estado || filtros.fechaInicio || filtros.fechaFin) ? 'filter_list_off' : 'search_off'}
            </span>
            <p style={{ color: 'var(--text-secondary)' }}>
              {(filtros.producto || filtros.estado || filtros.fechaInicio || filtros.fechaFin) 
                ? 'No se encontraron ventas con los filtros aplicados'
                : 'No hay datos de ventas disponibles'
              }
            </p>
            {(filtros.producto || filtros.estado || filtros.fechaInicio || filtros.fechaFin) && (
              <button
                onClick={limpiarFiltros}
                className="mt-3 px-4 py-2 text-sm text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesPage;