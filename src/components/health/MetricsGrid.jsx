import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';
import { statusColor } from '../../data/mockHealth.js';

export default function MetricsGrid({ metrics }) {
  const { lang, tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const isDark = theme === 'dark';

  return (
    <section className="mb-6">
      <h2 className="font-['Manrope'] text-[15px] font-semibold mb-4" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>
        {tr.healthOverview}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-lg border p-[20px] flex flex-col transition-colors relative overflow-hidden cursor-default"
            style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF', backgroundColor: isDark ? '#111111' : '#FFFFFF' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{ color: isDark ? '#888888' : '#5F6F75' }}>{metric.icon}</span>
              <span className="text-[11px] uppercase tracking-[0.06em]" style={{ color: isDark ? '#888888' : '#5F6F75' }}>
                {lang === 'en' ? metric.label_en : metric.label_th}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="font-['Manrope'] text-[24px] leading-none font-bold" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>{metric.value}</span>
              <span className="text-[11px] mb-1" style={{ color: isDark ? '#888888' : '#5F6F75' }}>
                {lang === 'en' ? metric.unit_en : metric.unit_th}
              </span>
              <span className="text-[10px] mb-1 uppercase tracking-[0.06em]" style={{ color: statusColor[metric.status] }}>
                {tr.vitalStatus[metric.status]}
              </span>
            </div>
            <div className="w-full h-[4px] rounded-full absolute bottom-0 left-0" style={{ backgroundColor: isDark ? '#252b2d' : '#E3EAED' }}>
              <div className="h-full rounded-full" style={{ width: `${metric.barWidth}%`, backgroundColor: statusColor[metric.status] }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
