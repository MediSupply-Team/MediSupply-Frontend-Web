'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/hooks/useI18n'

interface NavItem {
  href: string
  icon: string
  labelKey: string
}

const navItems: NavItem[] = [
  { href: '/', icon: 'dashboard', labelKey: 'nav.dashboard' },
  { href: '/inventario', icon: 'inventory_2', labelKey: 'nav.inventory' },
  { href: '/proveedores', icon: 'local_shipping', labelKey: 'nav.suppliers' },
  { href: '/productos', icon: 'medication', labelKey: 'nav.products' },
  { href: '/vendedores', icon: 'group', labelKey: 'nav.sellers' },
  { href: '/reportes', icon: 'bar_chart', labelKey: 'nav.reports' },
  { href: '/rutas', icon: 'route', labelKey: 'nav.routes' },
  { href: '/mi-perfil', icon: 'person', labelKey: 'nav.profile' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      <div className="flex h-full flex-col overflow-y-auto p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">
            medical_services
          </span>
          <h1 className="text-[var(--text-primary)] text-lg font-bold">{t('common.appName')}</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ms-nav"
              data-active={pathname === item.href}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <p>{t(item.labelKey)}</p>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom section - Logout */}
        <div className="border-t border-[var(--border-color)] pt-4">
          <button className="ms-nav w-full">
            <span className="material-symbols-outlined">logout</span>
            <p>{t('nav.logout')}</p>
          </button>
        </div>
      </div>
    </aside>
  )
}