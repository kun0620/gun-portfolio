import { categories } from '../../data/mockProducts.js';
import { useLang } from '../../context/LangContext.jsx';

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onBack,
}) {
  const { lang, tr } = useLang();

  return (
    <aside className="custom-scrollbar sticky top-20 hidden h-[calc(100vh-80px)] w-[240px] shrink-0 overflow-y-auto border-r border-[#2A2A2A] p-6 md:block">
      <button type="button" onClick={onBack} className="mb-8 inline-flex items-center text-sm text-[#888888] transition-colors hover:text-amber-500">
        <span className="material-symbols-outlined mr-1 text-[16px]">arrow_back</span>
        {tr.backToHome}
      </button>
      <div className="mb-10">
        <h3 className="mb-4 font-['Nunito_Sans'] text-[11px] uppercase tracking-[0.12em] text-[#888888]">{tr.filterTitle}</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedCategory === c.id
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                    : 'border-[#2A2A2A] text-[#888888] hover:text-[#F0F0F0]'
                }`}
              >
                {lang === 'en' ? c.label_en : c.label_th}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-['Nunito_Sans'] text-[11px] uppercase tracking-[0.12em] text-[#888888]">{tr.priceRange}</h3>
          <span className="text-xs text-amber-500">฿0 - ฿{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
      </div>
      <div>
        <h3 className="mb-4 font-['Nunito_Sans'] text-[11px] uppercase tracking-[0.12em] text-[#888888]">{tr.sortBy}</h3>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => setSortBy('newest')} className={`rounded-lg border px-3 py-2 text-left text-sm ${sortBy === 'newest' ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortNewest}</button>
          <button type="button" onClick={() => setSortBy('price')} className={`rounded-lg border px-3 py-2 text-left text-sm ${sortBy === 'price' ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortPrice}</button>
          <button type="button" onClick={() => setSortBy('rating')} className={`rounded-lg border px-3 py-2 text-left text-sm ${sortBy === 'rating' ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortRating}</button>
        </div>
      </div>
    </aside>
  );
}
