import { useLmsLang } from '../../context/lmsLangContext.jsx';

export default function CourseCard({ course, onOpen }) {
  const { lang, tr } = useLmsLang();
  const lessonsLeft = course.totalLessons - course.completedLessons;
  const badgeLabel = course.badge ? tr.badges[course.badge] : null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(course)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(course);
      }}
      className="bg-[#111111] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-emerald-500/60 transition-colors cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden" style={{ backgroundColor: course.placeholderColor }}>
        <img alt={course.title_en} src={course.image} className="w-full h-full object-cover opacity-90" />
        {badgeLabel ? (
          <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/70 border border-[#2A2A2A] text-[#F0F0F0]">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="p-[14px]">
        <h3 className="text-[15px] font-semibold text-[#F0F0F0] mb-1 line-clamp-2">
          {lang === 'en' ? course.title_en : course.title_th}
        </h3>
        <p className="text-[13px] text-[#888888] mb-1">{tr.by} {lang === 'en' ? course.instructor_en : course.instructor_th}</p>
        <div className="text-[11px] text-[#9aa7b4] flex items-center justify-between mb-3">
          <span>{lang === 'en' ? course.duration_en : course.duration_th}</span>
          <span>{tr.studentsCount(course.students)}</span>
        </div>

        {course.enrolled ? (
          <div>
            <div className="flex justify-between text-[11px] text-[#9aa7b4] mb-1">
              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
              <span className="text-emerald-500">{course.progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden mb-2">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
            <p className="text-[11px] text-[#888888]">{tr.lessonsLeft(lessonsLeft)}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-semibold text-emerald-400">
              {course.price === 0 ? tr.free : `฿${course.price.toLocaleString()}`}
            </span>
            <button
              className="px-3 py-1.5 text-[12px] rounded border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(course);
              }}
            >
              {tr.enroll}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
