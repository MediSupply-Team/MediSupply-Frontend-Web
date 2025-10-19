interface PagePlaceholderProps {
  title: string;
  description: string;
}

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{title}</h1>
        <p className="text-[var(--text-secondary)] mt-2">{description}</p>
      </div>

      {/* Content placeholder */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-[var(--text-secondary)]">
            construction
          </span>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Página en construcción
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md">
            Esta página está siendo desarrollada. Próximamente tendrás acceso a todas las funcionalidades de {title.toLowerCase()}.
          </p>
        </div>
      </div>
    </div>
  );
}