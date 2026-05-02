import { usePipelineLang } from '../../context/pipelineLangContext.jsx';

export default function PageHeader({ totalDeals, totalValue, onAddDeal }) {
  const { tr } = usePipelineLang();

  return (
    <header className="pipeflow-header">
      <div>
        <h1>{tr.pageTitle}</h1>
        <p>{`${totalDeals} ${tr.deals} · ฿${totalValue.toLocaleString()} ${tr.total}`}</p>
      </div>
      <button className="pipeflow-add-btn mobile-only" onClick={onAddDeal}>
        {tr.addDeal}
      </button>
    </header>
  );
}
