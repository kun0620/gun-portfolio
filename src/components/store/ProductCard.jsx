import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useLang } from '../../context/LangContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { lang, tr } = useLang();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const name = lang === 'en' ? product.name_en : product.name_th;

  const handleAdd = () => {
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const btnText = !product.inStock ? tr.outOfStock : added ? tr.added : tr.addToCart;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#444444]">
      <div className="relative aspect-square w-full overflow-hidden" style={{ backgroundColor: product.placeholderColor }}>
        {product.image ? (
          <img
            src={product.image}
            alt={name}
            className="shop-product-image h-full w-full object-cover object-center opacity-85"
            loading="lazy"
          />
        ) : null}
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 hover:text-amber-500"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${liked ? 1 : 0}` }}>
            favorite
          </span>
        </button>
        {product.badge ? (
          <div className="absolute left-4 top-4">
            <span className="rounded-sm bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">{product.badge}</span>
          </div>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col p-5 ${!product.inStock ? 'opacity-70' : ''}`}>
        <h3 className="truncate pr-2 font-['Rubik'] text-[14px] text-[#F0F0F0]">{name}</h3>
        <div className="mb-4 mt-2 flex items-center gap-2">
          <span className="font-['Rubik'] text-base font-semibold text-amber-500">฿{product.price.toLocaleString()}</span>
          {product.originalPrice ? (
            <span className="text-xs text-[#888888] line-through">฿{product.originalPrice.toLocaleString()}</span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleAdd}
          className={`mt-auto w-full rounded-lg py-3 font-['Nunito_Sans'] text-[15px] font-bold transition-all duration-300 ${
            product.inStock
              ? 'border border-[#2A2A2A] bg-transparent text-[#F0F0F0] hover:border-amber-500 hover:text-amber-500'
              : 'cursor-not-allowed bg-[#1A1A1A] text-[#444444]'
          }`}
        >
          {btnText}
        </button>
      </div>
    </article>
  );
}
