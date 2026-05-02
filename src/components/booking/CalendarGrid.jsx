import { useBookingLang } from '../../context/bookingLangContext.jsx';

export default function CalendarGrid({
  year,
  month,
  selectedDay,
  onSelectDay,
  getDaysInMonth,
  getFirstDayOfMonth,
  isPast,
  isUnavailable,
}) {
  const { tr } = useBookingLang();
  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const leadEmpty = Array.from({ length: firstDay });
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <section className="slotly-calendar-panel">
      <div className="slotly-calendar-head">
        <h2>{tr.months[month]} {year}</h2>
      </div>
      <div className="slotly-days-row">
        {tr.days.map((day) => (
          <div key={day} className="slotly-day-name">{day}</div>
        ))}
      </div>
      <div className="slotly-calendar-grid">
        {leadEmpty.map((_, idx) => <div key={`e-${idx}`} className="slotly-empty" />)}
        {days.map((day) => {
          const past = isPast(day);
          const unavailable = isUnavailable(day);
          const selected = selectedDay === day;
          const disabled = past || unavailable;
          return (
            <button
              key={day}
              className={`slotly-day-btn ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${!disabled ? 'open' : ''}`}
              onClick={() => !disabled && onSelectDay(day)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
