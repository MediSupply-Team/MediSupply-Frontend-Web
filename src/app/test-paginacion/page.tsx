'use client';

import { useState } from 'react';
import { useProductosBackend } from '@/hooks/useProductos';
import type { FiltrosInventario } from '@/types';

export default function TestPaginacionPage() {
  const [filtros, setFiltros] = useState<FiltrosInventario>({
    page: 1,
    limit: 10,
  });

  const { data: productos, isLoading, error } = useProductosBackend(filtros);

  const handlePagination = (newPage: number) => {
    setFiltros(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFiltros(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test de Paginación</h1>
      
      {/* Controles */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Productos por página:</label>
          <select 
            value={filtros.limit} 
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Página actual:</label>
          <input 
            type="number" 
            value={filtros.page} 
            onChange={(e) => setFiltros(prev => ({ ...prev, page: Number(e.target.value) }))}
            className="border rounded px-3 py-2 w-20"
            min={1}
            max={productos?.totalPages || 1}
          />
        </div>
      </div>

      {/* Estado */}
      {isLoading && (
        <div className="text-center py-4">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      )}

      {/* Información de paginación */}
      {productos && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="font-semibold mb-2">Información de Paginación:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Página actual:</strong> {productos.page}
            </div>
            <div>
              <strong>Total páginas:</strong> {productos.totalPages}
            </div>
            <div>
              <strong>Total productos:</strong> {productos.total}
            </div>
            <div>
              <strong>Por página:</strong> {productos.limit}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <strong>Rango:</strong> {((productos.page - 1) * productos.limit) + 1}-{Math.min(productos.page * productos.limit, productos.total)} de {productos.total}
          </div>
        </div>
      )}

      {/* Botones de paginación */}
      {productos && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePagination(1)}
            disabled={productos.page <= 1}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Primera
          </button>
          <button
            onClick={() => handlePagination(productos.page - 1)}
            disabled={productos.page <= 1}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Anterior
          </button>
          <span className="px-3 py-2 bg-gray-100 rounded">
            {productos.page} de {productos.totalPages}
          </span>
          <button
            onClick={() => handlePagination(productos.page + 1)}
            disabled={productos.page >= productos.totalPages}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Siguiente
          </button>
          <button
            onClick={() => handlePagination(productos.totalPages)}
            disabled={productos.page >= productos.totalPages}
            className="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Última
          </button>
        </div>
      )}

      {/* Lista de productos */}
      {productos && (
        <div className="space-y-2">
          <h3 className="font-semibold">Productos en esta página ({productos.data.length}):</h3>
          <div className="grid gap-2">
            {productos.data.map((producto, index) => (
              <div key={producto.id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{producto.nombre}</h4>
                    <p className="text-sm text-gray-600">SKU: {producto.sku}</p>
                    <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    #{((productos.page - 1) * productos.limit) + index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}