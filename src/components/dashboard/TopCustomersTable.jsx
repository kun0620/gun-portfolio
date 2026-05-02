import { useMemo, useState } from 'react';

function formatJoinedAt(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TopCustomersTable({ customers, labels }) {
  const [direction, setDirection] = useState('desc');

  const sorted = useMemo(() => {
    return [...customers].sort((a, b) => {
      const diff = a.mrr - b.mrr;
      return direction === 'asc' ? diff : -diff;
    });
  }, [customers, direction]);

  if (!customers?.length) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--saas-border)] bg-[var(--saas-surface-2)] p-6 text-sm text-[var(--saas-text-2)]">
        {labels?.empty ?? 'No customer data yet.'}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full min-w-[680px] border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-[var(--saas-text-2)]">
            <th className="px-4 py-3">{labels?.workspace ?? 'Workspace'}</th>
            <th className="px-4 py-3">{labels?.plan ?? 'Plan'}</th>
            <th className="px-4 py-3">{labels?.users ?? 'Users'}</th>
            <th className="px-4 py-3">
              <button
                type="button"
                onClick={() => setDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="inline-flex items-center gap-1 text-[var(--saas-text-2)] hover:text-[var(--saas-text-1)]"
              >
                {labels?.mrr ?? 'MRR'} <span>{direction === 'desc' ? '↓' : '↑'}</span>
              </button>
            </th>
            <th className="px-4 py-3">{labels?.joined ?? 'Joined'}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((customer) => (
            <tr
              key={customer.id}
              className="border-t border-[var(--saas-border)] text-sm text-[var(--saas-text-1)] transition-colors hover:bg-[rgba(99,102,241,0.08)]"
            >
              <td className="px-4 py-3">{customer.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs uppercase ${
                    customer.plan === 'pro'
                      ? 'border-[var(--saas-accent)]/50 bg-[rgba(99,102,241,0.14)] text-[#bcc0ff]'
                      : 'border-[var(--saas-border)] bg-[var(--saas-surface-2)] text-[var(--saas-text-2)]'
                  }`}
                >
                  {customer.plan}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--saas-text-2)]">{customer.users} {labels?.usersUnit ?? 'users'}</td>
              <td className="px-4 py-3 font-display">
                {customer.mrr > 0 ? `$${customer.mrr.toLocaleString()}` : '—'}
              </td>
              <td className="px-4 py-3 text-[var(--saas-text-2)]">{formatJoinedAt(customer.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sorted.map((customer) => (
          <article key={customer.id} className="rounded-lg border border-[var(--saas-border)] bg-[var(--saas-surface-2)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--saas-text-1)]">{customer.name}</p>
                <p className="mt-1 text-xs text-[var(--saas-text-2)]">{formatJoinedAt(customer.joinedAt)}</p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${
                  customer.plan === 'pro'
                    ? 'border-[var(--saas-accent)]/50 bg-[rgba(99,102,241,0.14)] text-[#bcc0ff]'
                    : 'border-[var(--saas-border)] bg-[var(--saas-surface)] text-[var(--saas-text-2)]'
                }`}
              >
                {customer.plan}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[var(--saas-text-2)]">{customer.users} users</span>
              <span className="font-display text-[var(--saas-text-1)]">
                {customer.mrr > 0 ? `$${customer.mrr.toLocaleString()}` : '—'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
