import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import ProductArt from '../components/ProductArt'
import PriceTag from '../components/PriceTag'
import { fmt } from '../services/catalog'
import { waLink } from '../services/whatsapp'
export default function Product() {
  const { id } = useParams(), { products, settings } = useCatalog(), { add, wish, toggleWish } = useCart()
  const p = products.find((x) => x.id === id), [v, setV] = useState(''), [q, setQ] = useState(1)
  useEffect(() => { setV(p?.vars[0] || ''); setQ(1); if (p) document.title = `${p.name} — Bhuvi Ornaments` }, [id, p?.name])
  if (!p) return <div className="wrap empty"><h2>We couldn’t find that piece</h2><Link className="btn" to="/shop">Back to shop</Link></div>
  const msg = `Hi, I would like to order:\n${p.name}${v ? ` (${v})` : ''}\nQty: ${q}\nPrice: ${fmt(p.price)}\n\nPlease share the next steps.`
  const out = p.stock <= 0
  return (
    <div className="wrap" style={{ padding: '28px 20px 60px', display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
      <div className="art" style={{ aspectRatio: '1', overflow: 'hidden' }}><ProductArt p={p} /></div>
      <div>
        <div className="cc"><Link to={`/shop/${p.cat.toLowerCase()}`} className="lk">{p.cat}</Link> · SKU {p.sku}</div>
        <h1 style={{ fontSize: 38, margin: '4px 0' }}>{p.name}</h1><PriceTag p={p} big />
        <p>{p.desc}</p>
        <div className="cc" style={{ color: out ? 'var(--err)' : p.stock > 3 ? 'var(--ok)' : 'var(--warn)' }}>{out ? 'Out of stock' : p.stock > 3 ? 'In stock' : `Only ${p.stock} left`}</div>
        {p.vars.length > 0 && <div className="opts">{p.vars.map((x) => <button key={x} className={`chip ${v === x ? 'on' : ''}`} onClick={() => setV(x)}>{x}</button>)}</div>}
        <div className="q" style={{ margin: '12px 0 14px' }}><button onClick={() => setQ(Math.max(1, q - 1))}>−</button><span>{q}</span><button onClick={() => setQ(Math.min(p.stock || 1, q + 1))}>+</button></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" disabled={out} onClick={() => add(p, v, q)}>Add to cart</button>
          <a className="btn wa" target="_blank" rel="noopener noreferrer" href={waLink(settings.wa, msg)}>Order on WhatsApp</a>
          <button className="btn ghost" onClick={() => toggleWish(p.id)}>{wish.includes(p.id) ? '♥ Saved' : '♡ Save'}</button>
        </div>
        <div style={{ marginTop: 22 }}>
          <details open><summary>Product details</summary><p>SKU {p.sku}. Hand-checked before dispatch.</p></details>
          <details><summary>Materials</summary><p>{p.mat}</p></details>
          <details><summary>Care instructions</summary><p>Keep dry, store in the pouch, and apply perfume before wearing.</p></details>
          <details><summary>Shipping information</summary><p>Ships within 2 business days. Free above {fmt(settings.free)}.</p></details>
          <details><summary>Return / exchange</summary><p>Exchange within 7 days for unused items in original packaging.</p></details>
        </div>
      </div>
    </div>)
}
