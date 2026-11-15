import { Link, useNavigate } from 'react-router-dom'
import ProductArt from './ProductArt'
import PriceTag from './PriceTag'
import { discount } from '../services/catalog'
import { useCart } from '../context/CartContext'
export default function ProductCard({ p }) {
  const { add, wish, toggleWish } = useCart(), nav = useNavigate(), d = discount(p), w = wish.includes(p.id), out = p.stock <= 0
  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className="art" style={{ display: 'block' }}><ProductArt p={p} /></Link>
      {out ? <span className="tag out">Sold out</span> : p.stock <= 3 ? <span className="tag">Only {p.stock} left</span> : (p.offer || d > 0) && <span className="tag">{p.offer || `${d}% off`}</span>}
      <button className={`wl ${w ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Wishlist">{w ? '♥' : '♡'}</button>
      <h3><Link to={`/product/${p.id}`} className="lk">{p.name}</Link></h3>
      <div className="cc">{p.cat}</div>
      <PriceTag p={p} />
      <button className="btn" disabled={out} onClick={() => (p.vars.length ? nav(`/product/${p.id}`) : add(p))}>{out ? 'Sold out' : p.vars.length ? 'Choose option' : 'Add to cart'}</button>
    </article>
  )
}
