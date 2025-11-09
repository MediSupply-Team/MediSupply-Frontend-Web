'use client';

import { useState } from 'react';

type TabType = 'perfil' | 'configuracion' | 'seguridad';

export default function MiPerfilPage() {
  const [activeTab, setActiveTab] = useState<TabType>('configuracion');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Configuración</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Gestiona tus preferencias de idioma, región y aplicación
        </p>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-[var(--border-color)] mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`ms-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            data-active={activeTab === 'perfil'}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('configuracion')}
            className={`ms-tab ${activeTab === 'configuracion' ? 'active' : ''}`}
            data-active={activeTab === 'configuracion'}
          >
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`ms-tab ${activeTab === 'seguridad' ? 'active' : ''}`}
            data-active={activeTab === 'seguridad'}
          >
            Seguridad
          </button>
        </nav>
      </div>

      {/* Tab Content: Perfil */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6 text-center">
              <div className="profile-avatar mx-auto mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>
                  person
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Dr. Ana María Rodríguez
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">Administrador del Sistema</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium status-completed">
                Cuenta Activa
              </span>

              <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Miembro desde</span>
                  <span className="text-[var(--text-primary)]">Enero 2023</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Último acceso</span>
                  <span className="text-[var(--text-primary)]">Hoy, 14:30</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Rol</span>
                  <span className="text-[var(--text-primary)]">Super Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                Información Personal
              </h4>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                      htmlFor="nombre"
                    >
                      Nombre
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      id="nombre"
                      defaultValue="Ana María"
                      type="text"
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                      htmlFor="apellido"
                    >
                      Apellido
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      id="apellido"
                      defaultValue="Rodríguez"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                    htmlFor="email"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="email"
                    defaultValue="ana.rodriguez@medisupply.com"
                    type="email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                      htmlFor="telefono"
                    >
                      Teléfono
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      id="telefono"
                      defaultValue="+57 300 123 4567"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                      htmlFor="cargo"
                    >
                      Cargo
                    </label>
                    <input
                      className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      id="cargo"
                      defaultValue="Administrador del Sistema"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                    htmlFor="departamento"
                  >
                    Departamento
                  </label>
                  <select
                    className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="departamento"
                  >
                    <option value="administracion">Administración</option>
                    <option value="ventas">Ventas</option>
                    <option value="inventario">Inventario</option>
                    <option value="logistica">Logística</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                    htmlFor="biografia"
                  >
                    Biografía
                  </label>
                  <textarea
                    className="form-textarea w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    id="biografia"
                    rows={4}
                    placeholder="Cuéntanos un poco sobre ti..."
                    defaultValue="Doctora especializada en administración de sistemas de salud con más de 10 años de experiencia en gestión de inventarios médicos."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Configuración */}
      {activeTab === 'configuracion' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuración de Idioma y Región */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">language</span>
              Idioma y Región
            </h4>

            <div className="space-y-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="idioma"
                >
                  Idioma de la interfaz
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="idioma"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Cambia el idioma de toda la aplicación
                </p>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="pais"
                >
                  País/Región
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="pais"
                >
                  <option value="CO">Colombia</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="PE">Perú</option>
                  <option value="CL">Chile</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="zona-horaria"
                >
                  Zona Horaria
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="zona-horaria"
                >
                  <option value="America/Bogota">Bogotá (UTC-5)</option>
                  <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                  <option value="America/Lima">Lima (UTC-5)</option>
                  <option value="America/Santiago">Santiago (UTC-4)</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="moneda"
                >
                  Moneda
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="moneda"
                >
                  <option value="COP">Peso Colombiano (COP)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="ARS">Peso Argentino (ARS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuración de Formato */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">format_list_numbered</span>
              Formato de Datos
            </h4>

            <div className="space-y-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="formato-fecha"
                >
                  Formato de Fecha
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="formato-fecha"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (ej: 25/12/2024)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (ej: 12/25/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ej: 2024-12-25)</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="formato-hora"
                >
                  Formato de Hora
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="formato-hora"
                >
                  <option value="24">24 horas (ej: 13:00)</option>
                  <option value="12">12 horas (ej: 1:00 PM)</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="separador-decimal"
                >
                  Separador Decimal
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="separador-decimal"
                >
                  <option value=",">, (Coma)</option>
                  <option value=".">. (Punto)</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="formato-numero"
                >
                  Formato de Números
                </label>
                <select
                  className="form-select w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="formato-numero"
                >
                  <option value="1.234.567,89">1.234.567,89</option>
                  <option value="1,234,567.89">1,234,567.89</option>
                  <option value="1 234 567,89">1 234 567,89</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferencias de la Aplicación */}
          <div className="lg:col-span-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">tune</span>
              Preferencias de la Aplicación
            </h4>

            <div className="space-y-4">
              <div className="setting-item">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">Modo Oscuro</h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Activa el tema oscuro para una mejor experiencia visual
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">
                    Notificaciones por Email
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Recibe actualizaciones importantes por correo electrónico
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">
                    Alertas de Inventario
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Notificaciones cuando el stock esté bajo
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">
                    Autoguardado
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Guarda automáticamente los cambios mientras trabajas
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">
                    Compactación de Datos
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Muestra más información en pantalla
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors"
              >
                Restaurar Valores por Defecto
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Seguridad */}
      {activeTab === 'seguridad' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cambiar Contraseña */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">lock</span>
              Cambiar Contraseña
            </h4>

            <form className="space-y-4">
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="password-actual"
                >
                  Contraseña Actual
                </label>
                <input
                  className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="password-actual"
                  type="password"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="password-nueva"
                >
                  Nueva Contraseña
                </label>
                <input
                  className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="password-nueva"
                  type="password"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                  htmlFor="password-confirmar"
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  className="form-input w-full rounded-lg border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  id="password-confirmar"
                  type="password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>

          {/* Autenticación de Dos Factores */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">security</span>
              Autenticación de Dos Factores
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--background-color)] rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-[var(--text-primary)]">2FA Activo</h5>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Protección adicional para tu cuenta
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium status-completed">
                  Activo
                </span>
              </div>

              <button className="w-full px-4 py-2 text-sm font-medium border border-[var(--accent-red)] text-[var(--accent-red)] rounded-lg hover:bg-[var(--accent-red)]/10 transition-colors">
                Desactivar 2FA
              </button>
            </div>
          </div>

          {/* Sesiones Activas */}
          <div className="lg:col-span-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">devices</span>
              Sesiones Activas
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--background-color)] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--text-secondary)]">
                    computer
                  </span>
                  <div>
                    <h5 className="text-sm font-medium text-[var(--text-primary)]">
                      Windows - Chrome
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Bogotá, Colombia · Hoy a las 14:30
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium status-completed">
                  Actual
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--background-color)] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--text-secondary)]">
                    phone_iphone
                  </span>
                  <div>
                    <h5 className="text-sm font-medium text-[var(--text-primary)]">
                      iPhone - Safari
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Bogotá, Colombia · Hace 2 horas
                    </p>
                  </div>
                </div>
                <button className="text-[var(--accent-red)] text-sm hover:underline">Cerrar</button>
              </div>

              <button className="w-full px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-color)]/50 transition-colors">
                Cerrar Todas las Otras Sesiones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}