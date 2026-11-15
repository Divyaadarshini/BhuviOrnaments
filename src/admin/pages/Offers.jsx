import { useState } from 'react'
import { useAdmin } from '../AdminContext'
import { Modal, Field } from '../ui'
import { fmt } from '../../services/catalog'
function OfferForm({ offer, products, onSave, onClose }) {
  const [name, setName] = useState(offer?.name || ''), [pct, setPct] = useState(''), [err, setErr] = useState('')
  const [sel, setSel] = useState(() => Object.fromEntries(Object.entries(offer?.items || {}).map(([k, v]) => [k, String(v)])))
  const toggle = (id) => setSel((s) => { const n = { ...s }; id in n ? delete n[id] : (n[id] = ''); return n })
  const all = () => setSel(Object.keys(sel).length === products.length ? {} : Object.fromEntries(products.map((p) => [p.id, sel[p.id] || ''])))
  const applyPct = () => { const k = +pct; if (!(k > 0 && k < 100)) return setErr('Enter a discount between 1 and 99.'); setErr(''); setSel((s) => Object.fromEntries(Object.keys(s).map((id) => [id, String(Math.round(products.find((p) => p.id === id).price * (1 - k / 100)))]))) }
  const save = () => {
    const items = {}; let bad = 0
    products.forEach((p) => { if (!(p.id in sel)) return; const v = +sel[p.id]; v > 0 && v < p.price ? (items[p.id] = v) : bad++ })
    if (!name.trim()) return setErr('Give the offer a name.')
    if (bad) return setErr(`${bad} ticked product(s) need a sale price lower than the current price.`)
    if (!Object.keys(items).length) return setErr('Tick at least one product and set its sale price.')
    onSave({ id: offer?.id || `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`, name: name.trim(), active: offer ? offer.active : true, items })
  }
  return (<Modal onClose={onClose}><h2>{offer ? 'Edit' : 'New'} offer</h2>
    <div className="fm" style={{ marginTop: 12 }}><Field full label="Offer name *"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Diwali Sale" /></Field>
      <Field label="Quick discount % for ticked products"><input type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="20" /></Field><div style={{ alignSelf: 'end' }}><button className="btn ghost" onClick={applyPct}>Apply %</button></div></div>
    <p><label className="l"><input type="checkbox" checked={Object.keys(sel).length === products.length && products.length > 0} onChange={all} /> Select all products</label></p>
    <div className="sc"><table><thead><tr><th /><th>Product</th><th>Old price</th><th>New price (₹)</th></tr></thead><tbody>
      {products.map((p) => { const v = +sel[p.id], ok = v > 0 && v < p.price; return (
        <tr key={p.id}><td><input type="checkbox" checked={p.id in sel} onChange={() => toggle(p.id)} /></td><td>{p.name}</td>
          <td style={{ whiteSpace: 'nowrap' }}><span style={{ textDecoration: ok ? 'line-through' : 'none' }}>{fmt(p.price)}</span> {ok && <b className="ok">−{Math.round((1 - v / p.price) * 100)}%</b>}</td>
          <td style={{ width: 110 }}><input type="number" placeholder="Sale ₹" disabled={!(p.id in sel)} value={sel[p.id] ?? ''} onChange={(e) => setSel({ ...sel, [p.id]: e.target.value })} /></td></tr>) })}</tbody></table></div>
    <p className="er">{err}</p><div className="bar2"><button className="btn" onClick={save}>Save offer</button><button className="btn ghost" onClick={onClose}>Cancel</button></div></Modal>)
}
export default function Offers() {
  const { data, update } = useAdmin(), [edit, setEdit] = useState(null)
  const save = (o) => { update((d) => ({ ...d, offers: d.offers.some((x) => x.id === o.id) ? d.offers.map((x) => (x.id === o.id ? o : x)) : [...d.offers, o] })); setEdit(null) }
  const live = (id, a) => update((d) => ({ ...d, offers: d.offers.map((o) => (o.id === id ? { ...o, active: a } : o)) }))
  const del = (id) => confirm('Delete this offer?') && update((d) => ({ ...d, offers: d.offers.filter((o) => o.id !== id) }))
  return (<>
    <div className="bar2" style={{ justifyContent: 'space-between' }}><h2>Offers &amp; sales</h2><button className="btn" onClick={() => setEdit({})}>New offer</button></div>
    <p className="cc">Create a sale such as Diwali Sale, pick products and set new prices. Turn it off to bring back normal prices.</p>
    <div className="sc"><table><thead><tr><th>Offer</th><th>Products</th><th>Live</th><th /></tr></thead><tbody>
      {data.offers.map((o) => <tr key={o.id}><td>{o.name}</td><td>{Object.keys(o.items).length}</td><td><input type="checkbox" checked={o.active} onChange={(e) => live(o.id, e.target.checked)} /></td>
        <td style={{ whiteSpace: 'nowrap' }}><button className="btn ghost" onClick={() => setEdit({ offer: o })}>Edit</button> <button className="btn dng" onClick={() => del(o.id)}>Delete</button></td></tr>)}
      {!data.offers.length && <tr><td colSpan="4">No offers yet.</td></tr>}</tbody></table></div>
    {edit && <OfferForm offer={edit.offer} products={data.products} onSave={save} onClose={() => setEdit(null)} />}</>)
}
