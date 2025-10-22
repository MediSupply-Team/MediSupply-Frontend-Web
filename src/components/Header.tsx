import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 border-b border-solid border-[var(--border-color)] bg-[var(--surface-color)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">MediSupply</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}