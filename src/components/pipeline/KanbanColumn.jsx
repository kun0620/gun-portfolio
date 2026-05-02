import { usePipelineLang } from '../../context/pipelineLangContext.jsx';
import DealCard from './DealCard.jsx';

export default function KanbanColumn({ stage, deals, stats }) {
  const { lang } = usePipelineLang();

  return (
    <section className="pipeflow-column">
      <header className="pipeflow-column-header" style={{ borderTopColor: stage.color }}>
        <div>
          <span className="pipeflow-stage-dot" style={{ backgroundColor: stage.color }} />
          <h2>{lang === 'en' ? stage.label_en : stage.label_th}</h2>
        </div>
        <div className="pipeflow-col-badges">
          <span>{stats.count}</span>
          <span>{`฿${stats.total.toLocaleString()}`}</span>
        </div>
      </header>
      <div className="pipeflow-column-list">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}
