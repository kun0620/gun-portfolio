import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';
import AppointmentCard from './AppointmentCard.jsx';

export default function AppointmentList({ appointments, aptFilter, setAptFilter }) {
  const { tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const isDark = theme === 'dark';

  return (
    <section className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="font-['Manrope'] text-[15px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#111111' }}>{tr.appointments}</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setAptFilter('all')}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] tracking-[0.06em] uppercase border transition-colors ${aptFilter === 'all' ? 'bg-cyan-500 text-[#003640] border-cyan-500' : 'bg-transparent text-[#888888] border-[#2A2A2A] hover:bg-[#1A1A1A]'}`}
          >
            {tr.filterAll}
          </button>
          <button
            type="button"
            onClick={() => setAptFilter('upcoming')}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] tracking-[0.06em] uppercase border transition-colors ${aptFilter === 'upcoming' ? 'bg-cyan-500 text-[#003640] border-cyan-500' : 'bg-transparent text-[#888888] border-[#2A2A2A] hover:bg-[#1A1A1A]'}`}
          >
            {tr.filterUpcoming}
          </button>
          <button
            type="button"
            onClick={() => setAptFilter('completed')}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] tracking-[0.06em] uppercase border transition-colors ${aptFilter === 'completed' ? 'bg-cyan-500 text-[#003640] border-cyan-500' : 'bg-transparent text-[#888888] border-[#2A2A2A] hover:bg-[#1A1A1A]'}`}
          >
            {tr.filterCompleted}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
        {appointments.length === 0 ? (
          <div
            className="rounded-lg border px-4 py-6 text-center text-[13px]"
            style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF', color: isDark ? '#888888' : '#5A6A6F', backgroundColor: isDark ? '#111111' : '#FFFFFF' }}
          >
            {tr.noAppointments}
          </div>
        ) : null}
      </div>
    </section>
  );
}
