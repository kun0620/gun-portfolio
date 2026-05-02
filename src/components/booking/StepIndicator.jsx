import { useBookingLang } from '../../context/bookingLangContext.jsx';

export default function StepIndicator({ step }) {
  const { tr } = useBookingLang();

  return (
    <div className="slotly-steps-wrap">
      <div className="slotly-steps">
        {tr.steps.map((label, idx) => {
          const n = idx + 1;
          const state = n < step ? 'done' : n === step ? 'active' : 'idle';
          return (
            <div className="slotly-step-item" key={label}>
              <div className={`slotly-step-dot ${state}`}>{n}</div>
              <span className={`slotly-step-label ${state}`}>{label}</span>
              {idx < tr.steps.length - 1 && <div className={`slotly-step-line ${n < step ? 'done' : ''}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
