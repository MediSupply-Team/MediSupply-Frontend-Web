'use client';

import { useI18n } from '@/hooks/useI18n';

export default function I18nDemoPage() {
  const { 
    t, 
    locale, 
    localeName, 
    currency, 
    timezone,
    formatCurrency, 
    formatDate, 
    formatNumber,
    formatRelativeTime 
  } = useI18n();

  const sampleDate = new Date('2025-11-09T14:30:00');
  const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 horas atrás

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
          {t('common.appName')} - i18n Demo
        </h1>
        <p className="text-[var(--text-secondary)]">
          Demostración del sistema de internacionalización
        </p>
      </div>

      {/* Información del Locale Actual */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Configuración Regional Actual
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Locale</p>
            <p className="text-[var(--text-primary)] font-medium">{locale}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Nombre</p>
            <p className="text-[var(--text-primary)] font-medium">{localeName}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Moneda</p>
            <p className="text-[var(--text-primary)] font-medium">{currency}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Zona Horaria</p>
            <p className="text-[var(--text-primary)] font-medium">{timezone}</p>
          </div>
        </div>
      </div>

      {/* Traducciones */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Traducciones
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)] text-sm">common.save</span>
            <span className="text-[var(--text-primary)] font-medium">{t('common.save')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)] text-sm">common.cancel</span>
            <span className="text-[var(--text-primary)] font-medium">{t('common.cancel')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)] text-sm">products.title</span>
            <span className="text-[var(--text-primary)] font-medium">{t('products.title')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)] text-sm">inventory.warehouse</span>
            <span className="text-[var(--text-primary)] font-medium">{t('inventory.warehouse')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] text-sm">regionalTerms.cellphone</span>
            <span className="text-[var(--text-primary)] font-medium">{t('regionalTerms.cellphone')}</span>
          </div>
        </div>
      </div>

      {/* Formato de Moneda */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Formato de Moneda
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">1234567.89</span>
            <span className="text-[var(--text-primary)] font-medium">{formatCurrency(1234567.89)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">999.99</span>
            <span className="text-[var(--text-primary)] font-medium">{formatCurrency(999.99)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">50000</span>
            <span className="text-[var(--text-primary)] font-medium">{formatCurrency(50000)}</span>
          </div>
        </div>
      </div>

      {/* Formato de Fecha */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Formato de Fecha
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Fecha Completa</p>
            <p className="text-[var(--text-primary)] font-medium">
              {formatDate(sampleDate, { dateStyle: 'full' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Fecha y Hora</p>
            <p className="text-[var(--text-primary)] font-medium">
              {formatDate(sampleDate, { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Fecha Corta</p>
            <p className="text-[var(--text-primary)] font-medium">
              {formatDate(sampleDate, { dateStyle: 'short' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Tiempo Relativo</p>
            <p className="text-[var(--text-primary)] font-medium">
              {formatRelativeTime(pastDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Formato de Números */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Formato de Números
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">1234567.89</span>
            <span className="text-[var(--text-primary)] font-medium">{formatNumber(1234567.89)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">0.5 (Porcentaje)</span>
            <span className="text-[var(--text-primary)] font-medium">
              {formatNumber(0.5, { style: 'percent' })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">1000 (2 decimales)</span>
            <span className="text-[var(--text-primary)] font-medium">
              {formatNumber(1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Términos Regionales */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Términos Regionales
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Palabras que varían según la región seleccionada:
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">Teléfono móvil</span>
            <span className="text-[var(--text-primary)] font-medium">{t('regionalTerms.cellphone')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--text-secondary)]">Vehículo de carga</span>
            <span className="text-[var(--text-primary)] font-medium">{t('regionalTerms.truck')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">PC</span>
            <span className="text-[var(--text-primary)] font-medium">{t('regionalTerms.computer')}</span>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Instrucciones
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Usa el selector de idioma en el header (ícono de globo) para cambiar entre diferentes 
          regiones y ver cómo se adaptan automáticamente los formatos de moneda, fecha, números 
          y traducciones.
        </p>
      </div>
    </div>
  );
}
