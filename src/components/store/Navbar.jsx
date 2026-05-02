import { useCart } from '../../context/CartContext.jsx';
import { useLang } from '../../context/LangContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Navbar({ page, onBack, onSearch, onGotoStore }) {
  const { lang, toggleLang, tr } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { count, setIsOpen } = useCart();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <button type="button" className="flex items-center gap-1 text-2xl font-black italic tracking-tight text-amber-500">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>electric_bolt</span>
          {tr.brand}
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {page === 'store' ? (
            <div className="relative">
              <input
                type="text"
                placeholder={tr.searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="w-48 rounded-full border border-[#2A2A2A] bg-[#111111] py-1.5 pl-4 pr-10 text-sm text-[#F0F0F0] placeholder:text-[#888888] focus:border-amber-500 focus:outline-none"
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#888888]">search</span>
            </div>
          ) : (
            <>
              <button type="button" className="border-b-2 border-amber-500 pb-1 text-sm font-bold text-amber-500">New Arrival</button>
              <button type="button" className="text-sm font-medium text-zinc-400 hover:text-amber-400">Hardware</button>
              <button type="button" className="text-sm font-medium text-zinc-400 hover:text-amber-400">Apparel</button>
              <button type="button" className="text-sm font-medium text-zinc-400 hover:text-amber-400">Archive</button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleLang} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-amber-400">
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span className="sr-only">{lang === 'en' ? 'TH' : 'EN'}</span>
          </button>
          <button type="button" onClick={toggleTheme} className="rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-amber-400">
            <span className="material-symbols-outlined text-[20px]">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
          </button>
          <button type="button" onClick={() => setIsOpen(true)} className="relative rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-amber-400">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            {count > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500" /> : null}
          </button>
          {page === 'store' ? (
            <button type="button" onClick={onBack} className="rounded border border-[#2A2A2A] px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-200 hover:border-amber-500 hover:text-amber-400">
              {tr.backToHome}
            </button>
          ) : (
            <button type="button" onClick={onGotoStore} className="rounded border border-[#2A2A2A] px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-200 hover:border-amber-500 hover:text-amber-400">
              {tr.heroBtn}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
