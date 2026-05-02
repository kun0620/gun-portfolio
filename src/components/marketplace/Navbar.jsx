import { useLang } from '../../context/marketplaceLangContext.jsx';
import { useTheme } from '../../context/marketplaceThemeContext.jsx';

export default function Navbar({ searchQuery, setSearchQuery, onBack }) {
  const { toggleLang, tr } = useLang();
  const { toggleTheme } = useTheme();

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#1A1A1A] bg-[#111111]/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black tracking-tighter text-[#00FF88]">{tr.brand}</span>
          <div className="hidden gap-6 md:flex">
            <button type="button" className="border-b-2 border-[#00FF88] pb-1 font-semibold text-[#00FF88]">Explore</button>
            <button type="button" className="font-medium text-gray-400 hover:text-white">Categories</button>
            <button type="button" className="font-medium text-gray-400 hover:text-white">Sell</button>
            <button type="button" className="font-medium text-gray-400 hover:text-white">Activity</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="rounded-full bg-[#00ff88] px-4 py-2 text-[13px] font-bold text-black">{tr.listItem}</button>
          <button type="button" onClick={toggleLang} className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">language</span></button>
          <button type="button" onClick={toggleTheme} className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">dark_mode</span></button>
          <button type="button" onClick={onBack} className="rounded border border-[#2A2A2A] px-3 py-1.5 text-xs text-gray-300 hover:border-[#00FF88] hover:text-[#00FF88]">{tr.backToHome}</button>
        </div>
      </nav>
      <section className="flex h-[140px] items-center justify-center px-8">
        <div className="relative w-full max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#2A2A2A] bg-[#111111] pl-12 pr-4 text-sm text-[#F0F0F0] outline-none placeholder:text-[#888888] focus:border-[#00ff88]"
            placeholder={tr.searchPlaceholder}
            type="text"
          />
        </div>
      </section>
    </>
  );
}
