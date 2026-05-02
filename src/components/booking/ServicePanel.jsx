import { useBookingLang } from '../../context/bookingLangContext.jsx';

export default function ServicePanel({ services, selectedService, onSelect }) {
  const { lang, tr } = useBookingLang();

  return (
    <aside className="slotly-service-panel">
      <div className="slotly-service-head">
        <h1>Booking</h1>
        <p>{tr.selectService}</p>
      </div>
      <div className="slotly-service-list">
        {services.map((s) => {
          const selected = selectedService === s.id;
          return (
            <button key={s.id} className={`slotly-service-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(s.id)}>
              <div className="slotly-service-icon">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <div className="slotly-service-content">
                <h3>{lang === 'en' ? s.name_en : s.name_th}</h3>
                <p>{lang === 'en' ? s.desc_en : s.desc_th}</p>
                <small>{lang === 'en' ? s.duration_en : s.duration_th} · ฿{s.price.toLocaleString()}</small>
              </div>
              {selected && <span className="material-symbols-outlined slotly-check">check_circle</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
