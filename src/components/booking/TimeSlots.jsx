import { useBookingLang } from '../../context/bookingLangContext.jsx';

export default function TimeSlots({ slots, selectedTime, onSelect, selectedDateLabel }) {
  const { tr } = useBookingLang();

  return (
    <section className="slotly-time-panel">
      <div className="slotly-time-head">
        <h2>{tr.availableTimes}</h2>
        <p>{selectedDateLabel}</p>
      </div>
      <div className="slotly-time-grid">
        {slots.map((slot) => {
          const booked = slot.booked;
          const selected = selectedTime === slot.id;
          return (
            <button
              key={slot.id}
              className={`slotly-time-btn ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
              onClick={() => onSelect(slot.id)}
              disabled={booked}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
