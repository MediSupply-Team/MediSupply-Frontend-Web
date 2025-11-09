'use client';

import { useState, useTransition } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { Locale, localeNames } from '@/i18n/config';

export default function LocaleSelector() {
  const { locale, t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const changeLocale = (newLocale: Locale) => {
    startTransition(() => {
      // Guardar en cookie
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 año
      
      // Recargar la página para aplicar el nuevo locale
      window.location.reload();
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)]/50 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">language</span>
        <span>{localeNames[locale as Locale]}</span>
        <span className="material-symbols-outlined text-lg">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-64 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-medium text-[var(--text-secondary)] px-3 py-2">
                {t('profile.settings.language.interface')}
              </p>
              
              {/* Grupo Español */}
              <div className="mb-2">
                <p className="text-xs font-semibold text-[var(--text-secondary)] px-3 py-1">
                  Español
                </p>
                {(['es-CO', 'es-MX', 'es-AR', 'es-PE', 'es-CL'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      changeLocale(loc);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      locale === loc
                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium'
                        : 'text-[var(--text-primary)] hover:bg-[var(--border-color)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{localeNames[loc]}</span>
                      {locale === loc && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Grupo English */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] px-3 py-1">
                  English
                </p>
                {(['en-US', 'en-GB'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      changeLocale(loc);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      locale === loc
                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-medium'
                        : 'text-[var(--text-primary)] hover:bg-[var(--border-color)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{localeNames[loc]}</span>
                      {locale === loc && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
