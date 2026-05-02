import { useLogisticsLang } from '../../context/logisticsLangContext.jsx';

function Checkpoint({ item }) {
  return (
    <div className={`transitos-checkpoint ${item.state === 'next' ? 'opacity-55' : ''}`}>
      <span className={`transitos-checkpoint-dot ${item.state}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`block text-[12px] ${item.state === 'active' ? 'text-[#00fbfb]' : 'text-[#d2d2d2]'}`}>{item.label}</span>
          <span className="block text-[11px] text-[#8f8f8f]">{item.place}</span>
        </div>
        <span className="text-[10px] text-[#9e9e9e]">{item.time}</span>
      </div>
    </div>
  );
}

export default function ShipmentDrawer({ shipment, open, onClose }) {
  const { tr } = useLogisticsLang();
  if (!shipment) return null;

  return (
    <>
      <button type="button" className={`transitos-drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-label={tr.drawer.close} />
      <aside className={`transitos-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="transitos-drawer-head">
          <div>
            <div className="flex items-center gap-2 mb-1 text-[#fd8b00]">
              <span className="h-1.5 w-1.5 bg-[#fd8b00] animate-pulse" />
              <span className="font-['Fira_Code'] text-[10px] uppercase">{tr.drawer.alertActive}</span>
            </div>
            <h2 className="font-['Fira_Code'] text-[22px] text-white">{shipment.id}</h2>
            <p className="text-[12px] text-[#a8a8a8]">{shipment.origin}{' -> '}{shipment.destination}</p>
          </div>
          <button type="button" className="transitos-icon-btn" onClick={onClose} aria-label={tr.drawer.close}>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="transitos-drawer-content">
          <div className="grid grid-cols-2 gap-2">
            <div className="transitos-card p-3">
              <div className="text-[10px] uppercase text-[#8e8e8e] mb-1">{tr.drawer.speed}</div>
              <div className="font-['Fira_Code'] text-[18px] text-[#00fbfb]">{shipment.telemetry.speedMph}<span className="text-[12px] text-[#9d9d9d]"> mph</span></div>
            </div>
            <div className="transitos-card p-3">
              <div className="text-[10px] uppercase text-[#8e8e8e] mb-1">{tr.drawer.revisedEta}</div>
              <div className="font-['Fira_Code'] text-[18px] text-[#fd8b00]">
                {shipment.etaLabel}
                {shipment.etaDeltaMinutes > 0 ? <span className="text-[11px] ml-1">+{shipment.etaDeltaMinutes}m</span> : null}
              </div>
            </div>
          </div>

          <div className="transitos-card p-3">
            <div className="text-[10px] uppercase text-[#8e8e8e] mb-2">{tr.drawer.telemetry}</div>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-[#a4a4a4]">{tr.drawer.temp}</span>
              <span className="font-['Fira_Code'] text-white">{shipment.telemetry.tempF.toFixed(1)}°F</span>
            </div>
            <div className="h-2 bg-[#1f1f1f] mb-3"><div className="h-full bg-[#00fbfb]" style={{ width: `${Math.min(100, shipment.telemetry.tempF * 2)}%` }} /></div>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className="text-[#a4a4a4]">{tr.drawer.vibration}</span>
              <span className="font-['Fira_Code'] text-white">{shipment.telemetry.vibrationG.toFixed(1)}g</span>
            </div>
            <div className="h-2 bg-[#1f1f1f]"><div className="h-full bg-[#8f8f8f]" style={{ width: `${Math.min(100, shipment.telemetry.vibrationG * 40)}%` }} /></div>
          </div>

          <div className="transitos-card p-3">
            <div className="text-[10px] uppercase text-[#8e8e8e] mb-2">{tr.drawer.checkpoints}</div>
            <div className="transitos-checkpoint-rail">
              {shipment.checkpoints.map((point) => <Checkpoint key={point.id} item={point} />)}
            </div>
          </div>

          <div className="transitos-card p-3">
            <div className="text-[10px] uppercase text-[#8e8e8e] mb-2">{tr.drawer.manifestNotes}</div>
            <p className="text-[12px] text-[#e7e7e7] bg-[#1a1a1a] border border-[#2b2b2b] p-3">{shipment.notes}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
