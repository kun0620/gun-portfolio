import { useFinanceLang } from '../../context/financeLangContext.jsx';
import { useFinanceTheme } from '../../context/financeThemeContext.jsx';

export default function FinanceNavbar({ onBack }) {
  const { tr, toggleLang } = useFinanceLang();
  const { theme, toggleTheme } = useFinanceTheme();

  return (
    <header className="fixed top-0 w-full h-14 z-50 bg-black/80 backdrop-blur-md text-amber-500 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="hover:text-amber-400 transition-colors text-zinc-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-xl font-bold tracking-tighter text-amber-500 uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">diamond</span>
          {tr.brand}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleLang} className="hover:text-amber-400 transition-colors text-zinc-400">
          <span className="material-symbols-outlined">language</span>
        </button>
        <button onClick={toggleTheme} className="hover:text-amber-400 transition-colors text-zinc-400">
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>
    </header>
  );
}
