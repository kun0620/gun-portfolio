import { useNavigate } from 'react-router-dom';
import { useHealthLang } from '../../context/healthLangContext.jsx';
import { useHealthTheme } from '../../context/healthThemeContext.jsx';

export default function HealthNavbar() {
  const navigate = useNavigate();
  const { tr, toggleLang } = useHealthLang();
  const { toggleTheme } = useHealthTheme();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#2A2A2A] flex items-center justify-between px-6 h-14">
      <div className="flex items-center gap-6">
        <div className="text-[18px] font-bold tracking-tight text-cyan-500 font-['Manrope']">◈ {tr.brand}</div>
        <div className="hidden lg:flex gap-6 font-['Manrope'] text-[13px]">
          <span className="text-cyan-400 border-b-2 border-cyan-400 pb-1">{tr.dashboard}</span>
          <span className="text-zinc-400">{tr.healthRecords}</span>
          <span className="text-zinc-400">{tr.messages}</span>
          <span className="text-zinc-400">{tr.pharmacy}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-cyan-500">
        <button type="button" onClick={() => navigate('/')} aria-label={tr.backToHome} className="hover:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button type="button" onClick={toggleLang} aria-label="Toggle language" className="hover:text-white">
          <span className="material-symbols-outlined">language</span>
        </button>
        <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="hover:text-white">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        <button type="button" aria-label="Notifications" className="hover:text-white">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button type="button" aria-label="Settings" className="hover:text-white">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-9 h-9 rounded-full border border-[#2A2A2A] bg-[#111111] grid place-items-center overflow-hidden">
          <span className="material-symbols-outlined text-[18px] text-[#8B97A0]">person</span>
        </div>
      </div>
    </nav>
  );
}
