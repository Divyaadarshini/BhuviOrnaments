import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
export default function Header() {
  const { count, wish, setOpen } = useCart(), [menu, setMenu] = useState(false), [q, setQ] = useState(''), nav = useNavigate()
  const go = (e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q)}`); setMenu(false) }
  return (
    <header><div className="wrap bar">
      <Link className="logo" to="/"><img src="/images/logo.png" alt="Bhuvi Ornaments logo" /><b>Bhuvi Ornaments</b></Link>
      <nav className={menu ? 'open' : ''} onClick={() => setMenu(false)}>
        <NavLink className="nl" to="/" end>Home</NavLink><NavLink className="nl" to="/shop">Shop</NavLink><a className="nl" href="/#categories">Categories</a><a className="nl" href="/#about">Our story</a>
      </nav>
      <form onSubmit={go} style={{ marginLeft: 'auto', display: 'flex' }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search" style={{ width: 120, borderRadius: 999, padding: '7px 14px' }} /></form>
      <Link className="ic lk" to="/shop?wish=1" aria-label="Wishlist">♡ <span className="cnt">{wish.length}</span></Link>
      <button className="ic" onClick={() => setOpen(true)} aria-label="Cart">Cart <span className="cnt">{count}</span></button>
      <button className="ic" id="burger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
    </div></header>
  )
}
