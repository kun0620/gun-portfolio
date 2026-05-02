import KanbanColumn from './KanbanColumn.jsx';

export default function KanbanBoard({ stages, deals, columnStats }) {
  return (
    <div className="pipeflow-board-wrap">
      <div className="pipeflow-board">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={deals.filter((deal) => deal.stage === stage.id)}
            stats={columnStats(stage.id)}
          />
        ))}
      </div>
    </div>
  );
}
