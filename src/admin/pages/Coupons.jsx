import { useState } from 'react'
import { useAdmin } from '../AdminContext'
import { Field } from '../ui'
import { fmt } from '../../services/catalog'
export default function Coupons() {
  const { data, update } = useAdmin(), [f, setF] = useState({ k: '', t: 'p', v: '', min: 0, max: '' }), [err, setErr] = useState('')
  const s = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) })
  const add = () => { const k = f.k.trim().toUpperCase(); if (!k || !(+f.v > 0)) return setErr('Enter a code and a value.'); setErr(''); update((d) => ({ ...d, coupons: { ...d.coupons, [k]: { t: f.t, v: +f.v, min: +f.min || 0, max: +f.max || 0 } } })); setF({ k: '', t: 'p', v: '', min: 0, max: '' }) }
  const del = (k) => update((d) => { const c = { ...d.coupons }; delete c[k]; return { ...d, coupons: c } })
  return (<><h2>Coupons</h2><div className="sc" style={{ marginTop: 12 }}><table><thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min order</th><th /></tr></thead><tbody>
    {Object.entries(data.coupons).map(([k, c]) => <tr key={k}><td>{k}</td><td>{c.t === 'p' ? 'Percent' : 'Fixed'}</td><td>{c.v}{c.t === 'p' ? '%' : ' ₹'}</td><td>{fmt(c.min || 0)}</td><td><button className="btn dng" onClick={() => del(k)}>Delete</button></td></tr>)}</tbody></table></div>
    <h2 style={{ fontSize: 22, margin: '20px 0 10px' }}>New coupon</h2><div className="fm"><Field label="Code"><input {...s('k')} /></Field><Field label="Type"><select {...s('t')}><option value="p">Percent</option><option value="f">Fixed ₹</option></select></Field>
      <Field label="Value"><input type="number" {...s('v')} /></Field><Field label="Minimum order"><input type="number" {...s('min')} /></Field><Field label="Max discount (percent only)"><input type="number" {...s('max')} /></Field></div>
    <p className="er">{err}</p><button className="btn" onClick={add}>Add coupon</button></>)
}
