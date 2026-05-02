function formatValue(value) {
  return new Intl.NumberFormat().format(value);
}

export default function KPICard({
  label,
  value,
  prefix = '',
  suffix = '',
  delta,
  trend,
  invertDelta = false,
}) {
  const isPositive = invertDelta ? delta < 0 : delta > 0;
  const deltaColor = isPositive ? 'var(--saas-success)' : 'var(--saas-danger)';
  const sign = delta > 0 ? '+' : '';

  return (
    <article className="rounded-xl border border-[var(--saas-border)] bg-[var(--saas-surface)] p-5 transition-colors duration-200 hover:border-[var(--saas-accent)]/60">
      <div className="mb-3 flex items-center justify-between text-sm text-[var(--saas-text-2)]">
        <span>{label}</span>
        <span>{trend === 'up' ? '↑' : '↓'}</span>
      </div>
      <p className="font-display text-3xl font-semibold text-[var(--saas-text-1)]">
        {prefix}
        {formatValue(value)}
        {suffix}
      </p>
      <p className="mt-3 text-sm" style={{ color: deltaColor }}>
        {sign}
        {delta.toFixed(1)}% vs last month
      </p>
    </article>
  );
}
