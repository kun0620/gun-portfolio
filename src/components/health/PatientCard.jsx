import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';

export default function PatientCard({ patient }) {
  const { lang, tr } = useHealthLang();
  const { theme } = useHealthTheme();
  const tags = lang === 'en' ? patient.tags_en : patient.tags_th;
  const isDark = theme === 'dark';

  return (
    <div
      className="rounded-lg border p-5 cursor-default"
      style={{
        borderColor: isDark ? '#2A2A2A' : '#D8DDDF',
        background: isDark ? 'linear-gradient(135deg, #0A1A1E 0%, #111111 100%)' : 'linear-gradient(135deg, #F5FBFC 0%, #FFFFFF 100%)',
        borderTopColor: '#06B6D4',
        borderTopWidth: 2,
      }}
    >
      <div className="flex items-center gap-4 mb-4 min-w-0">
        <div
          className="w-14 h-14 rounded-full border-2 border-cyan-500 grid place-items-center text-cyan-500 font-['Manrope'] font-bold text-[20px]"
          style={{ backgroundColor: isDark ? '#1A1A1A' : '#ECF4F5' }}
        >
          {patient.initials}
        </div>
        <div className="min-w-0">
          <h1 className="font-['Manrope'] text-[17px] font-bold break-words" style={{ color: isDark ? '#F0F0F0' : '#0D1B1F' }}>
            {lang === 'en' ? patient.name_en : patient.name_th}
          </h1>
          <p className="text-[12px]" style={{ color: isDark ? '#888888' : '#5A6A6F' }}>
            {lang === 'en' ? patient.dob_en : patient.dob_th} · {tr.age(patient.age)}
          </p>
          <p className="text-[11px] mt-1" style={{ color: isDark ? '#5D7074' : '#657A80' }}>
            {tr.patientId}: {patient.patientId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t pt-3 mb-3" style={{ borderColor: isDark ? '#2A2A2A' : '#D8DDDF' }}>
        <div className="text-center rounded p-2" style={{ backgroundColor: isDark ? '#252b2d' : '#EAF0F2' }}>
          <p className="text-[10px] uppercase tracking-[0.06em] mb-1" style={{ color: isDark ? '#888888' : '#5E7076' }}>
            {tr.blood}
          </p>
          <p className="text-[14px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#122027' }}>{patient.bloodType}</p>
        </div>
        <div className="text-center rounded p-2" style={{ backgroundColor: isDark ? '#252b2d' : '#EAF0F2' }}>
          <p className="text-[10px] uppercase tracking-[0.06em] mb-1" style={{ color: isDark ? '#888888' : '#5E7076' }}>
            {tr.height}
          </p>
          <p className="text-[14px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#122027' }}>{patient.height}</p>
        </div>
        <div className="text-center rounded p-2" style={{ backgroundColor: isDark ? '#252b2d' : '#EAF0F2' }}>
          <p className="text-[10px] uppercase tracking-[0.06em] mb-1" style={{ color: isDark ? '#888888' : '#5E7076' }}>
            {tr.weight}
          </p>
          <p className="text-[14px] font-semibold" style={{ color: isDark ? '#F0F0F0' : '#122027' }}>{patient.weight}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[11px]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
