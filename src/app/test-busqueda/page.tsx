'use client';

import { useState } from 'react';
import { obtenerProductosBackend } from '@/services/productosBackendListService';
import type { ProductosResponse, Producto } from '@/types';

export default function TestBusquedaPage() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<ProductosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await obtenerProductosBackend({
        busqueda: busqueda,
        page: 1,
        limit: 10
      });
      setResultados(resultado);
      console.log('Resultados de búsqueda:', resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test de Búsqueda de Productos</h1>
      
      <div className="flex gap-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe aquí para buscar productos..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={handleBuscar}
          disabled={loading || !busqueda.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          Error: {error}
        </div>
      )}

      {resultados && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Resultados ({resultados.total} productos encontrados)
          </h2>
          
          <div className="grid gap-4">
            {resultados.data.map((producto: Producto) => (
              <div key={producto.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium">{producto.nombre}</h3>
                <p className="text-sm text-gray-600">SKU: {producto.sku}</p>
                <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                <p className="text-sm text-gray-600">Categoría: {producto.categoria}</p>
                <p className="text-sm text-gray-600">Estado: {producto.estadoStock}</p>
              </div>
            ))}
          </div>
          
          {resultados.data.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No se encontraron productos para &quot;{busqueda}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}