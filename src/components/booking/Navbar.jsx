import { useBookingLang } from '../../context/bookingLangContext.jsx';
import { useBookingTheme } from '../../context/bookingThemeContext.jsx';

export default function BookingNavbar({ onBack }) {
  const { lang, toggleLang, tr } = useBookingLang();
  const { toggleTheme } = useBookingTheme();

  return (
    <nav className="slotly-nav">
      <div className="slotly-brand">
        <span className="material-symbols-outlined fill">diamond</span>
        {tr.brand}
      </div>
      <div className="slotly-nav-actions">
        <div className="slotly-lang-pill" role="group" aria-label="Language switch">
          <button className={lang === 'en' ? 'active' : ''} onClick={lang === 'th' ? toggleLang : undefined}>EN</button>
          <button className={lang === 'th' ? 'active' : ''} onClick={lang === 'en' ? toggleLang : undefined}>TH</button>
        </div>
        <button className="slotly-icon-btn" onClick={toggleLang} aria-label="Toggle language">
          <span className="material-symbols-outlined">language</span>
        </button>
        <button className="slotly-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        <button className="slotly-back-btn" onClick={onBack}>{tr.backToHome}</button>
      </div>
    </nav>
  );
}
