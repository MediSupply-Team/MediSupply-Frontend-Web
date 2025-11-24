'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MovimientosInventarioService, type MovimientoInventario } from '@/services/movimientosInventarioService';
import { useNotifications } from '@/store/appStore';

interface BodegaInventario {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string;
  pais: string;
  cantidad: number;
}

interface LoteInventario {
  pais: string;
  bodegaId: string;
  lote: string;
  cantidad: number;
  vence: string;
  condiciones: string;
}

interface ModalRegistroMovimientoProps {
  isOpen: boolean;
  onClose: () => void;
  productoId: string;
  productoNombre: string;
  tipoMovimiento: 'INGRESO' | 'SALIDA';
  bodegasProducto?: BodegaInventario[];
  onSuccess?: () => void;
}

export default function ModalRegistroMovimiento({
  isOpen,
  onClose,
  productoId,
  productoNombre,
  tipoMovimiento,
  bodegasProducto = [],
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

  const [lotesDisponibles, setLotesDisponibles] = useState<LoteInventario[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(false);

  // Función para obtener lotes del producto
  const obtenerLotesProducto = async (bodegaId: string) => {
    if (tipoMovimiento !== 'SALIDA' || !productoId) return;
    
    setLoadingLotes(true);
    try {
      const response = await fetch(
        `https://medisupply-backend.duckdns.org/venta/api/v1/catalog/items/${productoId}/inventario?page=1&size=100`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener lotes');
      }
      
      const data = await response.json();
      // Filtrar solo los lotes de la bodega seleccionada
      const lotesDeBodega = data.items.filter((lote: LoteInventario) => lote.bodegaId === bodegaId);
      setLotesDisponibles(lotesDeBodega);
      
      // Si hay lotes, seleccionar el primero por defecto
      if (lotesDeBodega.length > 0) {
        setFormData(prev => ({
          ...prev,
          lote: lotesDeBodega[0].lote,
        }));
      } else {
        setFormData(prev => ({ ...prev, lote: '' }));
      }
    } catch (error) {
      console.error('Error obteniendo lotes:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'No se pudieron cargar los lotes disponibles',
      });
      setLotesDisponibles([]);
    } finally {
      setLoadingLotes(false);
    }
  };

  // Reset form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      // Para SALIDA con bodegas específicas, dejar bodega_id vacío
      const bodegaInicial = tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length > 0 
        ? '' 
        : 'BOG_CENTRAL';
      
      const paisInicial = tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length > 0
        ? ''
        : 'CO';
      
      setFormData({
        cantidad: '',
        lote: '',
        bodega_id: bodegaInicial,
        pais: paisInicial,
        fecha_vencimiento: '',
        usuario_id: 'USR_TEST_001',
        referencia_documento: '',
        observaciones: '',
      });
      
      // Limpiar lotes disponibles
      setLotesDisponibles([]);
    }
  }, [isOpen, tipoMovimiento, bodegasProducto]);

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

    if (!formData.bodega_id) {
      addNotification({
        tipo: 'error',
        titulo: 'Error de validación',
        mensaje: 'Debe seleccionar una bodega',
      });
      return;
    }

    // Validar stock del lote para SALIDA
    if (tipoMovimiento === 'SALIDA') {
      const loteSeleccionado = lotesDisponibles.find(l => l.lote === formData.lote);
      if (loteSeleccionado && parseInt(formData.cantidad) > loteSeleccionado.cantidad) {
        addNotification({
          tipo: 'error',
          titulo: 'Stock insuficiente',
          mensaje: `El lote "${loteSeleccionado.lote}" solo tiene ${loteSeleccionado.cantidad} unidades disponibles. No puede vender ${formData.cantidad} unidades.`,
        });
        return;
      }
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

    console.log('📦 Datos del movimiento a enviar:', {
      movimiento,
      bodegaSeleccionada: bodegasProducto?.find(b => b.id === formData.bodega_id),
      tipoMovimiento,
    });

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
          {/* Bodega */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Bodega {tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length > 0 && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData.bodega_id}
              onChange={(e) => {
                const bodegaSeleccionada = bodegasProducto?.find(b => b.id === e.target.value);
                setFormData({ 
                  ...formData, 
                  bodega_id: e.target.value,
                  pais: bodegaSeleccionada?.pais || formData.pais,
                  lote: '', // Reset lote cuando cambia la bodega
                });
                // Cargar lotes de la bodega seleccionada si es SALIDA
                if (tipoMovimiento === 'SALIDA' && e.target.value) {
                  obtenerLotesProducto(e.target.value);
                }
              }}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              required={tipoMovimiento === 'SALIDA'}
            >
              {tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length > 0 ? (
                <>
                  <option value="">Seleccione una bodega</option>
                  {bodegasProducto.map((bodega) => (
                    <option key={bodega.id} value={bodega.id}>
                      {bodega.nombre} - {bodega.ciudad} ({bodega.pais}) - Stock: {bodega.cantidad}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value="BOG_CENTRAL">Bodega Central</option>
                  <option value="BOG_SUCURSAL_1">Bodega Sucursal 1</option>
                  <option value="BOG_SUCURSAL_2">Bodega Sucursal 2</option>
                </>
              )}
            </select>
            {tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Este producto no tiene stock disponible en ninguna bodega
              </p>
            )}
            {tipoMovimiento === 'SALIDA' && bodegasProducto && bodegasProducto.length > 0 && (
              <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                <span>El stock total puede estar distribuido en múltiples lotes. Asegúrese de usar un lote existente.</span>
              </p>
            )}
          </div>

          {/* Lote */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Lote <span className="text-red-500">*</span>
            </label>
            
            {/* Para SALIDA: mostrar selector de lotes si hay bodega seleccionada */}
            {tipoMovimiento === 'SALIDA' && formData.bodega_id && formData.bodega_id !== '' ? (
              <>
                {loadingLotes ? (
                  <div className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] px-3 py-2 text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    <span>Cargando lotes disponibles...</span>
                  </div>
                ) : lotesDisponibles.length > 0 ? (
                  <select
                    value={formData.lote}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                    className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    required
                  >
                    <option value="">Seleccione un lote</option>
                    {lotesDisponibles.map((lote) => (
                      <option key={lote.lote} value={lote.lote}>
                        {lote.lote} - Stock: {lote.cantidad} - Vence: {lote.vence}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-600 text-sm">
                    No hay lotes disponibles en esta bodega
                  </div>
                )}
              </>
            ) : tipoMovimiento === 'SALIDA' ? (
              <div className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--border-color)]/30 px-3 py-2 text-[var(--text-secondary)] text-sm">
                Seleccione una bodega primero
              </div>
            ) : (
              /* Para INGRESO: input de texto normal */
              <input
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                placeholder="Ej: LOT123_2024"
                required
              />
            )}
            
            {tipoMovimiento === 'SALIDA' && lotesDisponibles.length > 0 && (
              <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                <span>Seleccione el lote del cual desea realizar la salida. El stock mostrado es específico de ese lote.</span>
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={tipoMovimiento === 'SALIDA' && formData.lote ? 
                lotesDisponibles.find(l => l.lote === formData.lote)?.cantidad : undefined}
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
              placeholder="Ingrese la cantidad"
              required
            />
            {tipoMovimiento === 'SALIDA' && formData.lote && lotesDisponibles.find(l => l.lote === formData.lote) && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Stock máximo disponible en este lote: <strong>{lotesDisponibles.find(l => l.lote === formData.lote)?.cantidad}</strong>
              </p>
            )}
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
