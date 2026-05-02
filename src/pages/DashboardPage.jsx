import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGlobalLangState, useGlobalThemeState } from '../context/globalTweak.js';

const copy = {
  en: {
    brand: 'Metrically',
    title: 'Overview',
    subtitle: 'Last updated 2 minutes ago',
    back: 'Back',
    lang: 'TH',
    theme: 'Light',
    period: 'Last 30 days',
    sortByMrr: 'Sort by MRR',
    vsLastMonth: 'vs last month',
    nav: {
      dashboard: 'Dashboard',
      revenue: 'Revenue',
      users: 'Users',
      reports: 'Reports',
      settings: 'Settings',
    },
    chart: 'MRR Growth',
    table: 'Top Customers',
    tableHead: ['WORKSPACE', 'PLAN', 'USERS', 'MRR'],
  },
  th: {
    brand: 'เมตริคลี',
    title: 'ภาพรวม',
    subtitle: 'อัปเดตล่าสุด 2 นาทีที่ผ่านมา',
    back: 'กลับ',
    lang: 'EN',
    theme: 'ธีม',
    period: '30 วันที่ผ่านมา',
    sortByMrr: 'เรียงตาม MRR',
    vsLastMonth: 'vs เดือนที่แล้ว',
    nav: {
      dashboard: 'แดชบอร์ด',
      revenue: 'รายได้',
      users: 'ผู้ใช้งาน',
      reports: 'รายงาน',
      settings: 'ตั้งค่า',
    },
    chart: 'แนวโน้ม MRR',
    table: 'ลูกค้าหลัก',
    tableHead: ['พื้นที่ทำงาน', 'แผน', 'ผู้ใช้', 'MRR'],
  },
};

const kpiData = [
  { id: 'mrr', label: 'MRR', value: 8420, prefix: '$', suffix: '', delta: 12.4, invertDelta: false },
  { id: 'users', label: 'ACTIVE USERS', value: 1243, prefix: '', suffix: '', delta: 8.1, invertDelta: false },
  { id: 'churn', label: 'CHURN RATE', value: 2.4, prefix: '', suffix: '%', delta: 0.3, invertDelta: true },
  { id: 'signups', label: 'NEW SIGNUPS', value: 184, prefix: '', suffix: '', delta: 22.0, invertDelta: false },
];

const rawPeriodData = {
  '7d': [
    { label: 'Apr 21', mrr: 8000 },
    { label: 'Apr 24', mrr: 8200 },
    { label: 'Apr 27', mrr: 8300 },
    { label: 'Apr 29', mrr: 8420 },
  ],
  '30d': [
    { label: 'Apr 1', mrr: 6800 },
    { label: 'Apr 5', mrr: 7100 },
    { label: 'Apr 8', mrr: 7300 },
    { label: 'Apr 12', mrr: 7550 },
    { label: 'Apr 15', mrr: 7800 },
    { label: 'Apr 18', mrr: 7750 },
    { label: 'Apr 21', mrr: 8000 },
    { label: 'Apr 24', mrr: 8200 },
    { label: 'Apr 27', mrr: 8300 },
    { label: 'Apr 29', mrr: 8420 },
  ],
  '90d': [
    { label: 'Feb 1', mrr: 4200 },
    { label: 'Feb 15', mrr: 5100 },
    { label: 'Mar 1', mrr: 5900 },
    { label: 'Mar 15', mrr: 6400 },
    { label: 'Apr 1', mrr: 6800 },
    { label: 'Apr 15', mrr: 7800 },
    { label: 'Apr 29', mrr: 8420 },
  ],
};

const customerRows = [
  { id: 1, name: 'Acme Corp', plan: 'pro', users: 24, mrr: 490 },
  { id: 2, name: 'Globex Ltd', plan: 'pro', users: 18, mrr: 490 },
  { id: 3, name: 'Initech', plan: 'pro', users: 31, mrr: 490 },
  { id: 4, name: 'Umbrella Inc', plan: 'pro', users: 12, mrr: 490 },
  { id: 5, name: 'Stark Labs', plan: 'free', users: 3, mrr: 0 },
  { id: 6, name: 'Wayne Ent.', plan: 'free', users: 2, mrr: 0 },
];

function toChartData(points) {
  return points.map((point, index) => ({
    ...point,
    x: index,
  }));
}

function buildInterpolatedData(points, stepsPerSegment = 24) {
  const base = toChartData(points);
  if (base.length < 2) return base;
  const result = [];

  for (let i = 0; i < base.length - 1; i += 1) {
    const left = base[i];
    const right = base[i + 1];
    const delta = right.mrr - left.mrr;

    for (let step = 0; step < stepsPerSegment; step += 1) {
      const ratio = step / stepsPerSegment;
      const x = i + ratio;
      result.push({
        x,
        mrr: left.mrr + delta * ratio,
        label: ratio < 0.5 ? left.label : right.label,
      });
    }
  }

  const last = base[base.length - 1];
  result.push({ x: last.x, mrr: last.mrr, label: last.label });
  return result;
}

function formatCurrency(value) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `$${value}`;
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  const value = data?.mrr ?? 0;
  const label = data?.label ?? '';
  return (
    <div className="rounded border border-[var(--saas-border)] bg-[var(--saas-elevated)] px-2 py-1 text-center shadow-[0_8px_24px_rgba(0,0,0,.25)]">
      <p className="font-mono text-sm text-[var(--saas-text-1)]">{formatCurrency(value)}</p>
      <p className="text-[11px] text-[var(--saas-text-2)]">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { lang, toggleLang } = useGlobalLangState();
  const { theme, toggleTheme } = useGlobalThemeState();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sortOrder, setSortOrder] = useState('desc');
  const [period, setPeriod] = useState('30d');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pinnedIndex, setPinnedIndex] = useState(null);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isChartReady, setIsChartReady] = useState(false);
  const t = copy[lang];
  const sourceData = useMemo(() => toChartData(rawPeriodData[period]), [period]);
  const periodData = useMemo(() => buildInterpolatedData(rawPeriodData[period]), [period]);
  const tickMap = useMemo(
    () => Object.fromEntries(sourceData.map((item) => [item.x, item.label])),
    [sourceData]
  );
  const lastIndex = periodData.length - 1;

  const clampIndex = useCallback(
    (index) => Math.max(0, Math.min(lastIndex, index)),
    [lastIndex]
  );

  const activeIndex = useMemo(() => {
    if (typeof pinnedIndex === 'number') return clampIndex(pinnedIndex);
    if (isPointerInside && typeof hoveredIndex === 'number') return clampIndex(hoveredIndex);
    return lastIndex;
  }, [pinnedIndex, hoveredIndex, isPointerInside, clampIndex, lastIndex]);

  const activePoint = periodData[activeIndex] ?? periodData[lastIndex] ?? null;
  const sortedCustomers = useMemo(
    () =>
      [...customerRows].sort((a, b) =>
        sortOrder === 'desc' ? b.mrr - a.mrr : a.mrr - b.mrr
      ),
    [sortOrder]
  );

  useEffect(() => {
    setHoveredIndex(null);
    setPinnedIndex(null);
    setIsPointerInside(false);
  }, [period]);

  const handleMove = useCallback(
    (state) => {
      if (typeof state?.activeTooltipIndex !== 'number') return;
      setIsPointerInside(true);
      setHoveredIndex(clampIndex(state.activeTooltipIndex));
    },
    [clampIndex]
  );

  const handleLeave = useCallback(() => {
    setIsPointerInside(false);
    setHoveredIndex(null);
  }, []);

  const handleClick = useCallback(
    (state) => {
      const nextIndex =
        typeof state?.activeTooltipIndex === 'number'
          ? clampIndex(state.activeTooltipIndex)
          : isPointerInside && typeof hoveredIndex === 'number'
            ? clampIndex(hoveredIndex)
            : null;
      if (nextIndex == null) {
        setPinnedIndex(null);
        return;
      }
      setPinnedIndex((prev) => (prev === nextIndex ? null : nextIndex));
    },
    [clampIndex, hoveredIndex, isPointerInside]
  );

  const handleChartKeyDown = useCallback(
    (event) => {
      if (!periodData.length) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setPinnedIndex((prev) => clampIndex((prev ?? activeIndex) + 1));
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setPinnedIndex((prev) => clampIndex((prev ?? activeIndex) - 1));
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        setPinnedIndex((prev) => (prev == null ? activeIndex : null));
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setPinnedIndex(null);
      }
    },
    [activeIndex, clampIndex, periodData.length]
  );

  return (
    <div data-theme={theme} className="saas-demo-root min-h-screen bg-[var(--saas-bg)] text-[var(--saas-text-1)]">
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[var(--saas-border)] bg-[var(--saas-nav)]/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-6">
          <p className="font-mono text-xl font-bold tracking-tight">
            <span className="mr-2 text-[var(--saas-accent)]">◈</span>
            {t.brand}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLang}
              className="p-1 text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)]"
              aria-label="Toggle language"
            >
              <span className="material-symbols-outlined">language</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 text-[var(--saas-text-2)] transition-colors hover:text-[var(--saas-text-1)]"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <a
              href="/"
              className="rounded border border-[var(--saas-border)] px-2.5 py-1 text-xs text-[var(--saas-text-2)] transition-colors hover:border-[var(--saas-accent)] hover:text-[var(--saas-text-1)]"
            >
              {t.back}
            </a>
          </div>
        </div>
      </header>

      <aside className="fixed left-0 top-0 hidden h-full w-[220px] border-r border-[var(--saas-border)] bg-[var(--saas-surface)] pt-14 md:flex md:flex-col">
        <nav className="mt-6 flex-1 space-y-1 px-2">
          {Object.entries(t.nav)
            .slice(0, 4)
            .map(([key, item], idx) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveNav(key)}
              className={`flex w-full items-center gap-3 border-l-2 px-3 py-2 text-left text-[15px] ${
                activeNav === key
                  ? 'border-[var(--saas-accent)] bg-[var(--saas-elevated)] text-[var(--saas-text-1)]'
                  : 'border-transparent text-[var(--saas-text-2)] transition-colors hover:bg-[var(--saas-elevated)] hover:text-[var(--saas-text-1)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {idx === 0 ? 'dashboard' : idx === 1 ? 'payments' : idx === 2 ? 'group' : 'analytics'}
              </span>
              {item}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setActiveNav('settings')}
          className={`mx-2 mb-4 flex items-center gap-3 border-l-2 px-3 py-2 text-left text-[15px] transition-colors ${
            activeNav === 'settings'
              ? 'border-[var(--saas-accent)] bg-[var(--saas-elevated)] text-[var(--saas-text-1)]'
              : 'border-transparent text-[var(--saas-text-2)] hover:bg-[var(--saas-elevated)] hover:text-[var(--saas-text-1)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          {t.nav.settings}
        </button>
      </aside>

      <main className="min-h-screen px-4 pb-6 pt-20 md:ml-[220px] md:px-8 md:pb-8">
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-mono text-[32px] font-semibold">{t.title}</h1>
            <p className="text-sm text-[var(--saas-text-2)]">{t.subtitle}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded border border-[var(--saas-border)] bg-[var(--saas-surface)] px-3 py-1.5 text-[13px] text-[var(--saas-text-2)] transition-colors hover:border-[var(--saas-text-2)] hover:text-[var(--saas-text-1)]"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {t.period}
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiData.map((kpi) => {
            const formatted = new Intl.NumberFormat().format(kpi.value);
            const isGood = kpi.invertDelta ? kpi.delta < 0 : kpi.delta > 0;
            const sign = kpi.delta > 0 ? '+' : '';
            const deltaText = `${isGood ? '↑' : '↓'} ${sign}${kpi.delta.toFixed(1)}%`;
            return (
            <article
              key={kpi.id}
              className="rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface)] p-4 transition-all duration-200 hover:border-[var(--saas-accent)] hover:shadow-[0_0_15px_rgba(99,102,241,0.12)]"
            >
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--saas-text-2)]">{kpi.label}</p>
              <p className="mt-2 font-mono text-[46px] font-bold leading-none">
                {kpi.prefix}{formatted}{kpi.suffix}
              </p>
              <div className={`mt-2 text-sm ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span>{deltaText}</span>
                <span className="ml-2 text-[11px] text-[var(--saas-text-2)]">{t.vsLastMonth}</span>
              </div>
            </article>
          )})}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="min-w-0 rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface)] p-5 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold">{t.chart}</h2>
              <div className="flex overflow-hidden rounded border border-[var(--saas-border)] text-[11px]">
                {[
                  ['7d', '7D'],
                  ['30d', '30D'],
                  ['90d', '90D'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPeriod(key)}
                    className={`px-3 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--saas-accent)] ${
                      period === key
                        ? 'bg-[var(--saas-elevated)] text-[var(--saas-text-1)]'
                        : 'text-[var(--saas-text-2)] hover:text-[var(--saas-text-1)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="h-[250px] w-full min-w-0 outline-none"
              role="application"
              aria-label="MRR chart interactive region"
              tabIndex={0}
              onKeyDown={handleChartKeyDown}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={250}
                debounce={60}
                onResize={(nextWidth, nextHeight) => {
                  setIsChartReady(nextWidth > 0 && nextHeight > 0);
                }}
              >
                {isChartReady ? (
                <AreaChart
                  data={periodData}
                  margin={{ top: 8, right: 8, left: -18, bottom: 18 }}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                  onClick={handleClick}
                >
                  {activePoint ? (
                    <>
                      <ReferenceLine
                        x={activePoint.x}
                        stroke={typeof pinnedIndex === 'number' ? '#c0c1ff' : '#8083ff66'}
                        strokeOpacity={typeof pinnedIndex === 'number' ? 0.8 : 0.55}
                        strokeWidth={1}
                      />
                      <ReferenceDot
                        x={activePoint.x}
                        y={activePoint.mrr}
                        r={typeof pinnedIndex === 'number' ? 5 : 4}
                        fill="var(--saas-bg)"
                        stroke={typeof pinnedIndex === 'number' ? '#c0c1ff' : '#8083ff'}
                        strokeWidth={2}
                      />
                    </>
                  ) : null}
                  <defs>
                    <linearGradient id="saasChartGradientLive" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#8083ff" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8083ff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--saas-border)" strokeOpacity={0.35} vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[sourceData[0]?.x ?? 0, sourceData[sourceData.length - 1]?.x ?? 0]}
                    ticks={sourceData.map((item) => item.x)}
                    tickFormatter={(value) => tickMap[value] ?? ''}
                    tick={{ fill: 'var(--saas-text-3)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    width={44}
                    tick={{ fill: 'var(--saas-text-3)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: '#8083ff66', strokeWidth: 1 }}
                    isAnimationActive={false}
                    animationDuration={0}
                    active={Boolean(activePoint)}
                    payload={activePoint ? [{ name: 'mrr', value: activePoint.mrr, payload: activePoint }] : []}
                  />
                  <Area
                    type="monotone"
                    dataKey="mrr"
                    stroke="#8083ff"
                    strokeWidth={2}
                    fill="url(#saasChartGradientLive)"
                    activeDot={{ r: 4, fill: 'var(--saas-bg)', stroke: '#8083ff', strokeWidth: 2 }}
                    dot={false}
                  />
                </AreaChart>
                ) : (
                  <div className="h-full w-full" />
                )}
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold">{t.table}</h2>
              <button
                type="button"
                className="text-[11px] uppercase tracking-[0.08em] text-[var(--saas-text-2)] hover:text-[var(--saas-text-1)]"
                onClick={() => setSortOrder((v) => (v === 'desc' ? 'asc' : 'desc'))}
              >
                {t.sortByMrr} {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--saas-border)]/50">
                    <th className="pb-2 text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--saas-text-2)]">{t.tableHead[0]}</th>
                    <th className="pb-2 text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--saas-text-2)]">{t.tableHead[1]}</th>
                    <th className="pb-2 text-right text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--saas-text-2)]">{t.tableHead[2]}</th>
                    <th
                      className="cursor-pointer pb-2 text-right text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--saas-text-2)]"
                      onClick={() => setSortOrder((v) => (v === 'desc' ? 'asc' : 'desc'))}
                    >
                      {t.tableHead[3]} {sortOrder === 'desc' ? '↓' : '↑'}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[15px]">
                  {sortedCustomers.map((row) => (
                    <tr key={row.id} className="border-b border-[var(--saas-border)]/20 transition-colors hover:bg-[var(--saas-elevated)]">
                      <td className="px-2 py-3">{row.name}</td>
                      <td className="py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${
                          row.plan === 'free'
                            ? 'border-[var(--saas-text-3)]/40 text-[var(--saas-text-2)]'
                            : 'border-[#8083ff]/30 text-[#aeb2ff]'
                        }`}>
                          {row.plan}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right font-mono text-sm">{row.users}</td>
                      <td className="px-2 py-3 text-right font-mono text-sm">{row.mrr > 0 ? `$${row.mrr.toLocaleString()}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
