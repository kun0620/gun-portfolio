import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ items }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 280px))',
        gap: 24,
        justifyContent: 'start',
      }}
    >
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
