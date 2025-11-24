'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProductoBackend } from '@/hooks/useProductos';
import { useNotifications } from '@/store/appStore';
import { productoSchema, type ProductoFormData } from '@/schemas/productoSchema';

interface Bodega {
  id: string;
  nombre: string;
  codigo: string;
  tipo: string;
  ciudad: string;
  pais: string;
  activo: boolean;
}

export default function AgregarProductoPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const createMutation = useCreateProductoBackend();
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loadingBodegas, setLoadingBodegas] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      sku: '',
      codigoBarras: '',
      categoria: '',
      marca: '',
      descripcion: '',
      stockInicial: undefined,
      stockMinimo: undefined,
      unidadMedida: '',
      almacen: '',
      ubicacion: '',
      temperatura: 'Temperatura Ambiente',
      fechaVencimiento: '',
      precioCosto: undefined,
      precioVenta: undefined,
      proveedor: '',
      registroSanitario: '',
    }
  });

  // Cargar bodegas al montar el componente
  useEffect(() => {
    const fetchBodegas = async () => {
      try {
        const response = await fetch('https://medisupply-backend.duckdns.org/venta/api/v1/bodegas?size=50');
        if (!response.ok) throw new Error('Error al cargar bodegas');
        const data = await response.json();
        setBodegas(data.items || []);
      } catch (error) {
        console.error('Error cargando bodegas:', error);
        addNotification({
          tipo: 'error',
          titulo: 'Error',
          mensaje: 'No se pudieron cargar las bodegas',
        });
      } finally {
        setLoadingBodegas(false);
      }
    };
    fetchBodegas();
  }, [addNotification]);

  const onSubmit = async (data: ProductoFormData) => {
    try {
      // Convertir undefined a 0 para los campos numéricos
      const processedData = {
        ...data,
        stockInicial: data.stockInicial || 0,
        stockMinimo: data.stockMinimo || 0,
        precioCosto: data.precioCosto || 0,
        precioVenta: data.precioVenta || 0,
      };

      // 1. Crear el producto en el catálogo
      const productoCreado = await createMutation.mutateAsync(processedData);

      // 2. Si hay stock inicial, crear movimiento de inventario
      if (processedData.stockInicial > 0) {
        try {
          // Encontrar la bodega seleccionada para obtener su pais
          const bodegaSeleccionada = bodegas.find(b => b.id === data.almacen);
          const timestamp = Date.now().toString().slice(-6);
          
          const movimientoPayload = {
            producto_id: productoCreado.id,
            bodega_id: data.almacen, // Ahora es el ID de la bodega
            pais: bodegaSeleccionada?.pais || 'CO',
            lote: `LOTE${timestamp}_${new Date().getFullYear()}`,
            tipo_movimiento: 'INGRESO',
            motivo: 'INVENTARIO_INICIAL',
            cantidad: processedData.stockInicial,
            fecha_vencimiento: data.fechaVencimiento || undefined,
            usuario_id: 'SYSTEM',
            referencia_documento: `INICIAL_${data.sku}`,
            observaciones: `Stock inicial del producto ${data.nombre}`,
          };

          await fetch('https://medisupply-backend.duckdns.org/venta/api/v1/inventory/movements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(movimientoPayload),
          });
        } catch (invError) {
          console.error('Error al crear movimiento de inventario:', invError);
          // No fallar la creación del producto si falla el movimiento
        }
      }

      addNotification({
        tipo: 'success',
        titulo: 'Producto creado',
        mensaje: `${data.nombre} se agregó correctamente al inventario`,
      });

      reset();
      router.push('/productos');
    } catch {
      addNotification({
        tipo: 'error',
        titulo: 'Error al crear producto',
        mensaje: 'No se pudo agregar el producto. Intente nuevamente.',
      });
    }
  };

  const handleCancelar = () => {
    reset();
    router.push('/productos');
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleCancelar}
            type="button"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver al inventario</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Agregar Nuevo Producto
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Complete la información del producto para agregarlo al inventario
        </p>
      </header>

      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="nombre">
                  Nombre del Producto *
                </label>
                <input
                  {...register('nombre')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.nombre ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="nombre"
                  placeholder="Ej: Jeringas Desechables 10ml"
                  type="text"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="sku">
                  SKU *
                </label>
                <input
                  {...register('sku')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.sku ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="sku"
                  placeholder="JER-10ML-001"
                  type="text"
                />
                {errors.sku && (
                  <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="codigoBarras">
                  Código de Barras
                </label>
                <input
                  {...register('codigoBarras')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.codigoBarras ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="codigoBarras"
                  placeholder="7501234567890"
                  type="text"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="categoria">
                  Categoría *
                </label>
                <select
                  {...register('categoria')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.categoria ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="categoria"
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Equipos Médicos">Equipos Médicos</option>
                  <option value="Insumos Descartables">Insumos Descartables</option>
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Material Quirúrgico">Material Quirúrgico</option>
                  <option value="Equipos de Protección">Equipos de Protección</option>
                </select>
                {errors.categoria && (
                  <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="marca">
                  Marca *
                </label>
                <input
                  {...register('marca')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.marca ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="marca"
                  placeholder="BD, Fresenius, Johnson & Johnson"
                  type="text"
                />
                {errors.marca && (
                  <p className="text-red-500 text-xs mt-1">{errors.marca.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="descripcion">
                  Descripción *
                </label>
                <textarea
                  {...register('descripcion')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.descripcion ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="descripcion"
                  placeholder="Descripción detallada del producto..."
                  rows={3}
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Stock */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información de Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="stockInicial">
                  Stock Inicial *
                </label>
                <input
                  {...register('stockInicial', { 
                    setValueAs: (value) => {
                      if (value === '' || value === null || value === undefined) {
                        return undefined;
                      }
                      const num = parseInt(value, 10);
                      return isNaN(num) ? undefined : num;
                    }
                  })}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.stockInicial ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="stockInicial"
                  placeholder="0"
                  type="number"
                  min="0"
                />
                {errors.stockInicial && (
                  <p className="text-red-500 text-xs mt-1">{errors.stockInicial.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="stockMinimo">
                  Stock Mínimo *
                </label>
                <input
                  {...register('stockMinimo', { 
                    setValueAs: (value) => {
                      if (value === '' || value === null || value === undefined) {
                        return undefined;
                      }
                      const num = parseInt(value, 10);
                      return isNaN(num) ? undefined : num;
                    }
                  })}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.stockMinimo ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="stockMinimo"
                  placeholder="10"
                  type="number"
                  min="0"
                />
                {errors.stockMinimo && (
                  <p className="text-red-500 text-xs mt-1">{errors.stockMinimo.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="unidadMedida">
                  Unidad de Medida *
                </label>
                <select
                  {...register('unidadMedida')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.unidadMedida ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="unidadMedida"
                >
                  <option value="">Seleccione la unidad</option>
                  <option value="unidad">Unidad</option>
                  <option value="caja">Caja</option>
                  <option value="pack">Pack</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="gr">Gramos (gr)</option>
                  <option value="kg">Kilogramos (kg)</option>
                </select>
                {errors.unidadMedida && (
                  <p className="text-red-500 text-xs mt-1">{errors.unidadMedida.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación y Almacenamiento */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Ubicación y Almacenamiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="almacen">
                  Bodega *
                </label>
                <select
                  {...register('almacen')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.almacen ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="almacen"
                  disabled={loadingBodegas}
                >
                  <option value="">
                    {loadingBodegas ? 'Cargando bodegas...' : 'Seleccione la bodega'}
                  </option>
                  {bodegas.filter(b => b.activo).map((bodega) => (
                    <option key={bodega.id} value={bodega.id}>
                      {bodega.nombre} - {bodega.ciudad} ({bodega.pais}) - {bodega.tipo}
                    </option>
                  ))}
                </select>
                {errors.almacen && (
                  <p className="text-red-500 text-xs mt-1">{errors.almacen.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="ubicacion">
                  Ubicación Específica
                </label>
                <input
                  {...register('ubicacion')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.ubicacion ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="ubicacion"
                  placeholder="Estante A-1, Pasillo 3"
                  type="text"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="temperatura">
                  Temperatura de Almacenamiento *
                </label>
                <select
                  {...register('temperatura')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.temperatura ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="temperatura"
                >
                  <option value="Temperatura Ambiente">Temperatura Ambiente (15-25°C)</option>
                  <option value="Refrigeración">Refrigeración (2-8°C)</option>
                  <option value="Congelación">Congelación (-18°C)</option>
                  <option value="Controlada">Temperatura Controlada</option>
                </select>
                {errors.temperatura && (
                  <p className="text-red-500 text-xs mt-1">{errors.temperatura.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="fechaVencimiento">
                  Fecha de Vencimiento
                </label>
                <input
                  {...register('fechaVencimiento')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.fechaVencimiento ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="fechaVencimiento"
                  type="date"
                />
              </div>
            </div>
          </div>

          {/* Información Comercial */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="precioCosto">
                  Precio de Costo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    {...register('precioCosto', { 
                      setValueAs: (value) => {
                        if (value === '' || value === null || value === undefined) {
                          return undefined;
                        }
                        const num = parseFloat(value);
                        return isNaN(num) ? undefined : num;
                      }
                    })}
                    className={`w-full rounded-lg border bg-[var(--surface-color)] pl-8 text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                      errors.precioCosto ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                    id="precioCosto"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.precioCosto && (
                  <p className="text-red-500 text-xs mt-1">{errors.precioCosto.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="precioVenta">
                  Precio de Venta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    {...register('precioVenta', { 
                      setValueAs: (value) => {
                        if (value === '' || value === null || value === undefined) {
                          return undefined;
                        }
                        const num = parseFloat(value);
                        return isNaN(num) ? undefined : num;
                      }
                    })}
                    className={`w-full rounded-lg border bg-[var(--surface-color)] pl-8 text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                      errors.precioVenta ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                    id="precioVenta"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.precioVenta && (
                  <p className="text-red-500 text-xs mt-1">{errors.precioVenta.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="proveedor">
                  Proveedor Principal *
                </label>
                <select
                  {...register('proveedor')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.proveedor ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="proveedor"
                >
                  <option value="">Seleccione el proveedor</option>
                  <option value="Proveedora Médica SA">Proveedora Médica SA</option>
                  <option value="Distribuidora Hospitalaria">Distribuidora Hospitalaria</option>
                  <option value="Suministros Médicos Ltda">Suministros Médicos Ltda</option>
                  <option value="MediCorp Internacional">MediCorp Internacional</option>
                </select>
                {errors.proveedor && (
                  <p className="text-red-500 text-xs mt-1">{errors.proveedor.message}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="registroSanitario">
                  Registro Sanitario
                </label>
                <input
                  {...register('registroSanitario')}
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3 ${
                    errors.registroSanitario ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="registroSanitario"
                  placeholder="INVIMA 2023M-0001234"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isSubmitting || createMutation.isPending) ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Guardar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}