import { usePipelineLang } from '../../context/pipelineLangContext.jsx';
import { usePipelineTheme } from '../../context/pipelineThemeContext.jsx';

export default function PipelineNavbar({ onBack, onAddDeal }) {
  const { lang, toggleLang, tr } = usePipelineLang();
  const { theme, toggleTheme } = usePipelineTheme();

  return (
    <nav className="pipeflow-nav">
      <div className="pipeflow-nav-left">
        <div className="pipeflow-brand"><span>◈</span> {tr.brand}</div>
        <div className="pipeflow-nav-links">
          <a href="#">{tr.pageTitle}</a>
          <a href="#">{lang === 'en' ? 'Accounts' : 'บัญชี'}</a>
          <a href="#">{lang === 'en' ? 'Reports' : 'รายงาน'}</a>
        </div>
      </div>
      <div className="pipeflow-nav-right">
        <div className="pipeflow-lang-toggle">
          <button className={lang === 'en' ? 'active' : ''} onClick={toggleLang}>ENG</button>
          <button className={lang === 'th' ? 'active' : ''} onClick={toggleLang}>TH</button>
        </div>
        <button className="pipeflow-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☾' : '☼'}
        </button>
        <button className="pipeflow-back-btn" onClick={onBack}>{tr.backToHome}</button>
        <button className="pipeflow-add-btn desktop-only" onClick={onAddDeal}>{tr.addDeal}</button>
      </div>
    </nav>
  );
}
