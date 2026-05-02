import { useBookingLang } from '../../context/bookingLangContext.jsx';

export default function BookingSummary({ service, dateLabel, selectedTime, onConfirm, step }) {
  const { lang, tr } = useBookingLang();

  return (
    <section className="slotly-summary-panel">
      <h2>{tr.bookingSummary}</h2>
      <div className="slotly-summary-list">
        <div><span>{tr.service}</span><strong>{lang === 'en' ? service.name_en : service.name_th}</strong></div>
        <div><span>{tr.date}</span><strong>{dateLabel}</strong></div>
        <div><span>{tr.time}</span><strong>{selectedTime}</strong></div>
        <div><span>{tr.duration}</span><strong>{lang === 'en' ? service.duration_en : service.duration_th}</strong></div>
        <div><span>{tr.price}</span><strong>฿{service.price.toLocaleString()}</strong></div>
      </div>
      <button className="slotly-confirm-btn" onClick={onConfirm} disabled={step !== 3}>
        {tr.confirmBooking}
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </section>
  );
}
