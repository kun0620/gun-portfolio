import { useLang } from '../../context/marketplaceLangContext.jsx';

export default function ListingModal({ listing, onClose }) {
  const { lang, tr } = useLang();
  const title = lang === 'en' ? listing.title_en : listing.title_th;
  const location = lang === 'en' ? listing.location_en : listing.location_th;
  const unit = lang === 'en' ? listing.priceUnit_en : listing.priceUnit_th;
  const tags = lang === 'en' ? listing.tags_en : listing.tags_th;
  const description = lang === 'en' ? listing.description_en : listing.description_th;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl border border-[#2A2A2A] bg-[#111111] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-[22px] font-bold text-[#F0F0F0]">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <p className="mb-3 text-sm text-[#888888]">{location} • {tr.verified}</p>
        <p className="mb-4 text-sm text-[#d4d4d4]">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#2A2A2A] px-3 py-1 text-xs text-gray-300">{tag}</span>
          ))}
        </div>
        <div className="mb-5 text-[26px] font-bold text-[#00ff88]">฿{listing.price.toLocaleString()} / {unit}</div>
        <div className="flex gap-3">
          <button type="button" onClick={() => alert(`Connecting to ${listing.sellerName}`)} className="rounded bg-[#00ff88] px-4 py-2 text-sm font-bold text-black">{tr.contactSeller}</button>
          <button type="button" className="rounded border border-[#2A2A2A] px-4 py-2 text-sm text-white">{tr.saveListing}</button>
        </div>
      </div>
    </div>
  );
}
