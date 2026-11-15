import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import Section from '../components/Section'
import ProductGrid from '../components/ProductGrid'
export default function Shop() {
  const { cat } = useParams(), [sp] = useSearchParams(), { products, settings } = useCatalog(), { wish } = useCart()
  const q = (sp.get('q') || '').toLowerCase().trim(), [sort, setSort] = useState('new'), [max, setMax] = useState(1e9), [n, setN] = useState(8)
  useEffect(() => { setN(8); document.title = `${cat ? cat[0].toUpperCase() + cat.slice(1) : 'Shop'} — Bhuvi Ornaments` }, [cat, q])
  const list = products.filter((p) => (!cat || p.cat.toLowerCase() === cat) && p.price <= max && (!sp.get('wish') || wish.includes(p.id)) && (!q || [p.name, p.cat, p.desc, p.tags, p.sku].join(' ').toLowerCase().includes(q)))
    .sort((a, b) => sort === 'lo' ? a.price - b.price : sort === 'hi' ? b.price - a.price : sort === 'pop' ? b.best - a.best : b.isNew - a.isNew)
  return (
    <Section title={sp.get('wish') ? 'Your wishlist' : cat ? cat[0].toUpperCase() + cat.slice(1) : 'The collection'} aside={`${list.length} pieces`}>
      <div className="tools"><Link to="/shop" className={`chip lk ${!cat ? 'on' : ''}`}>All</Link>{settings.cats.map((c) => <Link key={c} to={`/shop/${c.toLowerCase()}`} className={`chip lk ${cat === c.toLowerCase() ? 'on' : ''}`}>{c}</Link>)}</div>
      <div className="tools">
        <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="new">Newest</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option><option value="pop">Popularity</option></select>
        <select value={max} onChange={(e) => setMax(+e.target.value)}><option value={1e9}>Any price</option><option value={1000}>Under ₹1,000</option><option value={2000}>Under ₹2,000</option><option value={5000}>Under ₹5,000</option></select>
      </div>
      <ProductGrid products={list.slice(0, n)} empty={<div className="empty"><h3>{q ? `Nothing matched “${q}”` : 'Nothing here yet'}</h3><p>Try a shorter word, or browse all pieces.</p><Link className="btn ghost" to="/shop">Clear filters</Link></div>} />
      {list.length > n && <div style={{ textAlign: 'center', marginTop: 30 }}><button className="btn ghost" onClick={() => setN(n + 8)}>Load more</button></div>}
    </Section>)
}
