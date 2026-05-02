import { useMemo, useState } from 'react';
import HealthNavbar from '../components/health/Navbar.jsx';
import PatientCard from '../components/health/PatientCard.jsx';
import VitalsCard from '../components/health/VitalsCard.jsx';
import AppointmentList from '../components/health/AppointmentList.jsx';
import MetricsGrid from '../components/health/MetricsGrid.jsx';
import { appointments, metrics, patient, vitals } from '../data/mockHealth.js';
import { HealthThemeProvider, useHealthTheme } from '../context/healthThemeContext.jsx';
import { HealthLangProvider, useHealthLang } from '../context/healthLangContext.jsx';

function HealthShell() {
  const { theme } = useHealthTheme();
  const [aptFilter, setAptFilter] = useState('all');

  const filteredApts = useMemo(() => {
    return appointments.filter((apt) => {
      if (aptFilter === 'all') return true;
      if (aptFilter === 'upcoming') return apt.status === 'upcoming';
      if (aptFilter === 'completed') return apt.status === 'completed';
      return true;
    });
  }, [aptFilter]);

  const isDark = theme === 'dark';

  return (
    <div
      className="min-h-screen font-['Public_Sans']"
      style={{
        backgroundColor: isDark ? '#0E1416' : '#F5F5F3',
        color: isDark ? '#DEE3E6' : '#111111',
      }}
    >
      <HealthNavbar />
      <div className="pt-14 flex min-h-screen">
        <aside
          className="hidden lg:flex fixed left-0 top-14 w-80 h-[calc(100vh-56px)] border-r p-4 overflow-y-auto flex-col gap-3"
          style={{ backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF', borderColor: isDark ? '#2A2A2A' : '#E0E0DC' }}
        >
          <PatientCard patient={patient} />
          <VitalsCard vitals={vitals} />
          <div
            className="mt-3 rounded-lg border overflow-hidden"
            style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF', backgroundColor: isDark ? '#0B0F12' : '#F9FBFC' }}
          >
            <HealthSideMenu />
          </div>
        </aside>

        <main className="lg:ml-80 flex-1 p-4 md:p-8 w-full">
          <div className="lg:hidden flex flex-col gap-4 mb-6">
            <PatientCard patient={patient} />
            <VitalsCard vitals={vitals} />
          </div>
          <MetricsGrid metrics={metrics} />
          <AppointmentList appointments={filteredApts} aptFilter={aptFilter} setAptFilter={setAptFilter} />
        </main>
      </div>
    </div>
  );
}

function HealthSideMenu() {
  const { tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const isDark = theme === 'dark';
  const items = [
    { key: 'overview', icon: 'grid_view', active: true },
    { key: 'vitalsHistory', icon: 'monitor_heart', active: false },
    { key: 'labResults', icon: 'biotech', active: false },
    { key: 'appointments', icon: 'calendar_month', active: false },
    { key: 'medications', icon: 'pill', active: false },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-1">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className="flex items-center gap-3 px-4 py-3 text-left text-[16px]"
            style={{
              color: item.active ? '#22D3EE' : isDark ? '#7C8B94' : '#5C6F77',
              backgroundColor: item.active ? 'rgba(34,211,238,0.12)' : 'transparent',
            }}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            {tr[item.key]}
          </button>
        ))}
      </div>
      <div className="p-4 pt-2">
        <button
          type="button"
          className="w-full rounded-md px-4 py-3 text-[16px] font-medium"
          style={{ backgroundColor: isDark ? '#242C33' : '#E7EEF2', color: isDark ? '#FFB4A9' : '#A64535' }}
        >
          {tr.emergencyContact}
        </button>
      </div>
    </div>
  );
}

export default function HealthPage() {
  return (
    <HealthThemeProvider>
      <HealthLangProvider>
        <HealthShell />
      </HealthLangProvider>
    </HealthThemeProvider>
  );
}
