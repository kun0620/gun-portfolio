import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';
import { aptStatusStyle } from '../../data/mockHealth.js';

export default function AppointmentCard({ appointment }) {
  const { lang, tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const isDark = theme === 'dark';
  const badge = aptStatusStyle[appointment.status];

  return (
    <div
      className="rounded-lg border p-4 transition-colors cursor-default"
      style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF', backgroundColor: isDark ? '#111111' : '#FFFFFF' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)_140px] items-start md:items-center gap-3 md:gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-center w-12 border-r pr-3 shrink-0" style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF' }}>
          <span className="block text-[10px] uppercase" style={{ color: isDark ? '#888888' : '#5A6A6F' }}>
            {lang === 'en' ? appointment.month_en : appointment.month_th}
          </span>
          <span className="block text-[20px] font-bold leading-5" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>{appointment.day}</span>
        </div>
        <span className="text-[12px] whitespace-nowrap" style={{ color: isDark ? '#BCC9CD' : '#2A3A3F' }}>
          {lang === 'en' ? appointment.time_en : appointment.time_th}
        </span>
      </div>

      <div className="px-0 md:px-3 md:border-r min-w-0" style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF' }}>
        <span className="block text-[14px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>
          {lang === 'en' ? appointment.doctor_en : appointment.doctor_th}
        </span>
        <span className="block text-[12px]" style={{ color: isDark ? '#888888' : '#5A6A6F' }}>
          {lang === 'en' ? appointment.specialty_en : appointment.specialty_th}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: isDark ? '#444444' : '#6A7C82' }}>
          <span className="material-symbols-outlined text-[12px]">location_on</span>
          {lang === 'en' ? appointment.location_en : appointment.location_th}
        </span>
      </div>

      <div className="md:text-right">
        <span
          className="inline-flex items-center px-2 py-1 rounded-full border text-[10px] tracking-[0.06em] uppercase"
          style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.color }}
        >
          {tr.status[appointment.status]}
        </span>
      </div>
      </div>
    </div>
  );
}
