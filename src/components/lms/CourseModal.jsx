import { useLmsLang } from '../../context/lmsLangContext.jsx';

export default function CourseModal({ course, onClose }) {
  const { lang, tr } = useLmsLang();

  if (!course) return null;

  const title = lang === 'en' ? course.title_en : course.title_th;
  const desc = lang === 'en' ? course.description_en : course.description_th;
  const learns = lang === 'en' ? course.learns_en : course.learns_th;

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#111111] border border-[#2A2A2A] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-56" style={{ backgroundColor: course.placeholderColor }}>
          <img alt={course.title_en} src={course.image} className="w-full h-full object-cover opacity-90" />
          <button onClick={onClose} className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/65 border border-[#2A2A2A] text-[#F0F0F0]">✕</button>
        </div>
        <div className="p-5">
          <h2 className="text-[22px] font-bold text-[#F0F0F0] mb-1">{title}</h2>
          <p className="text-[13px] text-[#9aa7b4] mb-4">
            {tr.by} {lang === 'en' ? course.instructor_en : course.instructor_th} · {tr.topInstructor}
          </p>

          <h3 className="text-[15px] font-semibold text-[#F0F0F0] mb-1">{tr.about}</h3>
          <p className="text-[13px] text-[#9aa7b4] mb-4">{desc}</p>

          <h3 className="text-[15px] font-semibold text-[#F0F0F0] mb-2">{tr.youllLearn}</h3>
          <ul className="list-disc pl-5 text-[13px] text-[#9aa7b4] space-y-1 mb-5">
            {learns.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[16px] text-emerald-400 font-semibold">
              {course.price === 0 ? tr.free : `฿${course.price.toLocaleString()}`}
            </span>
            <button
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
              onClick={() => alert(`Enrolling in ${title}`)}
            >
              {tr.enrollNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
