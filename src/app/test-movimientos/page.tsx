'use client';

import { useState } from 'react';
import { MovimientosInventarioService, type ProductoDetalle, type MovimientoResponse } from '@/services/movimientosInventarioService';

export default function TestMovimientosPage() {
  const [productoId, setProductoId] = useState('PROD014');
  const [detalleProducto, setDetalleProducto] = useState<ProductoDetalle | { error: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<MovimientoResponse | { error: string } | null>(null);

  const testObtenerDetalle = async () => {
    setLoading(true);
    try {
      const detalle = await MovimientosInventarioService.obtenerDetalleProducto(productoId);
      setDetalleProducto(detalle);
      console.log('Detalle del producto:', detalle);
    } catch (error) {
      console.error('Error:', error);
      setDetalleProducto({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const testRegistrarIngreso = async () => {
    setLoading(true);
    try {
      const movimiento = {
        producto_id: productoId,
        bodega_id: 'BOG_CENTRAL',
        pais: 'CO',
        lote: 'TEST001_2024',
        tipo_movimiento: 'INGRESO' as const,
        motivo: 'COMPRA' as const,
        cantidad: 100,
        fecha_vencimiento: '2025-12-31',
        usuario_id: 'USR_TEST_001',
        referencia_documento: 'PO-2024-001',
        observaciones: 'Prueba de ingreso desde frontend',
      };
      const result = await MovimientosInventarioService.registrarMovimiento(movimiento);
      setResultado(result);
      console.log('Resultado ingreso:', result);
    } catch (error) {
      console.error('Error:', error);
      setResultado({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const testRegistrarSalida = async () => {
    setLoading(true);
    try {
      const movimiento = {
        producto_id: productoId,
        bodega_id: 'BOG_CENTRAL',
        pais: 'CO',
        lote: 'AMX001_2024',
        tipo_movimiento: 'SALIDA' as const,
        motivo: 'VENTA' as const,
        cantidad: 5,
        usuario_id: 'TEST_USER',
        referencia_documento: 'ORD-TEST-001',
        observaciones: 'Prueba de salida (venta) desde frontend',
      };
      const result = await MovimientosInventarioService.registrarMovimiento(movimiento);
      setResultado(result);
      console.log('Resultado salida:', result);
    } catch (error) {
      console.error('Error:', error);
      setResultado({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Test Movimientos de Inventario
          </h1>
          <p className="text-[var(--text-secondary)]">
            Prueba de endpoints para registrar ingresos y salidas de productos
          </p>
        </header>

        {/* Input Producto ID */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            1. Configuración
          </h2>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              ID del Producto:
            </label>
            <input
              type="text"
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              placeholder="Ej: PROD014"
            />
          </div>
        </div>

        {/* Test Detalle Producto */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            2. Obtener Detalle del Producto
          </h2>
          <button
            onClick={testObtenerDetalle}
            disabled={loading}
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Obtener Detalle'}
          </button>
          
          {detalleProducto && (
            <div className="mt-4 p-4 bg-[var(--background-color)] rounded-lg">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(detalleProducto, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Registrar Ingreso */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            3. Registrar Ingreso (Compra)
          </h2>
          <div className="mb-4 text-sm text-[var(--text-secondary)]">
            <p><strong>Endpoint:</strong> POST /api/v1/inventory/movements</p>
            <p><strong>Body:</strong></p>
            <pre className="mt-2 p-2 bg-[var(--background-color)] rounded text-xs overflow-auto">
{`{
  "producto_id": "${productoId}",
  "bodega_id": "BOG_CENTRAL",
  "pais": "CO",
  "lote": "TEST001_2024",
  "tipo_movimiento": "INGRESO",
  "motivo": "COMPRA",
  "cantidad": 100,
  "fecha_vencimiento": "2025-12-31",
  "usuario_id": "USR_TEST_001",
  "referencia_documento": "PO-2024-001"
}`}
            </pre>
          </div>
          <button
            onClick={testRegistrarIngreso}
            disabled={loading}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar Ingreso'}
          </button>
        </div>

        {/* Test Registrar Salida */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            4. Registrar Salida (Venta)
          </h2>
          <div className="mb-4 text-sm text-[var(--text-secondary)]">
            <p><strong>Endpoint:</strong> POST /api/v1/inventory/movements</p>
            <p><strong>Body:</strong></p>
            <pre className="mt-2 p-2 bg-[var(--background-color)] rounded text-xs overflow-auto">
{`{
  "producto_id": "${productoId}",
  "bodega_id": "BOG_CENTRAL",
  "pais": "CO",
  "lote": "AMX001_2024",
  "tipo_movimiento": "SALIDA",
  "motivo": "VENTA",
  "cantidad": 5,
  "usuario_id": "TEST_USER",
  "referencia_documento": "ORD-TEST-001"
}`}
            </pre>
          </div>
          <button
            onClick={testRegistrarSalida}
            disabled={loading}
            className="px-4 py-2 bg-[var(--accent-red)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar Salida'}
          </button>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              5. Último Resultado
            </h2>
            <div className="p-4 bg-[var(--background-color)] rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(resultado, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            ℹ️ Información
          </h2>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p><strong>Base URL:</strong> https://medisupply-backend.duckdns.org/venta</p>
            <p><strong>Endpoint Detalle:</strong> GET /api/v1/catalog/items/:id</p>
            <p><strong>Endpoint Movimientos:</strong> POST /api/v1/inventory/movements</p>
            <p className="mt-4"><strong>Campos obligatorios INGRESO:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>producto_id, bodega_id, pais, lote, tipo_movimiento, motivo</li>
              <li>cantidad, fecha_vencimiento, usuario_id, referencia_documento</li>
            </ul>
            <p className="mt-2"><strong>Campos obligatorios SALIDA:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>producto_id, bodega_id, pais, lote, tipo_movimiento, motivo</li>
              <li>cantidad, usuario_id, referencia_documento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
