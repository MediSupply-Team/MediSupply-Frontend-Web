'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/', icon: 'dashboard', label: 'Dashboard' },
  { href: '/inventario', icon: 'inventory_2', label: 'Inventario' },
  { href: '/proveedores', icon: 'local_shipping', label: 'Proveedores' },
  { href: '/productos', icon: 'medication', label: 'Productos' },
  { href: '/vendedores', icon: 'group', label: 'Vendedores' },
  { href: '/reportes', icon: 'bar_chart', label: 'Reportes' },
  { href: '/rutas', icon: 'route', label: 'Rutas' },
  { href: '/mi-perfil', icon: 'person', label: 'Mi Perfil' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
      <div className="flex h-full flex-col overflow-y-auto p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">
            medical_services
          </span>
          <h1 className="text-[var(--text-primary)] text-lg font-bold">MediSupply</h1>
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
              <p>{item.label}</p>
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom section - Logout */}
        <div className="border-t border-[var(--border-color)] pt-4">
          <button className="ms-nav w-full">
            <span className="material-symbols-outlined">logout</span>
            <p>Salir</p>
          </button>
        </div>
      </div>
    </aside>
  )
}