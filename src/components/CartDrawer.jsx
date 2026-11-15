import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import ProductArt from './ProductArt'
import { fmt } from '../services/catalog'
import { buildOrder, waLink } from '../services/whatsapp'
import useStored from '../hooks/useStored'
export default function CartDrawer() {
  const { lines, totals: t, code, setCode, setQty, clear, open, setOpen } = useCart(), { coupons, settings } = useCatalog()
  const [cp, setCp] = useState(code), [c, setC] = useStored('bo_cust', {}), [err, setErr] = useState(''), close = () => setOpen(false)
  const f = (k) => ({ value: c[k] || '', onChange: (e) => setC({ ...c, [k]: e.target.value }) })
  const apply = () => { const k = cp.trim().toUpperCase(); if (coupons[k]) { setCode(k); setErr('') } else { setCode(''); setErr('Coupon not valid') } }
  const checkout = () => {
    if (!(c.n || '').trim()) return setErr('Please enter your name.')
    if (!/^[6-9]\d{9}$/.test((c.ph || '').replace(/\D/g, '').slice(-10))) return setErr('Enter a valid 10-digit mobile number.')
    if ((c.a || '').trim().length < 8) return setErr('Please enter your full delivery address.')
    setErr(''); window.open(waLink(settings.wa, buildOrder(lines, t, code, c)), '_blank')
  }
  return (<>
    <div className={`ov ${open ? 'open' : ''}`} onClick={close} />
    <aside className={`drawer ${open ? 'open' : ''}`} aria-label="Cart">
      <header><h2 style={{ fontSize: 26 }}>Your cart</h2><button className="ic" onClick={close}>Close</button></header>
      <div className="dbody">
        {!lines.length ? <div className="empty"><h3>Your cart is empty</h3><p>Pieces you add will wait here.</p><button className="btn" onClick={close}>Continue shopping</button></div>
          : lines.map((l) => (
            <div className="li" key={l.k}><div className="art"><ProductArt p={l.product} /></div>
              <div><b>{l.product.name}</b><div className="cc">{l.v || l.product.cat}</div>
                <div className="q"><button onClick={() => setQty(l.k, l.q - 1)}>−</button><span>{l.q}</span><button onClick={() => setQty(l.k, l.q + 1)}>+</button></div></div>
              <div style={{ textAlign: 'right' }}>{fmt(l.product.price * l.q)}<br /><button className="lnk" onClick={() => setQty(l.k, 0)}>Remove</button></div></div>))}
      </div>
      {!!lines.length && <div className="dfoot">
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}><input placeholder="Coupon code" value={cp} onChange={(e) => setCp(e.target.value)} style={{ flex: 1 }} /><button className="btn ghost" style={{ padding: '8px 16px' }} onClick={apply}>Apply</button></div>
        {t.note && <div className="cc" style={{ color: 'var(--warn)' }}>{t.note}</div>}
        <div className="row"><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
        {t.discount > 0 && <div className="row"><span>Discount ({code})</span><span>−{fmt(t.discount)}</span></div>}
        <div className="row"><span>Shipping</span><span>{t.shipping ? fmt(t.shipping) : 'Free'}</span></div>
        <div className="row t"><span>Total</span><span>{fmt(t.total)}</span></div>
        <div className="f"><input placeholder="Your name *" {...f('n')} /><input placeholder="Phone *" inputMode="tel" {...f('ph')} /><input className="w" placeholder="Delivery address *" {...f('a')} /><input placeholder="City" {...f('ci')} /><input placeholder="State" {...f('st')} /><input placeholder="Pincode" inputMode="numeric" {...f('pin')} /></div>
        {err && <div className="cc" style={{ color: 'var(--err)' }}>{err}</div>}
        <button className="btn wa" style={{ width: '100%' }} onClick={checkout}>Checkout via WhatsApp</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><button className="lnk" onClick={close}>Continue shopping</button><button className="lnk" onClick={clear}>Clear cart</button></div>
      </div>}
    </aside></>)
}
