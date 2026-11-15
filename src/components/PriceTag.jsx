import { fmt, discount } from '../services/catalog'
export default function PriceTag({ p, big }) {
  const d = discount(p)
  return <div className="pr"><b style={big ? { fontSize: 22 } : null}>{fmt(p.price)}</b>{d > 0 && <><s>{fmt(p.mrp)}</s><em>{d}% off</em></>}</div>
}
