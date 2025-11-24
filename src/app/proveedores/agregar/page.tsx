'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface ProveedorFormData {
  nit: string;
  empresa: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  contacto_cargo: string;
  direccion: string;
  pais: string;
  activo: boolean;
  notas: string;
}

export default function AgregarProveedorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProveedorFormData>({
    nit: '',
    empresa: '',
    contacto_nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    contacto_cargo: '',
    direccion: '',
    pais: 'CO',
    activo: true,
    notas: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by_user_id: 'USUARIO-001', // TODO: Obtener del usuario autenticado
      };

      const response = await fetch(
        'https://medisupply-backend.duckdns.org/venta/api/v1/proveedores',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Error al crear el proveedor');
      }

      // Redirigir a la lista de proveedores
      router.push('/proveedores');
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      alert('Error al crear el proveedor. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/proveedores');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            type="button"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Proveedores</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Agregar Nuevo Proveedor
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Complete la información del proveedor para agregarlo al sistema
        </p>
      </header>

      {/* Formulario */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información de la Empresa */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="empresa"
                >
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="Ej: Distribuidora MediPro S.A.S"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="nit"
                >
                  NIT *
                </label>
                <input
                  type="text"
                  id="nit"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="900999777-1"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="pais"
                >
                  País *
                </label>
                <select
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                >
                  <option value="CO">Colombia</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="PE">Perú</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="direccion"
                >
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="Carrera 50 #30-15, Oficina 301"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="contacto_nombre"
                >
                  Nombre del Contacto *
                </label>
                <input
                  type="text"
                  id="contacto_nombre"
                  name="contacto_nombre"
                  value={formData.contacto_nombre}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="Carlos Alberto Méndez"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="contacto_cargo"
                >
                  Cargo *
                </label>
                <input
                  type="text"
                  id="contacto_cargo"
                  name="contacto_cargo"
                  value={formData.contacto_cargo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="Gerente de Ventas"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="contacto_email"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="contacto_email"
                  name="contacto_email"
                  value={formData.contacto_email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="contacto_telefono"
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="contacto_telefono"
                  name="contacto_telefono"
                  value={formData.contacto_telefono}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="+57 310 4567890"
                />
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información Adicional
            </h3>
            <div className="space-y-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="notas"
                >
                  Notas
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] p-3"
                  placeholder="Información adicional sobre el proveedor..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                />
                <label
                  htmlFor="activo"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Proveedor activo
                </label>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Proveedor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
