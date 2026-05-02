import { useMemo, useState } from 'react';
import FilterSidebar from '../../components/store/FilterSidebar.jsx';
import ProductGrid from '../../components/store/ProductGrid.jsx';
import { products } from '../../data/mockProducts.js';
import { useLang } from '../../context/LangContext.jsx';

export default function StorePage({ onBack, onSearch }) {
  const { lang, tr } = useLang();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(
    () =>
      products
        .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
        .filter((p) => p.price <= maxPrice)
        .filter((p) => {
          const name = lang === 'en' ? p.name_en : p.name_th;
          return name.toLowerCase().includes(onSearch.toLowerCase());
        })
        .sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price;
          return b.id - a.id;
        }),
    [lang, maxPrice, onSearch, selectedCategory, sortBy],
  );

  return (
    <section style={{ padding: '34px 24px 48px', maxWidth: 1440, margin: '0 auto' }} className="shop-store-shell">
      <div style={{ display: 'flex', gap: 24 }}>
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onBack={onBack}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <section className="shop-hero-block">
            <div style={{ maxWidth: 820 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className="shop-hero-chip">{tr.featured}</span>
                <span className="shop-hero-chip">{tr.featuredDrop}</span>
                <span className="shop-hero-chip">{tr.viewAll}</span>
              </div>
              <h1 style={{ margin: 0, color: 'var(--shop-text)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.1 }}>
                {tr.heroTitle[0]} {tr.heroTitle[1]}
              </h1>
              <p style={{ margin: '12px 0 0', color: 'var(--shop-muted)', fontSize: 18, lineHeight: 1.6, maxWidth: 760 }}>
                {tr.heroSub}
              </p>
            </div>
          </section>

          <div className="shop-status-strip" aria-label="Store status">
            <span>{tr.filterTitle}</span>
            <span>{tr.sortBy}</span>
            <span>{tr.priceRange}: ฿0 - ฿{maxPrice.toLocaleString()}</span>
          </div>
          <div style={{ margin: '14px 0 18px', color: 'var(--shop-muted)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {filtered.length} {tr.featured}
          </div>
          <ProductGrid items={filtered} />
        </div>
      </div>
    </section>
  );
}
