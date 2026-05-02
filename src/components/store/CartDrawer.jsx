import { useCart } from '../../context/CartContext.jsx';
import { useLang } from '../../context/LangContext.jsx';

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();
  const { lang, tr } = useLang();

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close overlay"
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[39] bg-black/60 backdrop-blur-sm"
      />
      <aside className="fixed right-0 top-0 z-40 flex h-full w-[360px] max-w-[92vw] flex-col border-l border-zinc-800 bg-[#0A0A0A] p-6 shadow-[-20px_0_40px_rgba(0,0,0,0.8)]">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-black uppercase tracking-widest text-amber-500">{tr.cartTitle}</h2>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-[#111111] text-zinc-500 hover:border-amber-500/50 hover:text-amber-500" onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!items.length ? <p className="text-sm text-zinc-500">{tr.cartEmpty}</p> : null}
          {items.map((item) => (
            <div key={item.id} className="border-b border-zinc-800 py-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <strong className="text-sm text-[#F0F0F0]">{lang === 'en' ? item.name_en : item.name_th}</strong>
                <button type="button" onClick={() => removeItem(item.id)} className="text-xs text-zinc-500 hover:text-amber-400">{tr.remove}</button>
              </div>
              <div className="mb-3 text-sm text-amber-500">฿{item.price.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-3 rounded-md border border-zinc-800 bg-[#111111] px-2 py-1">
                  <button type="button" className="text-zinc-500 hover:text-amber-500" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                  <span className="text-sm text-[#F0F0F0]">{item.qty}</span>
                  <button type="button" className="text-zinc-500 hover:text-amber-500" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t border-zinc-800 pt-6">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>{tr.subtotal}</span>
            <span className="text-[#F0F0F0]">฿{total.toLocaleString()}</span>
          </div>
          <button type="button" className="w-full rounded-lg bg-amber-500 py-4 text-sm font-bold uppercase tracking-wider text-black hover:bg-amber-400">
            {tr.checkout}
          </button>
        </div>
      </aside>
    </>
  );
}
