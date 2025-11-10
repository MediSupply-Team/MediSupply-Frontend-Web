'use client';

import ThemeToggle from './ThemeToggle';
import LocaleSelector from './LocaleSelector';
import { useI18n } from '@/hooks/useI18n';

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="w-full sticky top-0 z-50 border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('common.appName')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}