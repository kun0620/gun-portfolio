export const kpiData = {
  mrr: { value: 8420, delta: 12.4, trend: 'up' },
  activeUsers: { value: 1243, delta: 8.1, trend: 'up' },
  churnRate: { value: 2.4, delta: 0.3, trend: 'down' },
  newSignups: { value: 184, delta: 22.0, trend: 'up' },
};

export const revenueChartData = [
  { date: 'Apr 1', mrr: 6800 },
  { date: 'Apr 3', mrr: 7050 },
  { date: 'Apr 5', mrr: 7100 },
  { date: 'Apr 8', mrr: 7300 },
  { date: 'Apr 10', mrr: 7250 },
  { date: 'Apr 13', mrr: 7600 },
  { date: 'Apr 15', mrr: 7800 },
  { date: 'Apr 18', mrr: 7750 },
  { date: 'Apr 20', mrr: 8000 },
  { date: 'Apr 22', mrr: 8150 },
  { date: 'Apr 25', mrr: 8300 },
  { date: 'Apr 27', mrr: 8250 },
  { date: 'Apr 29', mrr: 8420 },
];

export const topCustomers = [
  { id: 1, name: 'Acme Corp', plan: 'pro', mrr: 490, users: 24, joinedAt: '2024-01-15' },
  { id: 2, name: 'Globex Ltd', plan: 'pro', mrr: 490, users: 18, joinedAt: '2024-02-03' },
  { id: 3, name: 'Initech', plan: 'pro', mrr: 490, users: 31, joinedAt: '2024-02-20' },
  { id: 4, name: 'Umbrella Inc', plan: 'pro', mrr: 490, users: 12, joinedAt: '2024-03-01' },
  { id: 5, name: 'Stark Labs', plan: 'free', mrr: 0, users: 3, joinedAt: '2024-03-14' },
  { id: 6, name: 'Wayne Ent.', plan: 'free', mrr: 0, users: 2, joinedAt: '2024-04-02' },
];

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'revenue', label: 'Revenue', icon: 'trending-up' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart-2' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
