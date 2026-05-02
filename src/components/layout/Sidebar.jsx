import { BarChart2, Grid3X3, Settings, TrendingUp, Users } from 'lucide-react';
import { navItems } from '../../data/mockData.js';

const iconMap = {
  grid: Grid3X3,
  'trending-up': TrendingUp,
  users: Users,
  'bar-chart-2': BarChart2,
  settings: Settings,
};

export default function Sidebar({ activeId, onNavigate, navLabels, logoLabel = '◈ Metrically' }) {
  const topItems = navItems.filter((item) => item.id !== 'settings');
  const bottomItems = navItems.filter((item) => item.id === 'settings');

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-[var(--saas-border)] bg-[var(--saas-surface)] p-4 md:flex md:flex-col">
      <div className="mb-5 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-3 py-2 font-display text-sm tracking-wide text-[var(--saas-text-1)]">{logoLabel}</div>
      <nav className="flex flex-col gap-1">
        {topItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Grid3X3;
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                active
                  ? 'border-[var(--saas-accent)]/40 bg-[color:rgba(99,102,241,0.18)] text-[var(--saas-text-1)]'
                  : 'border-transparent text-[var(--saas-text-2)] hover:border-[var(--saas-border)] hover:text-[var(--saas-text-1)]'
              }`}
            >
              <Icon size={16} />
              <span>{navLabels?.[item.id] ?? item.label}</span>
            </button>
          );
        })}
      </nav>
      <nav className="mt-auto flex flex-col gap-1 border-t border-[var(--saas-border)] pt-3">
        {bottomItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Settings;
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                active
                  ? 'border-[var(--saas-accent)]/40 bg-[color:rgba(99,102,241,0.18)] text-[var(--saas-text-1)]'
                  : 'border-transparent text-[var(--saas-text-2)] hover:border-[var(--saas-border)] hover:text-[var(--saas-text-1)]'
              }`}
            >
              <Icon size={16} />
              <span>{navLabels?.[item.id] ?? item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
