'use client';

import { useState } from 'react';
import { useMedicamentos, useCreateMedicamento } from '@/hooks/useMedicamentos';
import { useTheme, useNotifications } from '@/store/appStore';
import type { FiltrosProductos } from '@/types';

export default function EjemploUsoLibrerias() {
  // === ESTADO LOCAL ===
  const [filtros, setFiltros] = useState<FiltrosProductos>({
    nombre: '',
    categoria: '',
    page: 1,
    limit: 5,
  });

  // === HOOKS DE TANSTACK QUERY ===
  const { data: medicamentos, isLoading, error } = useMedicamentos(filtros);
  const createMutation = useCreateMedicamento();

  // === HOOKS DE ZUSTAND ===
  const { theme, toggleTheme } = useTheme();
  const { addNotification, notifications, unreadCount } = useNotifications();

  // === HANDLERS ===
  const handleFiltroChange = (campo: keyof FiltrosProductos, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      page: 1, // Reset page when filter changes
    }));
  };

  const handleCrearMedicamento = () => {
    createMutation.mutate({
      nombre: 'Medicamento de Prueba',
      codigo: 'TEST001',
      categoria: 'Pruebas',
      laboratorio: 'Test Lab',
      concentracion: '100mg',
      formaFarmaceutica: 'Tableta',
      fechaVencimiento: '2025-12-31',
      lote: 'LOT999',
      precio: 1000,
      stock: 100,
      stockMinimo: 10,
      estado: 'activo',
    }, {
      onSuccess: () => {
        addNotification({
          tipo: 'success',
          titulo: 'Éxito',
          mensaje: 'Medicamento creado correctamente',
        });
      },
      onError: () => {
        addNotification({
          tipo: 'error',
          titulo: 'Error',
          mensaje: 'No se pudo crear el medicamento',
        });
      },
    });
  };

  const handlePagination = (newPage: number) => {
    setFiltros(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Ejemplo de Uso de Librerías
        </h1>
        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:bg-[var(--secondary-color)]"
          >
            Tema: {theme}
          </button>
          <div className="px-4 py-2 bg-[var(--accent-color)] text-white rounded">
            Notificaciones: {unreadCount}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--surface-color)] rounded-lg">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Buscar por nombre:
          </label>
          <input
            type="text"
            value={filtros.nombre || ''}
            onChange={(e) => handleFiltroChange('nombre', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-color)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="Nombre del medicamento..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Categoría:
          </label>
          <select
            value={filtros.categoria || ''}
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-color)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="">Todas las categorías</option>
            <option value="Analgésicos">Analgésicos</option>
            <option value="Antiinflamatorios">Antiinflamatorios</option>
            <option value="Antibióticos">Antibióticos</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleCrearMedicamento}
            disabled={createMutation.isPending}
            className="w-full px-4 py-2 bg-[var(--accent-color)] text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Medicamento de Prueba'}
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-4">
        {/* Estados de carga y error */}
        {isLoading && (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            Cargando medicamentos...
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">
            Error: {error.message}
          </div>
        )}

        {/* Lista de medicamentos */}
        {medicamentos && (
          <>
            <div className="bg-[var(--surface-color)] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Medicamentos ({medicamentos.total} total)
                </h2>
              </div>
              
              <div className="divide-y divide-[var(--border-color)]">
                {medicamentos.data.map((medicamento) => (
                  <div key={medicamento.id} className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[var(--text-primary)]">
                          {medicamento.nombre}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {medicamento.categoria} - {medicamento.laboratorio}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Stock: {medicamento.stock} | Precio: ${medicamento.precio.toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        medicamento.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : medicamento.estado === 'agotado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {medicamento.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-[var(--text-secondary)]">
                Página {medicamentos.page} de {medicamentos.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePagination(medicamentos.page - 1)}
                  disabled={medicamentos.page <= 1}
                  className="px-3 py-1 bg-[var(--surface-color)] border border-[var(--border-color)] rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePagination(medicamentos.page + 1)}
                  disabled={medicamentos.page >= medicamentos.totalPages}
                  className="px-3 py-1 bg-[var(--surface-color)] border border-[var(--border-color)] rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notificaciones recientes */}
      {notifications.length > 0 && (
        <div className="bg-[var(--surface-color)] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            Notificaciones Recientes
          </h3>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded border-l-4 ${
                  notif.tipo === 'success' 
                    ? 'border-green-500 bg-green-50' 
                    : notif.tipo === 'error'
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="font-medium">{notif.titulo}</div>
                <div className="text-sm text-gray-600">{notif.mensaje}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}