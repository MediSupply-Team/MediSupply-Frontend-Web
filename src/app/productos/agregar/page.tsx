'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProductoBackend } from '@/hooks/useProductos';
import { useNotifications } from '@/store/appStore';

interface FormularioProducto {
  nombre: string;
  sku: string;
  codigoBarras: string;
  categoria: string;
  marca: string;
  descripcion: string;
  stockInicial: number;
  stockMinimo: number;
  unidadMedida: string;
  almacen: string;
  ubicacion: string;
  temperatura: string;
  fechaVencimiento: string;
  precioCosto: number;
  precioVenta: number;
  proveedor: string;
  registroSanitario: string;
}

interface ErroresFormulario {
  nombre?: string;
  sku?: string;
  categoria?: string;
  stockInicial?: string;
  stockMinimo?: string;
  unidadMedida?: string;
  almacen?: string;
}

export default function AgregarProductoPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const createMutation = useCreateProductoBackend();

  // === ESTADO DEL FORMULARIO ===
  const [formulario, setFormulario] = useState<FormularioProducto>({
    nombre: '',
    sku: '',
    codigoBarras: '',
    categoria: '',
    marca: '',
    descripcion: '',
    stockInicial: 0,
    stockMinimo: 0,
    unidadMedida: '',
    almacen: '',
    ubicacion: '',
    temperatura: 'Temperatura Ambiente',
    fechaVencimiento: '',
    precioCosto: 0,
    precioVenta: 0,
    proveedor: '',
    registroSanitario: '',
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});

  // === HANDLERS ===
  const handleInputChange = (campo: keyof FormularioProducto, valor: string | number) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo cuando se modifica
    if (errores[campo as keyof ErroresFormulario]) {
      setErrores(prev => ({ ...prev, [campo]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};

    // Campos requeridos
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!formulario.sku.trim()) nuevosErrores.sku = 'El SKU es requerido';
    if (!formulario.categoria) nuevosErrores.categoria = 'La categoría es requerida';
    if (formulario.stockInicial < 0) nuevosErrores.stockInicial = 'El stock inicial debe ser mayor o igual a 0';
    if (formulario.stockMinimo < 0) nuevosErrores.stockMinimo = 'El stock mínimo debe ser mayor o igual a 0';
    if (!formulario.unidadMedida) nuevosErrores.unidadMedida = 'La unidad de medida es requerida';
    if (!formulario.almacen) nuevosErrores.almacen = 'El almacén es requerido';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      addNotification({
        tipo: 'error',
        titulo: 'Error en el formulario',
        mensaje: 'Por favor, complete todos los campos requeridos',
      });
      return;
    }

    try {
      // Crear el producto usando el backend
      await createMutation.mutateAsync(formulario);

      addNotification({
        tipo: 'success',
        titulo: 'Producto creado',
        mensaje: `${formulario.nombre} se agregó correctamente al inventario`,
      });

      // Redirigir de vuelta a la lista de productos
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
    router.push('/productos');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleCancelar}
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

      {/* Formulario */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.nombre ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="nombre"
                  placeholder="Ej: Jeringas Desechables 10ml"
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  required
                />
                {errores.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="sku">
                  SKU *
                </label>
                <input
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.sku ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="sku"
                  placeholder="JER-10ML-001"
                  type="text"
                  value={formulario.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  required
                />
                {errores.sku && (
                  <p className="text-red-500 text-xs mt-1">{errores.sku}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="codigo-barras">
                  Código de Barras
                </label>
                <input
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="codigo-barras"
                  placeholder="1234567890123"
                  type="text"
                  value={formulario.codigoBarras}
                  onChange={(e) => handleInputChange('codigoBarras', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="categoria">
                  Categoría *
                </label>
                <select
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.categoria ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="categoria"
                  value={formulario.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option>Equipos Médicos</option>
                  <option>Insumos Descartables</option>
                  <option>Medicamentos</option>
                  <option>Material Quirúrgico</option>
                  <option>Equipos de Protección</option>
                </select>
                {errores.categoria && (
                  <p className="text-red-500 text-xs mt-1">{errores.categoria}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="marca">
                  Marca
                </label>
                <input
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="marca"
                  placeholder="Marca del producto"
                  type="text"
                  value={formulario.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="descripcion"
                  rows={3}
                  placeholder="Descripción detallada del producto"
                  value={formulario.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                />
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
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="stock-inicial">
                  Stock Inicial *
                </label>
                <input
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.stockInicial ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="stock-inicial"
                  placeholder="0"
                  type="number"
                  min="0"
                  value={formulario.stockInicial}
                  onChange={(e) => handleInputChange('stockInicial', parseInt(e.target.value) || 0)}
                  required
                />
                {errores.stockInicial && (
                  <p className="text-red-500 text-xs mt-1">{errores.stockInicial}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="stock-minimo">
                  Stock Mínimo *
                </label>
                <input
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.stockMinimo ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="stock-minimo"
                  placeholder="10"
                  type="number"
                  min="0"
                  value={formulario.stockMinimo}
                  onChange={(e) => handleInputChange('stockMinimo', parseInt(e.target.value) || 0)}
                  required
                />
                {errores.stockMinimo && (
                  <p className="text-red-500 text-xs mt-1">{errores.stockMinimo}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="unidad-medida">
                  Unidad de Medida *
                </label>
                <select
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.unidadMedida ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="unidad-medida"
                  value={formulario.unidadMedida}
                  onChange={(e) => handleInputChange('unidadMedida', e.target.value)}
                  required
                >
                  <option value="">Seleccione unidad</option>
                  <option>unidades</option>
                  <option>cajas</option>
                  <option>paquetes</option>
                  <option>litros</option>
                  <option>gramos</option>
                  <option>kilogramos</option>
                </select>
                {errores.unidadMedida && (
                  <p className="text-red-500 text-xs mt-1">{errores.unidadMedida}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación y Almacenamiento */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Ubicación y Almacenamiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="almacen">
                  Almacén *
                </label>
                <select
                  className={`w-full rounded-lg border bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] ${
                    errores.almacen ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  id="almacen"
                  value={formulario.almacen}
                  onChange={(e) => handleInputChange('almacen', e.target.value)}
                  required
                >
                  <option value="">Seleccione almacén</option>
                  <option>Almacén Principal</option>
                  <option>Almacén Quirófano</option>
                  <option>Bodega Refrigerada</option>
                  <option>Área de Cuarentena</option>
                </select>
                {errores.almacen && (
                  <p className="text-red-500 text-xs mt-1">{errores.almacen}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="ubicacion">
                  Ubicación Específica
                </label>
                <input
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="ubicacion"
                  placeholder="Ej: Pasillo A - Estante 3"
                  type="text"
                  value={formulario.ubicacion}
                  onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="temperatura">
                  Condiciones de Temperatura
                </label>
                <select
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="temperatura"
                  value={formulario.temperatura}
                  onChange={(e) => handleInputChange('temperatura', e.target.value)}
                >
                  <option>Temperatura Ambiente</option>
                  <option>Refrigerado (2-8°C)</option>
                  <option>Congelado (-18°C)</option>
                  <option>Ambiente Controlado</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="fecha-vencimiento">
                  Fecha de Vencimiento
                </label>
                <input
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="fecha-vencimiento"
                  type="date"
                  value={formulario.fechaVencimiento}
                  onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
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
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="precio-costo">
                  Precio de Costo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] pl-8 text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="precio-costo"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formulario.precioCosto}
                    onChange={(e) => handleInputChange('precioCosto', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="precio-venta">
                  Precio de Venta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] pl-8 text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="precio-venta"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formulario.precioVenta}
                    onChange={(e) => handleInputChange('precioVenta', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="proveedor">
                  Proveedor Principal
                </label>
                <select
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="proveedor"
                  value={formulario.proveedor}
                  onChange={(e) => handleInputChange('proveedor', e.target.value)}
                >
                  <option value="">Seleccione proveedor</option>
                  <option>Suministros Médicos Global</option>
                  <option>Equipos Hospitalarios S.A.</option>
                  <option>Distribuidora MediCare</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--text-primary)]" htmlFor="registro-sanitario">
                  Registro Sanitario
                </label>
                <input
                  className="w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="registro-sanitario"
                  placeholder="Número de registro"
                  type="text"
                  value={formulario.registroSanitario}
                  onChange={(e) => handleInputChange('registroSanitario', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-6 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}