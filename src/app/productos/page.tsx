'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductos } from '@/hooks/useProductos';
import { useNotifications } from '@/store/appStore';
import type { FiltrosInventario } from '@/types';

export default function ProductosPage() {
  // === ESTADO LOCAL ===
  const router = useRouter();
  const [filtros, setFiltros] = useState<FiltrosInventario>({
    busqueda: '',
    categoria: 'Todas las categorías',
    ubicacion: 'Ubicación',
    stockBajo: false,
    proximoVencer: false,
    masSolicitados: false,
    ordenarPor: 'nombre',
    page: 1,
    limit: 10,
  });

  // === HOOKS ===
  const { data: productos, isLoading, error } = useProductos(filtros);
  const { addNotification } = useNotifications();

  // === HANDLERS ===
  const handleFiltroChange = (campo: keyof FiltrosInventario, valor: string | number | boolean) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      page: 1, // Reset page when filter changes
    }));
  };

  const handleFiltroRapido = (tipo: 'stockBajo' | 'proximoVencer' | 'masSolicitados') => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: !prev[tipo],
      // Desactivar otros filtros rápidos
      stockBajo: tipo === 'stockBajo' ? !prev[tipo] : false,
      proximoVencer: tipo === 'proximoVencer' ? !prev[tipo] : false,
      masSolicitados: tipo === 'masSolicitados' ? !prev[tipo] : false,
      page: 1,
    }));
  };

  const handlePagination = (newPage: number) => {
    setFiltros(prev => ({ ...prev, page: newPage }));
  };

  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'status-available';
      case 'stock-bajo':
        return 'status-low-stock';
      case 'agotado':
        return 'status-out-of-stock';
      default:
        return '';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'Disponible';
      case 'stock-bajo':
        return 'Stock Bajo';
      case 'agotado':
        return 'Agotado';
      default:
        return estado;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Inventario de Productos
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Busca y gestiona productos en el inventario
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/productos/agregar')}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Agregar Producto</span>
            </button>
            <button 
              onClick={() => addNotification({
                tipo: 'info',
                titulo: 'Función en desarrollo',
                mensaje: 'La función de carga masiva estará disponible pronto',
              })}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Carga Masiva</span>
            </button>
          </div>
        </div>
      </header>

      {/* Búsqueda Principal */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                search
              </span>
              <input
                className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] pl-10 pr-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="Buscar por nombre, SKU, código de barras..."
                type="search"
                value={filtros.busqueda || ''}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] py-3 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              value={filtros.categoria || ''}
              onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            >
              <option>Todas las categorías</option>
              <option>Equipos Médicos</option>
              <option>Insumos Descartables</option>
              <option>Medicamentos</option>
              <option>Material Quirúrgico</option>
              <option>Equipos de Protección</option>
            </select>
          </div>
          <div>
            <select
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] py-3 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              value={filtros.ubicacion || ''}
              onChange={(e) => handleFiltroChange('ubicacion', e.target.value)}
            >
              <option>Ubicación</option>
              <option>Almacén Principal</option>
              <option>Almacén Quirófano</option>
              <option>Bodega Refrigerada</option>
              <option>Área de Cuarentena</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
          <div className="flex gap-2">
            <button
              onClick={() => handleFiltroRapido('stockBajo')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filtros.stockBajo
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50'
              }`}
            >
              Stock Bajo
            </button>
            <button
              onClick={() => handleFiltroRapido('proximoVencer')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filtros.proximoVencer
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50'
              }`}
            >
              Próximo a Vencer
            </button>
            <button
              onClick={() => handleFiltroRapido('masSolicitados')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filtros.masSolicitados
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50'
              }`}
            >
              Más Solicitados
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>Ordenar por:</span>
            <select
              className="border-0 bg-transparent text-[var(--text-primary)] focus:ring-0"
              value={filtros.ordenarPor || 'nombre'}
              onChange={(e) => handleFiltroChange('ordenarPor', e.target.value)}
            >
              <option value="nombre">Nombre</option>
              <option value="stock">Stock</option>
              <option value="actualizacion">Última actualización</option>
              <option value="ubicacion">Ubicación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Resultados de búsqueda
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {isLoading ? 'Cargando...' : `Se encontraron ${productos?.total || 0} productos`}
          </p>
        </div>
        
        {/* Estados de carga y error */}
        {isLoading && (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
            <p className="mt-2">Cargando productos...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            <span className="material-symbols-outlined text-2xl">error</span>
            <p className="mt-2">Error: {error.message}</p>
          </div>
        )}

        {/* Tabla de productos */}
        {productos && !isLoading && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[var(--background-color)]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Ubicación
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-right">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-center">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      Vencimiento
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {productos.data.map((producto) => (
                    <tr key={producto.id} className="hover:bg-[var(--border-color)]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--primary-color)]/10 rounded-lg flex items-center justify-center">
                            <span 
                              className="material-symbols-outlined"
                              style={{ color: producto.colorIcono }}
                            >
                              {producto.icono}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-[var(--text-primary)]">
                              {producto.nombre}
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)]">
                              Categoría: {producto.categoria}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {producto.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[var(--text-primary)]">
                          {producto.ubicacion}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {producto.ubicacionDetalle}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-semibold text-[var(--text-primary)]">
                          {producto.stock.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {producto.unidadMedida}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getEstadoClase(producto.estadoStock)}`}>
                          {getEstadoTexto(producto.estadoStock)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {producto.fechaVencimiento || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => addNotification({
                            tipo: 'info',
                            titulo: 'Función en desarrollo',
                            mensaje: `Acciones para ${producto.nombre} estarán disponibles pronto`,
                          })}
                          className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Mostrando {((productos.page - 1) * productos.limit) + 1}-{Math.min(productos.page * productos.limit, productos.total)} de {productos.total} productos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePagination(productos.page - 1)}
                  disabled={productos.page <= 1}
                  className="px-3 py-1 text-sm rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePagination(productos.page + 1)}
                  disabled={productos.page >= productos.totalPages}
                  className="px-3 py-1 text-sm rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}