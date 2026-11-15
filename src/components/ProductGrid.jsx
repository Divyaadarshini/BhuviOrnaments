import ProductCard from './ProductCard'
export default function ProductGrid({ products, empty }) {
  return <div className="grid">{products.length ? products.map((p) => <ProductCard key={p.id} p={p} />) : empty}</div>
}
