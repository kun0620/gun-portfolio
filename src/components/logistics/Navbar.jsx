import { useLogisticsLang } from '../../context/logisticsLangContext.jsx';
import { useLogisticsTheme } from '../../context/logisticsThemeContext.jsx';

export default function LogisticsNavbar({ search, onSearch, onBack }) {
  const { toggleLang, tr } = useLogisticsLang();
  const { toggleTheme } = useLogisticsTheme();

  return (
    <nav className="transitos-nav">
      <div className="flex items-center gap-4 min-w-0">
        <button type="button" onClick={onBack} className="transitos-icon-btn" aria-label={tr.back}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <span className="transitos-brand">{tr.brand}</span>
        <div className="transitos-search hidden md:flex">
          <span className="material-symbols-outlined text-[16px]">search</span>
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={tr.searchPlaceholder} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggleLang} className="transitos-icon-btn" aria-label="toggle language">
          <span className="material-symbols-outlined text-[18px]">language</span>
        </button>
        <button type="button" onClick={toggleTheme} className="transitos-icon-btn" aria-label="toggle theme">
          <span className="material-symbols-outlined text-[18px]">dark_mode</span>
        </button>
        <button type="button" className="transitos-icon-btn relative" aria-label="notifications">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-[6px] right-[6px] h-1.5 w-1.5 bg-[#fd8b00]" />
        </button>
      </div>
    </nav>
  );
}
