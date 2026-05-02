import { useEffect, useMemo, useState } from 'react';
import { listings } from '../../data/mockListings.js';
import { useLang } from '../../context/marketplaceLangContext.jsx';
import Navbar from '../../components/marketplace/Navbar.jsx';
import FilterSidebar from '../../components/marketplace/FilterSidebar.jsx';
import ListingGrid from '../../components/marketplace/ListingGrid.jsx';
import ListingModal from '../../components/marketplace/ListingModal.jsx';

export default function ListingsPage({ onBack }) {
  const { lang, tr } = useLang();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);

  const filtered = useMemo(
    () =>
      listings
        .filter((l) => selectedCategory === 'all' || l.category === selectedCategory)
        .filter((l) => l.price <= maxPrice)
        .filter((l) => {
          const title = lang === 'en' ? l.title_en : l.title_th;
          return title.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price;
          if (sortBy === 'rating') return b.rating - a.rating;
          return b.id - a.id;
        }),
    [lang, maxPrice, searchQuery, selectedCategory, sortBy],
  );

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') setSelectedListing(null);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onBack={onBack} />
      <main className="mx-auto mt-14 flex w-full max-w-[1440px] flex-col">
        <div className="flex flex-1 gap-6 px-8 pb-12">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#F0F0F0]">{tr.listingsCount(filtered.length)}</h2>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSortBy('newest')} className={`rounded border px-3 py-1.5 text-[13px] ${sortBy === 'newest' ? 'border-[#00FF88] text-[#00FF88]' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortNewest}</button>
                <button type="button" onClick={() => setSortBy('price')} className={`rounded border px-3 py-1.5 text-[13px] ${sortBy === 'price' ? 'border-[#00FF88] text-[#00FF88]' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortPrice}</button>
                <button type="button" onClick={() => setSortBy('rating')} className={`rounded border px-3 py-1.5 text-[13px] ${sortBy === 'rating' ? 'border-[#00FF88] text-[#00FF88]' : 'border-[#2A2A2A] text-[#888888]'}`}>{tr.sortRating}</button>
              </div>
            </div>
            <ListingGrid listings={filtered} onSelect={setSelectedListing} />
          </div>
        </div>
      </main>

      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
    </div>
  );
}
