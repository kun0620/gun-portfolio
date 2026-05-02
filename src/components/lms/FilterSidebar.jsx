import { categories } from '../../data/mockCourses.js';
import { useLmsLang } from '../../context/lmsLangContext.jsx';

const levels = ['beginner', 'intermediate', 'advanced'];
const sorts = ['popular', 'newest', 'rating', 'price'];

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  sortBy,
  setSortBy,
  totalCourses,
}) {
  const { tr, lang } = useLmsLang();

  return (
    <aside className="bg-[#111111] fixed left-0 top-16 h-[calc(100vh-64px)] w-[240px] border-r border-[#2A2A2A] hidden md:flex flex-col py-4 gap-2 overflow-y-auto">
      <div className="px-6 py-4 mb-2">
        <h2 className="text-[18px] font-bold text-[#F0F0F0] mb-1">{tr.controlCenter}</h2>
        <p className="text-[11px] text-[#888888]">{tr.controlsSub}</p>
      </div>

      <div className="px-6 pb-2 text-[11px] tracking-[0.08em] text-[#9aa7b4]">{tr.filterCategories}</div>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`text-left px-6 py-3 flex items-center gap-3 transition-all ${
            selectedCategory === category.id
              ? 'bg-emerald-500/10 text-emerald-500 border-r-2 border-emerald-500'
              : 'text-gray-500 hover:bg-[#1A1A1A] hover:text-emerald-400'
          }`}
        >
          <span>{lang === 'en' ? category.label_en : category.label_th}</span>
        </button>
      ))}

      <div className="px-6 pt-3 pb-2 text-[11px] tracking-[0.08em] text-[#9aa7b4]">{tr.filterLevel}</div>
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
          className={`text-left px-6 py-2.5 transition-all ${
            selectedLevel === level
              ? 'text-emerald-400 bg-[#1A1A1A]'
              : 'text-gray-500 hover:bg-[#1A1A1A] hover:text-emerald-400'
          }`}
        >
          {tr.levels[level]}
        </button>
      ))}

      <div className="px-6 pt-3 pb-2 text-[11px] tracking-[0.08em] text-[#9aa7b4]">{tr.filterSort}</div>
      {sorts.map((sort, index) => (
        <button
          key={sort}
          onClick={() => setSortBy(sort)}
          className={`text-left px-6 py-2.5 transition-all ${
            sortBy === sort
              ? 'text-emerald-400 bg-[#1A1A1A]'
              : 'text-gray-500 hover:bg-[#1A1A1A] hover:text-emerald-400'
          }`}
        >
          {tr.sorts[index]}
        </button>
      ))}

      <div className="mt-auto px-6 py-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-2 text-[11px] text-[#888888]">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{tr.availableCourses(totalCourses)}</span>
        </div>
      </div>
    </aside>
  );
}
