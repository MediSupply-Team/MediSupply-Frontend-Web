'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { vendedoresService, type Vendedor } from '@/services/vendedoresService';
import { useNotifications } from '@/store/appStore';

export default function VendedoresPage() {
  const router = useRouter();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [vendedorExpandido, setVendedorExpandido] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const size = 50;

  const cargarVendedores = async () => {
    try {
      setLoading(true);
      const response = await vendedoresService.obtenerVendedores(page, size);
      setVendedores(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
      addNotification({
        tipo: 'error',
        titulo: 'Error',
        mensaje: 'Error al cargar el listado de vendedores',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVendedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAgregarVendedor = () => {
    router.push('/vendedores/nuevo');
  };

  const getRolLabel = (rol: string) => {
    const roles: Record<string, string> = {
      'seller': 'Vendedor',
      'senior_seller': 'Vendedor Senior',
      'supervisor': 'Supervisor',
      'manager': 'Gerente',
    };
    return roles[rol] || rol;
  };

  const getPaisLabel = (pais: string) => {
    const paises: Record<string, string> = {
      'CO': 'Colombia',
      'MX': 'México',
      'PE': 'Perú',
      'CL': 'Chile',
      'AR': 'Argentina',
    };
    return paises[pais] || pais;
  };

  const toggleVendedor = (vendedorId: string, tieneClientes: boolean) => {
    if (!tieneClientes) return;
    setVendedorExpandido(vendedorExpandido === vendedorId ? null : vendedorId);
  };

  if (loading) {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Vendedores
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gestión del equipo de ventas y representantes
          </p>
        </div>
        <button
          onClick={handleAgregarVendedor}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Vendedor
        </button>
      </div>

      {/* Stats */}
      <div className="bg-[var(--surface-color)] rounded-lg p-4 border border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="material-symbols-outlined">badge</span>
          <span>
            Total de vendedores: <strong className="text-[var(--text-primary)]">{total}</strong>
          </span>
        </div>
      </div>

      {/* Tabla de vendedores */}
      <div className="bg-[var(--surface-color)] rounded-lg border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background-color)] border-b border-[var(--border-color)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Vendedor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Contacto
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  País
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Clientes
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                  Fecha Ingreso
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {vendedores.map((vendedor) => {
                const tieneClientes = vendedor.clientes_asociados.length > 0;
                const estaExpandido = vendedorExpandido === vendedor.id;
                
                return (
                  <Fragment key={vendedor.id}>
                    <tr
                      onClick={() => toggleVendedor(vendedor.id, tieneClientes)}
                      className={`transition-colors ${
                        tieneClientes 
                          ? 'hover:bg-[var(--hover-color)] cursor-pointer' 
                          : 'hover:bg-[var(--hover-color)]/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {tieneClientes && (
                            <span 
                              className={`material-symbols-outlined text-[var(--text-secondary)] transition-transform ${
                                estaExpandido ? 'rotate-90' : ''
                              }`}
                              style={{ fontSize: '20px' }}
                            >
                              chevron_right
                            </span>
                          )}
                          <div className={tieneClientes ? '' : 'ml-7'}>
                            <div className="font-medium text-[var(--text-primary)]">
                              {vendedor.nombre_completo}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              {vendedor.identificacion}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                        {vendedor.username}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-[var(--text-primary)]">{vendedor.email}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{vendedor.telefono}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                        {getPaisLabel(vendedor.pais)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                            {vendedor.rol === 'supervisor' ? 'supervisor_account' : 'badge'}
                          </span>
                          {getRolLabel(vendedor.rol)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)] text-center">
                        <span 
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                            tieneClientes 
                              ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {vendedor.clientes_asociados.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            vendedor.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: vendedor.activo ? '#22c55e' : '#ef4444',
                            }}
                          />
                          {vendedor.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                        {new Date(vendedor.fecha_ingreso).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>

                    {/* Fila expandible con clientes asociados */}
                    {estaExpandido && tieneClientes && (
                      <tr>
                        <td colSpan={8} className="px-0 py-0">
                          <div className="bg-[var(--background-color)] border-t border-b border-[var(--border-color)]">
                            <div className="px-8 py-4">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-[var(--primary-color)]" style={{ fontSize: '20px' }}>
                                  groups
                                </span>
                                <h4 className="font-medium text-[var(--text-primary)]">
                                  Clientes Asociados ({vendedor.clientes_asociados.length})
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {vendedor.clientes_asociados.map((clienteId) => (
                                  <div
                                    key={clienteId}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-colors"
                                  >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[var(--primary-color)]" style={{ fontSize: '20px' }}>
                                        person
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-[var(--text-secondary)] mb-0.5">
                                        ID Cliente
                                      </p>
                                      <p className="text-sm font-mono text-[var(--text-primary)] truncate">
                                        {clienteId.substring(0, 8)}...
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {vendedores.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-[var(--text-tertiary)] mb-2">
              badge
            </span>
            <p className="text-[var(--text-secondary)]">
              No se encontraron vendedores
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {total > size && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-color)]"
          >
            Anterior
          </button>
          <span className="text-sm text-[var(--text-secondary)]">
            Página {page} de {Math.ceil(total / size)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / size)}
            className="px-3 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-color)]"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}