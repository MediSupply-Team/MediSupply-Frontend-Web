'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vendedoresService } from '@/services/vendedoresService';
import { productosBackendListService } from '@/services/productosBackendListService';
import { useNotifications } from '@/store/appStore';
import type { Producto } from '@/types';

interface ProductoPlan {
  producto_id: string;
  meta_cantidad: number;
  precio_unitario: number;
}

interface FormData {
  identificacion: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  pais: string;
  username: string;
  rol: string;
  rol_vendedor_id: number;
  territorio_id: number;
  fecha_ingreso: string;
  observaciones: string;
  activo: boolean;
  clientes_ids: string[];
  plan_venta: {
    tipo_plan_id: number;
    nombre_plan: string;
    fecha_inicio: string;
    fecha_fin: string;
    meta_ventas: number;
    comision_base: number;
    estructura_bonificaciones: {
      [key: string]: number;
    };
    observaciones: string;
    productos: ProductoPlan[];
    region_ids: number[];
    zona_ids: number[];
  };
}

export default function NuevoVendedorPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [mostrarModalCredenciales, setMostrarModalCredenciales] = useState(false);
  const [credenciales, setCredenciales] = useState<{
    email: string;
    password: string;
    username: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    identificacion: '',
    nombre_completo: '',
    email: '',
    telefono: '',
    pais: 'CO',
    username: '',
    rol: 'seller',
    rol_vendedor_id: 1,
    territorio_id: 1,
    fecha_ingreso: new Date().toISOString().split('T')[0],
    observaciones: '',
    activo: true,
    clientes_ids: [],
    plan_venta: {
      tipo_plan_id: 1,
      nombre_plan: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      meta_ventas: '' as unknown as number,
      comision_base: '' as unknown as number,
      estructura_bonificaciones: {
        '70': 1,
        '90': 3,
        '100': 20,
      },
      observaciones: '',
      productos: [],
      region_ids: [1],
      zona_ids: [1],
    },
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    producto_id: '',
    meta_cantidad: '' as unknown as number,
    precio_unitario: '' as unknown as number,
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoadingProductos(true);
      const response = await productosBackendListService.obtenerProductos({
        page: 1,
        limit: 100,
        busqueda: '',
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'Error al cargar el listado de productos',
      });
    } finally {
      setLoadingProductos(false);
    }
  };

  const agregarProductoAPlan = () => {
    if (!productoSeleccionado.producto_id || !productoSeleccionado.meta_cantidad || productoSeleccionado.meta_cantidad <= 0 || !productoSeleccionado.precio_unitario || productoSeleccionado.precio_unitario <= 0) {
      addNotification({
        tipo: 'warning',
        titulo: 'Validación',
        mensaje: 'Complete todos los campos del producto',
      });
      return;
    }

    // Verificar que no esté duplicado
    if (formData.plan_venta.productos.some(p => p.producto_id === productoSeleccionado.producto_id)) {
      addNotification({
        tipo: 'warning',
        titulo: 'Validación',
        mensaje: 'Este producto ya está en el plan',
      });
      return;
    }

    setFormData({
      ...formData,
      plan_venta: {
        ...formData.plan_venta,
        productos: [...formData.plan_venta.productos, { ...productoSeleccionado }],
      },
    });

    setProductoSeleccionado({
      producto_id: '',
      meta_cantidad: '' as unknown as number,
      precio_unitario: '' as unknown as number,
    });
  };

  const eliminarProductoDePlan = (productoId: string) => {
    setFormData({
      ...formData,
      plan_venta: {
        ...formData.plan_venta,
        productos: formData.plan_venta.productos.filter(p => p.producto_id !== productoId),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.plan_venta.productos.length === 0) {
      addNotification({
        tipo: 'warning',
        titulo: 'Validación',
        mensaje: 'Debe agregar al menos un producto al plan de ventas',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await vendedoresService.crearVendedor(formData);
      
      // Guardar credenciales para mostrar en el modal
      setCredenciales({
        email: response.email,
        password: response.generated_password || '',
        username: response.username,
      });
      
      setMostrarModalCredenciales(true);
      
      addNotification({
        tipo: 'success',
        titulo: 'Éxito',
        mensaje: 'Vendedor creado exitosamente',
      });
    } catch (error) {
      console.error('Error al crear vendedor:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'Error al crear el vendedor',
      });
    } finally {
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = (texto: string, campo: string) => {
    navigator.clipboard.writeText(texto);
    addNotification({
      tipo: 'success',
      titulo: 'Copiado',
      mensaje: `${campo} copiado al portapapeles`,
    });
  };

  const cerrarModalYVolver = () => {
    setMostrarModalCredenciales(false);
    router.push('/vendedores');
  };

  const getRolVendedorId = (rol: string): number => {
    const roles: Record<string, number> = {
      'seller': 1,
      'senior_seller': 3,
      'supervisor': 2,
      'manager': 5,
    };
    return roles[rol] || 1;
  };

  if (loadingProductos) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined animate-spin text-4xl text-[var(--primary-color)]">
            refresh
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.push('/vendedores')}
              className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Agregar Nuevo Vendedor
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] ml-14">
            Complete el formulario para registrar un nuevo vendedor en el sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-[var(--surface-color)] rounded-lg border border-[var(--border-color)] p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              Información Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="Juan Carlos Pérez García"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Identificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.identificacion}
                  onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="1012345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="vendedor@medisupply.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="+57-300-123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="jperez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  País <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  required
                >
                  <option value="CO">Colombia</option>
                  <option value="MX">México</option>
                  <option value="PE">Perú</option>
                  <option value="CL">Chile</option>
                  <option value="AR">Argentina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => {
                    const nuevoRol = e.target.value;
                    setFormData({ 
                      ...formData, 
                      rol: nuevoRol,
                      rol_vendedor_id: getRolVendedorId(nuevoRol)
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  required
                >
                  <option value="seller">Vendedor</option>
                  <option value="senior_seller">Vendedor Senior</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Gerente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Fecha de Ingreso <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha_ingreso}
                  onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="Vendedor con experiencia en sector hospitalario"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Plan de Ventas */}
          <div className="bg-[var(--surface-color)] rounded-lg border border-[var(--border-color)] p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">sell</span>
              Plan de Ventas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Nombre del Plan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.plan_venta.nombre_plan}
                  onChange={(e) => setFormData({
                    ...formData,
                    plan_venta: { ...formData.plan_venta, nombre_plan: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="Plan Premium Q1 2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Meta de Ventas <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.plan_venta.meta_ventas}
                  onChange={(e) => setFormData({
                    ...formData,
                    plan_venta: { ...formData.plan_venta, meta_ventas: e.target.value === '' ? '' as unknown as number : parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="120000.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Fecha Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plan_venta.fecha_inicio}
                  onChange={(e) => setFormData({
                    ...formData,
                    plan_venta: { ...formData.plan_venta, fecha_inicio: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Fecha Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.plan_venta.fecha_fin}
                  onChange={(e) => setFormData({
                    ...formData,
                    plan_venta: { ...formData.plan_venta, fecha_fin: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Comisión Base (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.plan_venta.comision_base}
                  onChange={(e) => setFormData({
                    ...formData,
                    plan_venta: { ...formData.plan_venta, comision_base: e.target.value === '' ? '' as unknown as number : parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  placeholder="20.0"
                  required
                />
              </div>
            </div>

            {/* Agregar Productos */}
            <div className="border-t border-[var(--border-color)] pt-4">
              <h3 className="text-md font-medium text-[var(--text-primary)] mb-3">
                Productos del Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Producto
                  </label>
                  <select
                    value={productoSeleccionado.producto_id}
                    onChange={(e) => setProductoSeleccionado({
                      ...productoSeleccionado,
                      producto_id: e.target.value
                    })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                  >
                    <option value="">Seleccione...</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Meta Cantidad
                  </label>
                  <input
                    type="number"
                    value={productoSeleccionado.meta_cantidad}
                    onChange={(e) => setProductoSeleccionado({
                      ...productoSeleccionado,
                      meta_cantidad: e.target.value === '' ? '' as unknown as number : parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productoSeleccionado.precio_unitario}
                    onChange={(e) => setProductoSeleccionado({
                      ...productoSeleccionado,
                      precio_unitario: e.target.value === '' ? '' as unknown as number : parseFloat(e.target.value)
                    })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-colors"
                    placeholder="420.00"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={agregarProductoAPlan}
                    className="w-full px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de productos agregados */}
              {formData.plan_venta.productos.length > 0 && (
                <div className="space-y-2">
                  {formData.plan_venta.productos.map((prod) => {
                    const producto = productos.find(p => p.id === prod.producto_id);
                    return (
                      <div
                        key={prod.producto_id}
                        className="flex items-center justify-between p-3 bg-[var(--background-color)] rounded-lg border border-[var(--border-color)]"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-[var(--text-primary)]">
                            {producto?.nombre || prod.producto_id}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Cantidad: {prod.meta_cantidad} | Precio: ${prod.precio_unitario.toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarProductoDePlan(prod.producto_id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/vendedores')}
              className="px-6 py-2 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--hover-color)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              )}
              {loading ? 'Creando...' : 'Crear Vendedor'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Credenciales */}
      {mostrarModalCredenciales && credenciales && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface-color)] rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-3xl">
                  check_circle
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Vendedor Creado
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Guarde estas credenciales
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Usuario */}
              <div className="bg-[var(--background-color)] rounded-lg p-4 border border-[var(--border-color)]">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Usuario
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[var(--text-primary)] font-medium">
                    {credenciales.username}
                  </p>
                  <button
                    onClick={() => copiarAlPortapapeles(credenciales.username, 'Usuario')}
                    className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors"
                    title="Copiar usuario"
                  >
                    <span className="material-symbols-outlined text-[var(--primary-color)]">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="bg-[var(--background-color)] rounded-lg p-4 border border-[var(--border-color)]">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Email
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[var(--text-primary)] font-medium break-all">
                    {credenciales.email}
                  </p>
                  <button
                    onClick={() => copiarAlPortapapeles(credenciales.email, 'Email')}
                    className="p-2 hover:bg-[var(--hover-color)] rounded-lg transition-colors flex-shrink-0"
                    title="Copiar email"
                  >
                    <span className="material-symbols-outlined text-[var(--primary-color)]">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>

              {/* Contraseña */}
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                <label className="block text-xs text-yellow-800 mb-1 font-medium">
                  Contraseña Generada
                </label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-yellow-900 font-bold text-lg">
                    {credenciales.password}
                  </p>
                  <button
                    onClick={() => copiarAlPortapapeles(credenciales.password, 'Contraseña')}
                    className="p-2 hover:bg-yellow-100 rounded-lg transition-colors flex-shrink-0"
                    title="Copiar contraseña"
                  >
                    <span className="material-symbols-outlined text-yellow-700">
                      content_copy
                    </span>
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    warning
                  </span>
                  <span>Esta contraseña solo se muestra una vez. Guárdela en un lugar seguro.</span>
                </p>
              </div>
            </div>

            <button
              onClick={cerrarModalYVolver}
              className="w-full px-4 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium"
            >
              Entendido, volver al listado
            </button>
          </div>
        </div>
      )}
    </>
  );
}
