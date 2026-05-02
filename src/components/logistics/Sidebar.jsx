import { useLogisticsLang } from '../../context/logisticsLangContext.jsx';

export default function LogisticsSidebar() {
  const { tr } = useLogisticsLang();
  const icons = ['map', 'local_shipping', 'minor_crash', 'warning', 'bar_chart', 'settings'];

  return (
    <aside className="transitos-sidebar">
      <div className="px-4 mb-6">
        <h2 className="text-[#00fbfb] font-bold tracking-widest text-sm">{tr.brand.toUpperCase()}</h2>
        <p className="text-[#717171] text-[10px] tracking-widest mt-1">{tr.commandConsole}</p>
      </div>
      <nav className="flex flex-col gap-1">
        {tr.nav.map((label, idx) => (
          <button
            key={label}
            type="button"
            className={`transitos-side-link ${idx === 0 ? 'is-active' : ''}`}
            aria-current={idx === 0 ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-[18px] mr-3">{icons[idx]}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
