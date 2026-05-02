import { useEffect, useMemo, useState } from 'react';
import { usePipelineLang } from '../../context/pipelineLangContext.jsx';

const owners = ['GN', 'AT', 'KP'];
const tagsList = ['enterprise', 'inbound', 'partner', 'at-risk'];

export default function AddDealModal({ open, onClose, onCreate, stages }) {
  const { lang, tr } = usePipelineLang();
  const [form, setForm] = useState({
    name: '',
    company: '',
    value: '',
    stage: stages[0]?.id ?? 'lead',
    priority: 'medium',
    owner: owners[0],
    winProb: 72,
    closeDate: '',
    tags: ['enterprise', 'inbound'],
    notes: '',
  });

  const ui = useMemo(
    () =>
      lang === 'th'
        ? {
            title: 'เพิ่มดีล',
            subtitle: 'สร้างโอกาสใหม่ในไปป์ไลน์',
            dealName: 'ชื่อดีล',
            company: 'บริษัท',
            value: 'มูลค่าดีล',
            stage: 'ขั้นตอน',
            owner: 'ผู้รับผิดชอบ',
            probability: 'โอกาสปิดดีล',
            closeDate: 'วันที่คาดว่าจะปิด',
            tags: 'แท็ก',
            notes: 'หมายเหตุ',
            addTag: 'เพิ่มแท็ก',
            cancel: 'ยกเลิก',
            create: 'สร้างดีล',
            placeholderDeal: 'เช่น Acme Corp Enterprise Plan',
            placeholderCompany: 'ค้นหาหรือเพิ่มใหม่...',
            placeholderNotes: 'เพิ่มบริบท ความต้องการ หรือขั้นตอนถัดไป...',
          }
        : {
            title: 'Add Deal',
            subtitle: 'Create a new opportunity in pipeline',
            dealName: 'Deal Name',
            company: 'Company',
            value: 'Deal Value',
            stage: 'Stage',
            owner: 'Owner',
            probability: 'Win Probability',
            closeDate: 'Expected Close Date',
            tags: 'Tags',
            notes: 'Notes',
            addTag: 'Add Tag',
            cancel: 'Cancel',
            create: 'Create Deal',
            placeholderDeal: 'e.g. Acme Corp Enterprise Plan',
            placeholderCompany: 'Search or add new...',
            placeholderNotes: 'Add initial context, requirements, or next steps...',
          },
    [lang],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const canCreate = form.name.trim().length > 0;

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const submit = () => {
    if (!canCreate) return;
    onCreate(form);
    setForm((prev) => ({ ...prev, name: '', company: '', value: '', closeDate: '', notes: '' }));
  };

  return (
    <div className="pipeflow-modal-overlay" onClick={onClose} role="presentation">
      <section
        className="pipeflow-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ui.title}
      >
        <header className="pipeflow-modal-head">
          <div>
            <h2>{ui.title}</h2>
            <p>{ui.subtitle}</p>
          </div>
          <button className="pipeflow-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </header>

        <div className="pipeflow-modal-body">
          <div className="pipeflow-modal-grid">
            <label>
              {ui.dealName} <span>*</span>
              <input
                value={form.name}
                placeholder={ui.placeholderDeal}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>
            <label>
              {ui.company}
              <input
                value={form.company}
                placeholder={ui.placeholderCompany}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
              />
            </label>
            <label>
              {ui.value}
              <input
                type="number"
                value={form.value}
                placeholder="0.00"
                onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
              />
            </label>
            <label>
              {ui.stage}
              <select value={form.stage} onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {lang === 'th' ? stage.label_th : stage.label_en}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="pipeflow-priority-wrap">
            <span>{lang === 'th' ? 'ความสำคัญ' : 'Priority'}</span>
            <div>
              {(['high', 'medium', 'low']).map((p) => (
                <button
                  key={p}
                  className={form.priority === p ? 'active' : ''}
                  onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                >
                  {tr.priority[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="pipeflow-modal-grid">
            <label>
              {ui.owner}
              <select value={form.owner} onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))}>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {ui.closeDate}
              <input
                type="date"
                value={form.closeDate}
                onChange={(e) => setForm((prev) => ({ ...prev, closeDate: e.target.value }))}
              />
            </label>
          </div>

          <div className="pipeflow-prob-wrap">
            <div>
              <span>{ui.probability}</span>
              <strong>{form.winProb}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.winProb}
              onChange={(e) => setForm((prev) => ({ ...prev, winProb: Number(e.target.value) }))}
            />
          </div>

          <div className="pipeflow-tags-wrap">
            <span>{ui.tags}</span>
            <div>
              {tagsList.map((tag) => (
                <button
                  key={tag}
                  className={form.tags.includes(tag) ? 'active' : ''}
                  onClick={() => toggleTag(tag)}
                >
                  {tr.tags[tag]}
                </button>
              ))}
              <button className="ghost">{ui.addTag}</button>
            </div>
          </div>

          <label className="pipeflow-notes-wrap">
            {ui.notes}
            <textarea
              rows={3}
              value={form.notes}
              placeholder={ui.placeholderNotes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </label>
        </div>

        <footer className="pipeflow-modal-foot">
          <button className="pipeflow-modal-cancel" onClick={onClose}>
            {ui.cancel}
          </button>
          <button className="pipeflow-modal-create" onClick={submit} disabled={!canCreate}>
            {ui.create}
          </button>
        </footer>
      </section>
    </div>
  );
}
