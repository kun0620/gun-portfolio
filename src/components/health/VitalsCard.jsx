import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';
import { statusColor } from '../../data/mockHealth.js';

export default function VitalsCard({ vitals }) {
  const { lang, tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="rounded-lg border p-5 cursor-default"
      style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF', backgroundColor: isDark ? '#111111' : '#FFFFFF' }}
    >
      <h2 className="font-['Manrope'] text-[15px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>{tr.currentVitals}</h2>
      <p className="text-[11px] mt-1" style={{ color: isDark ? '#888888' : '#5A6A6F' }}>{tr.lastChecked}</p>
      <div className="mt-4 space-y-[10px]">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="flex items-center justify-between rounded px-1.5 py-1 cursor-default"
            style={{ backgroundColor: isDark ? 'transparent' : '#F8FAFB' }}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]" style={{ color: isDark ? '#888888' : '#617378' }}>{vital.icon}</span>
              <span className="text-[13px]" style={{ color: isDark ? '#BCC9CD' : '#25383D' }}>{lang === 'en' ? vital.label_en : vital.label_th}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>
                {vital.value} {lang === 'en' ? vital.unit_en : vital.unit_th}
              </span>
              <span className="text-[10px] uppercase tracking-[0.06em]" style={{ color: statusColor[vital.status] }}>
                {tr.vitalStatus[vital.status]}
              </span>
              <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: statusColor[vital.status] }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
