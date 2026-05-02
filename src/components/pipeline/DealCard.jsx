import { usePipelineLang } from '../../context/pipelineLangContext.jsx';

const priorityColor = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const tagStyle = {
  enterprise: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA' },
  inbound: { bg: 'rgba(16,185,129,0.15)', color: '#34D399' },
  partner: { bg: 'rgba(245,158,11,0.15)', color: '#FCD34D' },
  'at-risk': { bg: 'rgba(239,68,68,0.15)', color: '#F87171' },
};

export default function DealCard({ deal }) {
  const { lang, tr } = usePipelineLang();

  return (
    <article className="pipeflow-deal-card">
      <div className="pipeflow-deal-top">
        <h3>{lang === 'en' ? deal.name_en : deal.name_th}</h3>
        <span className="pipeflow-priority-dot" style={{ backgroundColor: priorityColor[deal.priority] }} title={tr.priority[deal.priority]} />
      </div>
      <p className="pipeflow-deal-company">{deal.company}</p>
      <p className="pipeflow-deal-value">฿{deal.value.toLocaleString()}</p>
      <p className="pipeflow-deal-close">{`${tr.closeDate} ${lang === 'en' ? deal.closeDate_en : deal.closeDate_th}`}</p>
      <div className="pipeflow-tag-row">
        {deal.tags.map((tag) => (
          <span key={tag} style={{ backgroundColor: tagStyle[tag].bg, color: tagStyle[tag].color }}>
            {tr.tags[tag]}
          </span>
        ))}
      </div>
      <div className="pipeflow-deal-foot">
        <div className="pipeflow-prob-track">
          <div className="pipeflow-prob-fill" style={{ width: `${deal.winProb}%` }} />
        </div>
        <span>{tr.winProb(deal.winProb)}</span>
      </div>
      <div className="pipeflow-owner">{deal.owner}</div>
    </article>
  );
}
