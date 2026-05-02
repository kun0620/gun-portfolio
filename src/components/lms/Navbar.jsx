import { useLmsLang } from '../../context/lmsLangContext.jsx';
import { useLmsTheme } from '../../context/lmsThemeContext.jsx';

export default function LmsNavbar({ onBack, search, onSearch }) {
  const { tr, lang, toggleLang } = useLmsLang();
  const { theme, toggleTheme } = useLmsTheme();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#2A2A2A] h-16 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-2xl font-black tracking-tighter text-emerald-500">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>widgets</span>
        <span>{tr.brand}</span>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-full py-2 pl-10 pr-4 text-[#F0F0F0] focus:outline-none focus:border-emerald-500 text-[13px]"
            placeholder={tr.searchPlaceholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400">
        <button onClick={toggleLang} className="cursor-pointer hover:text-emerald-400 transition-colors w-10 h-10 rounded-full hover:bg-[#1A1A1A] grid place-items-center" aria-label="Toggle language">
          <span className="material-symbols-outlined">translate</span>
        </button>
        <button onClick={toggleTheme} className="cursor-pointer hover:text-emerald-400 transition-colors w-10 h-10 rounded-full hover:bg-[#1A1A1A] grid place-items-center" aria-label="Toggle theme">
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button onClick={onBack} className="ml-1 px-3 py-1.5 text-xs border border-[#2A2A2A] rounded-lg text-[#F0F0F0] hover:border-emerald-500/60 hover:text-emerald-400 transition-colors">
          {lang === 'en' ? '← Back' : '← กลับ'}
        </button>
      </div>
    </nav>
  );
}
