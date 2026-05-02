import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineNavbar from '../components/pipeline/Navbar.jsx';
import PageHeader from '../components/pipeline/PageHeader.jsx';
import KanbanBoard from '../components/pipeline/KanbanBoard.jsx';
import { stages, deals } from '../data/mockDeals.js';
import AddDealModal from '../components/pipeline/AddDealModal.jsx';
import { PipelineThemeProvider, usePipelineTheme } from '../context/pipelineThemeContext.jsx';
import { PipelineLangProvider } from '../context/pipelineLangContext.jsx';

function PipelineShell() {
  const navigate = useNavigate();
  const { theme } = usePipelineTheme();
  const [items, setItems] = useState(deals);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalDeals = items.length;
  const totalValue = useMemo(() => items.reduce((sum, d) => sum + d.value, 0), [items]);
  const columnStats = (stageId) => {
    const col = items.filter((d) => d.stage === stageId);
    return {
      count: col.length,
      total: col.reduce((sum, d) => sum + d.value, 0),
    };
  };

  const openAddDeal = () => {
    setIsModalOpen(true);
  };

  const closeAddDeal = () => {
    setIsModalOpen(false);
  };

  const handleCreateDeal = (draft) => {
    const newDeal = {
      id: Date.now(),
      stage: draft.stage,
      name_en: draft.name,
      name_th: draft.name,
      company: draft.company || '—',
      value: Number(draft.value || 0),
      closeDate_en: draft.closeDate || 'TBD',
      closeDate_th: draft.closeDate || 'TBD',
      priority: draft.priority,
      winProb: draft.winProb,
      owner: draft.owner,
      tags: draft.tags,
    };
    setItems((prev) => [newDeal, ...prev]);
    closeAddDeal();
  };

  return (
    <div className="pipeflow-root" data-theme={theme}>
      <PipelineNavbar onBack={() => navigate('/')} onAddDeal={openAddDeal} />
      <main className="pipeflow-main">
        <PageHeader totalDeals={totalDeals} totalValue={totalValue} onAddDeal={openAddDeal} />
        <KanbanBoard stages={stages} deals={items} columnStats={columnStats} />
      </main>
      <AddDealModal
        open={isModalOpen}
        onClose={closeAddDeal}
        onCreate={handleCreateDeal}
        stages={stages}
      />
    </div>
  );
}

export default function PipelinePage() {
  return (
    <PipelineThemeProvider>
      <PipelineLangProvider>
        <PipelineShell />
      </PipelineLangProvider>
    </PipelineThemeProvider>
  );
}
