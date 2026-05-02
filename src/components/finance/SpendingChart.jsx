import { useMemo, useState } from 'react';
import { useFinanceLang } from '../../context/financeLangContext.jsx';

const RADIUS = 64;
const BASE_STROKE = 18;
const ACTIVE_STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_PX = 0;

export default function SpendingChart({ categories, totalSpent }) {
  const { lang, tr } = useFinanceLang();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const segments = useMemo(() => {
    let offset = 0;
    const totalSegments = categories.length;
    const totalGap = totalSegments > 1 ? GAP_PX * totalSegments : 0;
    const usableCircumference = Math.max(CIRCUMFERENCE - totalGap, 0);
    return categories.map((category) => {
      const segmentArc = (category.percent / 100) * usableCircumference;
      const dash = Math.max(segmentArc, 0);
      const gap = CIRCUMFERENCE - dash;
      const segment = { ...category, dash, gap, offset };
      offset += dash + (totalSegments > 1 ? GAP_PX : 0);
      return segment;
    });
  }, [categories]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) || null,
    [activeCategoryId, categories],
  );

  const centerValue = activeCategory ? `฿${activeCategory.amount.toLocaleString()}` : `฿${totalSpent.toLocaleString()}`;
  const centerLabel = activeCategory
    ? `${lang === 'en' ? activeCategory.label_en : activeCategory.label_th} · ${activeCategory.percent}%`
    : tr.totalSpent;

  return (
    <section className="w-full md:w-[40%] flex flex-col gap-4">
      <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 flex flex-col">
        <h2 className="text-[15px] font-semibold text-[#F0F0F0] mb-6">{tr.spendingBreakdown}</h2>
        <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-8 flex-shrink-0" onMouseLeave={() => setActiveCategoryId(null)}>
          <svg className="w-full h-full" width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#22262D" strokeWidth={BASE_STROKE} />
            <circle cx="90" cy="90" r={RADIUS + 6} fill="none" stroke="#1A1F26" strokeWidth="1" />
            {segments.map((segment) => (
              <circle
                key={segment.id}
                cx="90"
                cy="90"
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth={activeCategoryId === segment.id ? ACTIVE_STROKE : BASE_STROKE}
                strokeDasharray={`${segment.dash} ${segment.gap}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="butt"
                onMouseEnter={() => setActiveCategoryId(segment.id)}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  opacity: activeCategoryId && activeCategoryId !== segment.id ? 0.45 : 1,
                  filter: activeCategoryId === segment.id ? 'brightness(1.18)' : 'none',
                  transition: 'stroke-width 180ms ease, opacity 180ms ease, filter 180ms ease',
                  cursor: 'pointer',
                }}
              />
            ))}
            <text x="90" y="86" textAnchor="middle" fill="#F0F0F0" fontSize="15" fontWeight="700" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {centerValue}
            </text>
            <text x="90" y="108" textAnchor="middle" fill="#888888" fontSize="10.5">
              {centerLabel}
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-4" onMouseLeave={() => setActiveCategoryId(null)}>
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-1 rounded-md p-1 -mx-1 transition-colors"
              onMouseEnter={() => setActiveCategoryId(category.id)}
              style={{
                backgroundColor: activeCategoryId === category.id ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              }}
            >
              <div className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                  <span
                    className="text-[#F0F0F0] transition-colors"
                    style={{ color: activeCategoryId === category.id ? category.color : '#F0F0F0' }}
                  >
                    {lang === 'en' ? category.label_en : category.label_th}
                  </span>
                </div>
                <span className="text-[#888888] tabular-nums">฿{category.amount.toLocaleString()} · {category.percent}%</span>
              </div>
              <div className="h-1 bg-[#2A2A2A] rounded-full w-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${category.percent}%`, backgroundColor: category.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
