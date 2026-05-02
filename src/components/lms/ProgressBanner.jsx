import { useEffect } from 'react';
import { useLmsLang } from '../../context/lmsLangContext.jsx';

export default function ProgressBanner({ items }) {
  const { tr, lang } = useLmsLang();

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.progress-fill').forEach((el) => {
        const width = el.dataset.progress || '0';
        el.style.width = `${width}%`;
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <section className="mb-10">
      <h3 className="text-[18px] font-bold text-[#F0F0F0] mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        {tr.currentFocus}
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((course) => (
          <article
            key={course.id}
            className="min-w-[320px] max-w-[380px] flex-shrink-0 bg-[#111111] rounded-xl border border-[#2A2A2A] p-[14px] snap-start hover:-translate-y-1 hover:bg-[#1A1A1A] transition-transform duration-200"
          >
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-lg bg-[#1A1A1A] overflow-hidden flex-shrink-0">
                <img alt={course.title_en} src={course.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-[#F0F0F0] line-clamp-1 mb-1">
                  {lang === 'en' ? course.title_en : course.title_th}
                </h4>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] text-[#888888]">{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span className="text-[15px] text-emerald-500 font-medium">{course.progress}%</span>
                </div>
                <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="progress-fill h-full bg-emerald-500 rounded-full" data-progress={course.progress} style={{ width: '0%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-1.5 rounded bg-emerald-500/10 border border-emerald-500 text-emerald-500 text-[12px] font-semibold hover:bg-emerald-500/20 transition-colors">
                {tr.continueLearning}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
