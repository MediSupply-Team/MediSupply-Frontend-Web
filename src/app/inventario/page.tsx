'use client';

import { useState } from 'react';
import { inventarioService, InventarioResponse } from '@/services/inventarioService';
import { Search, Package, MapPin, Calendar, AlertCircle } from 'lucide-react';

export default function InventarioPage() {
  const [productoId, setProductoId] = useState('');
  const [inventario, setInventario] = useState<InventarioResponse | null>(null);
  const [buscando, setBuscando] = useState(false);

  const handleBuscar = async () => {
    if (!productoId.trim()) {
      console.warn('Por favor ingrese un ID de producto');
      return;
    }

    setBuscando(true);
    try {
      const resultado = await inventarioService.obtenerInventarioProducto(productoId.trim());
      setInventario(resultado);
      
      if (resultado.items.length === 0) {
        console.info('No se encontró inventario para este producto');
      }
    } catch (error) {
      console.error('Error al buscar inventario:', error);
      setInventario(null);
    } finally {
      setBuscando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)]">
          Inventario
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Consulta el inventario disponible por producto
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-[var(--card)] rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="productoId" className="block text-sm font-medium mb-2 text-[var(--foreground)]">
              ID del Producto
            </label>
            <input
              id="productoId"
              type="text"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: 22222222-2222-2222-2222-000000000007"
              className="w-full border-2 border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleBuscar}
              disabled={buscando}
              className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {inventario && (
        <div className="bg-[var(--card)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              <Package className="w-5 h-5" />
              Resultados de Búsqueda
            </h2>
            <div className="text-sm text-[var(--muted-foreground)]">
              Total: {inventario.meta.total} registros
            </div>
          </div>

          {inventario.items.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
              <p className="text-[var(--muted-foreground)]">
                No se encontró inventario para este producto
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      País
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      Bodega ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      Lote
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      Cantidad
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      Vencimiento
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
                      Condiciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventario.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[var(--primary-color)]" />
                          <span className="font-medium">{item.pais}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-[var(--accent)] px-2 py-1 rounded">
                          {item.bodegaId}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{item.lote}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-[var(--primary-color)]">
                          {item.cantidad.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <span>{new Date(item.vence).toLocaleDateString('es-CO')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--muted-foreground)]">
                        {item.condiciones}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Meta información */}
          {inventario.items.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-[var(--muted-foreground)]">
              Mostrando página {inventario.meta.page} • {inventario.items.length} de {inventario.meta.total} registros • Consultado en {inventario.meta.tookMs}ms
            </div>
          )}
        </div>
      )}
    </div>
  );
}