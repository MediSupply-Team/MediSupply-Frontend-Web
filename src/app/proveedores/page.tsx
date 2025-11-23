'use client'

import { useState, useEffect, useCallback } from 'react';
import { Plus, Upload, Search, Building2, Phone, Mail, MapPin, FileText } from 'lucide-react';

interface Proveedor {
  id: string;
  empresa: string;
  nit: string;
  direccion: string;
  pais: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  contacto_cargo: string;
  activo: boolean;
  notas?: string;
  created_at: string;
  updated_at: string;
}

interface ProveedoresResponse {
  items: Proveedor[];
  meta: {
    page: number;
    size: number;
    total: number;
    tookMs: number;
  };
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://medisupply-backend.duckdns.org/venta/api/v1/proveedores?page=${currentPage}&size=${pageSize}`
      );
      if (!response.ok) throw new Error('Error al cargar proveedores');
      
      const data: ProveedoresResponse = await response.json();
      setProveedores(data.items);
      setTotal(data.meta.total);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / pageSize);

  const handleAgregarProveedor = () => {
    // TODO: Implementar navegación a formulario de agregar
    console.log('Agregar proveedor individual');
  };

  const handleAgregarMasivo = () => {
    // TODO: Implementar carga masiva
    console.log('Agregar proveedores de forma masiva');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Proveedores</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gestión de proveedores y empresas colaboradoras
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAgregarMasivo}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Carga Masiva</span>
          </button>
          <button
            onClick={handleAgregarProveedor}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Proveedor</span>
          </button>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary-color)]/10 rounded-lg">
              <Building2 className="w-5 h-5 text-[var(--primary-color)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{total}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total Proveedores</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {proveedores.filter(p => p.activo).length}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Activos</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <span className="material-symbols-outlined text-red-500">cancel</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {proveedores.filter(p => !p.activo).length}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Inactivos</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <span className="material-symbols-outlined text-blue-500">flag</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">CO</p>
              <p className="text-sm text-[var(--text-secondary)]">País Principal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Buscar por empresa, NIT o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
          />
        </div>
      </div>

      {/* Lista de Proveedores */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl">
        <div className="px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Lista de Proveedores ({filteredProveedores.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-[var(--primary-color)] animate-spin text-4xl">
              refresh
            </span>
          </div>
        ) : filteredProveedores.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            No se encontraron proveedores
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {filteredProveedores.map((proveedor) => (
              <div
                key={proveedor.id}
                className="p-6 hover:bg-[var(--border-color)]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--primary-color)]/10 rounded-lg">
                      <Building2 className="w-6 h-6 text-[var(--primary-color)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                          {proveedor.empresa}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            proveedor.activo
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {proveedor.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        NIT: {proveedor.nit}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-[70px]">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[var(--text-secondary)]">
                        {proveedor.direccion}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[var(--text-secondary)] text-base">
                        flag
                      </span>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {proveedor.pais}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[var(--text-secondary)] text-base">
                        person
                      </span>
                      <p className="text-sm text-[var(--text-primary)] font-medium">
                        {proveedor.contacto_nombre}
                      </p>
                      <span className="text-xs text-[var(--text-secondary)]">
                        ({proveedor.contacto_cargo})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                      <a
                        href={`mailto:${proveedor.contacto_email}`}
                        className="text-sm text-[var(--primary-color)] hover:underline"
                      >
                        {proveedor.contacto_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
                      <a
                        href={`tel:${proveedor.contacto_telefono}`}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                      >
                        {proveedor.contacto_telefono}
                      </a>
                    </div>
                  </div>
                </div>

                {proveedor.notas && (
                  <div className="mt-4 ml-[70px] flex items-start gap-2 p-3 bg-[var(--background-color)] rounded-lg">
                    <FileText className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)]">
                      {proveedor.notas}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && filteredProveedores.length > 0 && (
          <div className="px-6 py-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">
                Mostrando {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, total)} de {total} proveedores
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[var(--primary-color)] text-white'
                          : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-color)]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}