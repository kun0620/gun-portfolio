import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] px-3 py-2 shadow-lg">
      <p className="text-xs text-[var(--saas-text-2)]">{label}</p>
      <p className="font-display text-base text-[var(--saas-text-1)]">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }) {
  if (!data?.length) {
    return (
      <div className="grid h-[280px] w-full place-items-center rounded-lg border border-dashed border-[var(--saas-border)] bg-[var(--saas-surface-2)] text-sm text-[var(--saas-text-2)]">
        No revenue data.
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full" aria-label="Revenue trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--saas-text-3)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--saas-text-3)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.35)' }} />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#6366F1"
            strokeWidth={2}
            fill="url(#mrrGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
