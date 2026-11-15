import { createContext, useContext, useMemo, useState } from 'react'
import useStored from '../hooks/useStored'
import { useCatalog } from './CatalogContext'
import { calcTotals } from '../services/pricing'
const Ctx = createContext()
export const useCart = () => useContext(Ctx)
export function CartProvider({ children }) {
  const { products, settings, coupons } = useCatalog()
  const [items, setItems] = useStored('bo_cart', []), [wish, setWish] = useStored('bo_wish', [])
  const [code, setCode] = useState(''), [open, setOpen] = useState(false)
  const lines = useMemo(() => items.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((l) => l.product), [items, products])
  const totals = useMemo(() => calcTotals(lines, code, coupons, settings), [lines, code, coupons, settings])
  const key = (id, v) => `${id}|${v || ''}`
  const add = (p, v = '', q = 1) => { const k = key(p.id, v); setItems((a) => a.some((i) => i.k === k) ? a.map((i) => i.k === k ? { ...i, q: Math.min(i.q + q, p.stock) } : i) : [...a, { k, id: p.id, v, q: Math.min(q, p.stock) }]); setOpen(true) }
  const setQty = (k, q) => setItems((a) => a.flatMap((i) => i.k !== k ? [i] : q < 1 ? [] : [{ ...i, q: Math.min(q, products.find((p) => p.id === i.id)?.stock ?? q) }]))
  const toggleWish = (id) => setWish((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id])
  const count = lines.reduce((s, l) => s + l.q, 0)
  return <Ctx.Provider value={{ lines, totals, code, setCode, add, setQty, clear: () => { setItems([]); setCode('') }, wish, toggleWish, open, setOpen, count }}>{children}</Ctx.Provider>
}
