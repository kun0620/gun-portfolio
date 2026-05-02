export default function TopBar({
  title,
  subtitle,
  dateLabel,
  langLabel,
  themeLabel,
  backLabel,
  onToggleLang,
  onToggleTheme,
}) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-[var(--saas-text-1)]">{title}</h1>
        <p className="text-sm text-[var(--saas-text-2)]">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <a
          href="/"
          className="h-10 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-3 text-sm text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)] inline-flex items-center"
        >
          {backLabel}
        </a>
        <button
          type="button"
          onClick={onToggleLang}
          className="h-10 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-3 text-sm text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)]"
        >
          {langLabel}
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-10 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-3 text-sm text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)]"
        >
          {themeLabel}
        </button>
        <button
          type="button"
          className="h-10 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-4 text-sm text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)]"
        >
          {dateLabel} ▾
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--saas-border)] bg-[var(--saas-surface-2)] text-sm text-[var(--saas-text-2)]">
          GP
        </div>
      </div>
    </header>
  );
}
