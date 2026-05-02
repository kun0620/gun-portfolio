import { useLang } from '../../context/marketplaceLangContext.jsx';

export default function ListingCard({ listing, onSelect }) {
  const { lang, tr } = useLang();
  const title = lang === 'en' ? listing.title_en : listing.title_th;
  const location = lang === 'en' ? listing.location_en : listing.location_th;
  const unit = lang === 'en' ? listing.priceUnit_en : listing.priceUnit_th;

  return (
    <article onClick={() => onSelect(listing)} className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] transition-all duration-300 hover:-translate-y-[3px] hover:border-[#444444]">
      <div className="relative aspect-[4/3]" style={{ backgroundColor: listing.placeholderColor }}>
        {listing.image ? (
          <img
            src={listing.image}
            alt={title}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : null}
        {listing.badge ? (
          <div className="absolute left-3 top-3 rounded bg-[#00ff88] px-2 py-1 text-[11px] font-semibold uppercase text-black">
            {listing.badge === 'top' ? 'TOP RATED' : 'NEW'}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[14px] font-semibold text-[#F0F0F0]">{title}</h3>
          <span className="shrink-0 text-[15px] font-semibold text-[#00ff88]">฿{listing.price.toLocaleString()}</span>
        </div>
        <div className="text-xs text-gray-400">{location}</div>
        <div className="mt-auto flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#ffb95f]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-[13px] text-[#F0F0F0]">{listing.rating}</span>
          <span className="text-[12px] text-[#888888]">({listing.reviewCount}) {tr.reviews} • {tr.by} {listing.sellerName}</span>
          <span className="sr-only">{unit}</span>
        </div>
      </div>
    </article>
  );
}
