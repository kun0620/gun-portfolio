import { categories } from '../../data/mockListings.js';
import { useLang } from '../../context/marketplaceLangContext.jsx';

export default function FilterSidebar({ selectedCategory, setSelectedCategory, maxPrice, setMaxPrice, sortBy, setSortBy }) {
  const { lang, tr } = useLang();

  return (
    <aside className="sticky top-[80px] hidden h-[calc(100vh-100px)] w-[240px] flex-col gap-2 overflow-y-auto border-r border-[#1A1A1A] bg-[#111111] p-4 md:flex">
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">{tr.filterTitle}</h3>
      </div>
      <div className="mb-6 space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm ${
              selectedCategory === cat.id ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'text-gray-500 hover:bg-[#1A1A1A] hover:text-white'
            }`}
          >
            {lang === 'en' ? cat.label_en : cat.label_th}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-xs uppercase tracking-widest text-gray-400">{tr.priceRange}</h4>
        <div className="mb-2 text-xs text-[#00FF88]">฿0 — ฿{maxPrice.toLocaleString()}</div>
        <input type="range" min={0} max={5000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#00FF88]" />
      </div>

      <div className="space-y-2">
        <h4 className="mb-2 text-xs uppercase tracking-widest text-gray-400">{tr.sortBy}</h4>
        <button type="button" onClick={() => setSortBy('newest')} className={`w-full rounded-lg p-2 text-left text-sm ${sortBy === 'newest' ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'text-gray-400'}`}>{tr.sortNewest}</button>
        <button type="button" onClick={() => setSortBy('price')} className={`w-full rounded-lg p-2 text-left text-sm ${sortBy === 'price' ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'text-gray-400'}`}>{tr.sortPrice}</button>
        <button type="button" onClick={() => setSortBy('rating')} className={`w-full rounded-lg p-2 text-left text-sm ${sortBy === 'rating' ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'text-gray-400'}`}>{tr.sortRating}</button>
      </div>
    </aside>
  );
}
