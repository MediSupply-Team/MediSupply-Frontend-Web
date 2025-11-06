'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MovimientosInventarioService, type MovimientoInventario } from '@/services/movimientosInventarioService';
import { useNotifications } from '@/store/appStore';

interface ModalRegistroMovimientoProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: string;
  productoNombre: string;
  tipoMovimiento: 'INGRESO' | 'SALIDA';
  onSuccess?: () => void;
}

export default function ModalRegistroMovimiento({
  isOpen,
  onClose,
  productoId,
  productoNombre,
  tipoMovimiento,
  onSuccess,
}: ModalRegistroMovimientoProps) {
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    cantidad: '',
    lote: '',
    bodega_id: 'BOG_CENTRAL',
    pais: 'CO',
    fecha_vencimiento: '',
    usuario_id: 'USR_TEST_001',
    referencia_documento: '',
    observaciones: '',
  });

  // Reset form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cantidad: '',
        lote: '',
        bodega_id: 'BOG_CENTRAL',
        pais: 'CO',
        fecha_vencimiento: '',
        usuario_id: 'USR_TEST_001',
        referencia_documento: '',
        observaciones: '',
      });
    }
  }, [isOpen]);

  const registrarMovimientoMutation = useMutation({
    mutationFn: async (movimiento: MovimientoInventario) => {
      return await MovimientosInventarioService.registrarMovimiento(movimiento);
    },
    onSuccess: () => {
      addNotification({
        tipo: 'success',
        titulo: 'Movimiento registrado',
        mensaje: `${tipoMovimiento === 'INGRESO' ? 'Ingreso (compra)' : 'Salida (venta)'} registrado exitosamente`,
      });
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      addNotification({
        tipo: 'error',
        titulo: 'Error al registrar movimiento',
        mensaje: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
      addNotification({
        tipo: 'error',
        titulo: 'Error de validación',
        mensaje: 'La cantidad debe ser mayor a 0',
      });
      return;
    }

    if (!formData.lote) {
      addNotification({
        tipo: 'error',
        titulo: 'Error de validación',
        mensaje: 'El lote es obligatorio',
      });
      return;
    }

    if (tipoMovimiento === 'INGRESO' && !formData.fecha_vencimiento) {
      addNotification({
        tipo: 'error',
        titulo: 'Error de validación',
        mensaje: 'La fecha de vencimiento es obligatoria para ingresos',
      });
      return;
    }

    const movimiento: MovimientoInventario = {
      producto_id: productoId,
      bodega_id: formData.bodega_id,
      pais: formData.pais,
      lote: formData.lote,
      tipo_movimiento: tipoMovimiento,
      motivo: tipoMovimiento === 'INGRESO' ? 'COMPRA' : 'VENTA',
      cantidad: parseInt(formData.cantidad),
      usuario_id: formData.usuario_id,
      referencia_documento: formData.referencia_documento || `${tipoMovimiento}-${Date.now()}`,
    };

    // Agregar fecha_vencimiento solo para INGRESO
    if (tipoMovimiento === 'INGRESO' && formData.fecha_vencimiento) {
      movimiento.fecha_vencimiento = formData.fecha_vencimiento;
    }

    // Agregar observaciones solo si no está vacío
    if (formData.observaciones.trim()) {
      movimiento.observaciones = formData.observaciones;
    }

    registrarMovimientoMutation.mutate(movimiento);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--surface-color)] rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {tipoMovimiento === 'INGRESO' ? 'Registrar Ingreso (Compra)' : 'Registrar Salida (Venta)'}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Producto: <strong>{productoNombre}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          {/* Lote */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Lote <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lote}
              onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              placeholder="Ej: LOT123_2024"
              required
            />
          </div>

          {/* Fecha de vencimiento (solo para INGRESO) */}
          {tipoMovimiento === 'INGRESO' && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Fecha de Vencimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                required
              />
            </div>
          )}

          {/* Bodega */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Bodega
            </label>
            <select
              value={formData.bodega_id}
              onChange={(e) => setFormData({ ...formData, bodega_id: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            >
              <option value="BOG_CENTRAL">Bodega Central</option>
              <option value="BOG_SUCURSAL_1">Bodega Sucursal 1</option>
              <option value="BOG_SUCURSAL_2">Bodega Sucursal 2</option>
            </select>
          </div>

          {/* Referencia Documento */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Referencia Documento
            </label>
            <input
              type="text"
              value={formData.referencia_documento}
              onChange={(e) => setFormData({ ...formData, referencia_documento: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              placeholder={tipoMovimiento === 'INGRESO' ? 'Ej: PO-2024-001' : 'Ej: ORD-2024-001'}
            />
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              rows={3}
              placeholder="Detalles adicionales (opcional)"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={registrarMovimientoMutation.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registrarMovimientoMutation.isPending ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
