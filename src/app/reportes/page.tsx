'use client';

import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Package, 
  BarChart3,
  FileDown,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw
} from 'lucide-react';
import { useSalesPerformance } from '@/hooks/useBackend';
import type { SalesPerformanceFilters } from '@/types';
import { useI18n } from '@/hooks/useI18n';

export default function ReportesPage() {
  const { formatCurrency, formatDate, formatNumber } = useI18n();
  
  // Estado para filtros - por defecto último mes
  const [periodo, setPeriodo] = useState({
    inicio: '2025-10-01',
    fin: '2025-11-30',
  });

  // Filtros para el backend
  const backendFilters: SalesPerformanceFilters = useMemo(() => ({
    from: periodo.inicio,
    to: periodo.fin,
  }), [periodo.inicio, periodo.fin]);

  // Hook principal del backend
  const { data: salesData, isLoading, refetch } = useSalesPerformance(backendFilters);

  // Función para obtener estadísticas del backend
  const stats = useMemo(() => {
    if (!salesData?.estadisticas) {
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProduct: '-',
        performance: 0,
        isPositive: false,
      };
    }

    const stats = salesData.estadisticas;
    const totalSales = stats.ventasTotales || 0;
    const pendingOrders = stats.ordenesPendientes || 0;
    
    // Calcular producto top desde los gráficos
    let topProductName = '-';
    if (salesData.graficos?.productosTop && salesData.graficos.productosTop.length > 0) {
      topProductName = salesData.graficos.productosTop[0].nombre;
    }
    
    // Calcular valor promedio desde la tabla
    let averageValue = 0;
    if (salesData.tabla && salesData.tabla.length > 0) {
      const totalRevenue = salesData.tabla.reduce((sum: number, row: { ingresos: number }) => sum + row.ingresos, 0);
      const totalQuantity = salesData.tabla.reduce((sum: number, row: { cantidad: number }) => sum + row.cantidad, 0);
      averageValue = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;
    }
    
    return {
      totalSales: totalSales,
      totalOrders: pendingOrders,
      averageOrderValue: averageValue,
      topProduct: topProductName,
      performance: stats.cambioVentas || 0,
      isPositive: (stats.cambioVentas || 0) >= 0,
    };
  }, [salesData]);

  // Datos de gráficos
  const chartData = useMemo(() => {
    if (!salesData?.graficos) {
      return {
        trend: [],
        topProducts: [],
      };
    }

    return {
      trend: salesData.graficos.tendencia || [],
      topProducts: salesData.graficos.productosTop || [],
    };
  }, [salesData]);

  // Datos de tabla
  const tableData = useMemo(() => {
    if (!salesData?.tabla) {
      return [];
    }

    return salesData.tabla;
  }, [salesData]);

  const handleExportar = async (formato: 'excel' | 'pdf') => {
    try {
      if (!salesData?.metadata) {
        alert('No hay datos para exportar');
        return;
      }
      
      // Mapear formato: excel -> csv (ya que el backend usa csv para Excel)
      const formatoBackend = formato === 'excel' ? 'csv' : 'pdf';
      
      // Construir URL del endpoint
      const exportUrl = `https://medisupply-backend.duckdns.org/venta/api/reports/sales-performance/export?from=${periodo.inicio}&to=${periodo.fin}&format=${formatoBackend}`;
      
      // Hacer la petición al backend
      const response = await fetch(exportUrl);
      
      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }
      
      const data = await response.json();
      
      // Verificar que tengamos la URL de descarga
      if (!data.url) {
        throw new Error('No se recibió la URL de descarga');
      }
      
      // Abrir la URL en una nueva pestaña para descargar el archivo
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al generar el reporte. Por favor, intenta nuevamente.');
    }
  };

  const handleQuickPeriod = (days: number) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    setPeriodo({
      inicio: startDate.toISOString().split('T')[0],
      fin: today.toISOString().split('T')[0],
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* === ENCABEZADO === */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Análisis de Ventas
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Reportes y estadísticas en tiempo real
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botones de exportación */}
            <button
              onClick={() => handleExportar('excel')}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <FileDown className="h-4 w-4" />
              Exportar Excel
            </button>
            <button
              onClick={() => handleExportar('pdf')}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
        </div>

      {/* === FILTROS === */}
      <div className="rounded-xl bg-[var(--surface-color)] p-6 shadow-sm border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-[var(--text-secondary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Período:
            </span>
            
            <input
              type="date"
              value={periodo.inicio}
              onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] px-3 py-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500"
            />
            
            <span className="text-[var(--text-secondary)]">a</span>
            
            <input
              type="date"
              value={periodo.fin}
              onChange={(e) => setPeriodo({ ...periodo, fin: e.target.value })}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] px-3 py-2 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500"
            />              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleQuickPeriod(30)}
                className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Últimos 30 días
              </button>
              <button
                onClick={() => handleQuickPeriod(90)}
                className="rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                Últimos 3 meses
              </button>
            </div>
          </div>
        </div>

        {/* === TARJETAS DE ESTADÍSTICAS === */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Ventas Totales */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">Ventas Totales</span>
                <div className="rounded-lg bg-white/20 p-2">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mb-2 text-3xl font-bold">
                {formatCurrency(stats.totalSales)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stats.isPositive ? 'text-green-100' : 'text-red-100'
              }`}>
                <TrendingUp className="h-4 w-4" />
                <span>{stats.isPositive ? '+' : ''}{stats.performance.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Total de Pedidos */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">Total Pedidos</span>
                <div className="rounded-lg bg-white/20 p-2">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="mb-2 text-3xl font-bold">
                {formatNumber(stats.totalOrders)}
              </div>
              <div className="text-sm text-purple-100">
                Pedidos procesados
              </div>
            </div>
          </div>

          {/* Valor Promedio */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">Valor Promedio</span>
                <div className="rounded-lg bg-white/20 p-2">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="mb-2 text-3xl font-bold">
                {formatCurrency(stats.averageOrderValue)}
              </div>
              <div className="text-sm text-orange-100">
                Por pedido
              </div>
            </div>
          </div>

          {/* Producto Top */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">Producto Top</span>
                <div className="rounded-lg bg-white/20 p-2">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <div className="mb-2 text-xl font-bold line-clamp-2">
                {stats.topProduct}
              </div>
              <div className="text-sm text-green-100">
                Más vendido
              </div>
            </div>
          </div>
        </div>

        {/* === GRÁFICOS === */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Vendedores */}
        <div className="rounded-xl bg-[var(--surface-color)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Top Vendedores
            </h2>
            <Users className="h-5 w-5 text-[var(--text-secondary)]" />
          </div>
          
          {(() => {
            // Agrupar ventas por vendedor
            const ventasPorVendedor = tableData.reduce((acc: { [key: string]: number }, row: { vendedor: string; ingresos: number }) => {
              acc[row.vendedor] = (acc[row.vendedor] || 0) + row.ingresos;
              return acc;
            }, {});
            
            // Convertir a array y ordenar
            const topVendedores = Object.entries(ventasPorVendedor)
              .map(([nombre, total]) => ({ nombre, total: total as number }))
              .sort((a, b) => b.total - a.total)
              .slice(0, 5);
            
            const maxVentas = topVendedores.length > 0 ? topVendedores[0].total : 0;
            
            return topVendedores.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-[var(--text-secondary)]">
                No hay datos de vendedores disponibles
              </div>
            ) : (
              <div className="space-y-4">
                {topVendedores.map((vendedor, index) => {
                  const percentage = maxVentas > 0 ? (vendedor.total / maxVentas) * 100 : 0;
                  const colors = [
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-orange-500 to-orange-600',
                    'from-green-500 to-green-600',
                    'from-pink-500 to-pink-600'
                  ];
                  
                  return (
                    <div key={vendedor.nombre}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${colors[index]} shadow-sm`}>
                            <span className="text-xs font-bold text-white">#{index + 1}</span>
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            {vendedor.nombre}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {formatCurrency(vendedor.total)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${colors[index]} transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Top Productos */}
        <div className="rounded-xl bg-[var(--surface-color)] p-6 shadow-sm border border-[var(--border-color)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Productos Más Vendidos
            </h2>
            <Package className="h-5 w-5 text-[var(--text-secondary)]" />
          </div>
          
          {chartData.topProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-[var(--text-secondary)]">
              No hay datos de productos disponibles
            </div>
          ) : (
            <div className="space-y-4">
              {chartData.topProducts.map((product: { nombre: string; valor: number }, index: number) => {
                const maxAmount = Math.max(...chartData.topProducts.map((p: { valor: number }) => p.valor || 0));
                const percentage = maxAmount > 0 ? ((product.valor || 0) / maxAmount) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                        {product.nombre}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {formatCurrency(product.valor || 0)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>

        {/* === TABLA DE VENTAS === */}
        <div className="rounded-xl bg-[var(--surface-color)] shadow-sm border border-[var(--border-color)]">
          <div className="border-b border-[var(--border-color)] p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Detalle de Ventas por Vendedor
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {tableData.length} resultados
            </p>
          </div>
          
          {tableData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-[var(--text-secondary)]">
              No hay datos de ventas disponibles para el período seleccionado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--border-color)]/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Vendedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {tableData.map((row: { vendedor: string; producto: string; cantidad: number; ingresos: number; estado: string; fecha: string }, index: number) => (
                    <tr key={index} className="hover:bg-[var(--border-color)]/30 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-[var(--text-primary)]">
                              {row.vendedor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-primary)]">
                        {row.producto}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {formatNumber(row.cantidad)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                        {formatCurrency(row.ingresos)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          row.estado === 'completado' || row.estado === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20'
                            : row.estado === 'pendiente' || row.estado === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {row.estado}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {formatDate(row.fecha)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
