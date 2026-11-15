export const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const discount = (p) => (p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0)
export async function loadCatalog() {
  const r = await fetch('/catalog.json', { cache: 'no-cache' })
  if (!r.ok) throw new Error('Could not load the catalogue')
  return r.json()
}
// Lowest live offer price wins; original price becomes the struck-through MRP.
export function applyOffers(products, offers = []) {
  const live = offers.filter((o) => o.active)
  return products.map((p) => {
    let q = { ...p, vars: p.vars || [], tags: p.tags || '' }
    for (const o of live) {
      const s = Number(o.items?.[p.id])
      if (s > 0 && s < q.price) q = { ...q, mrp: Math.max(q.mrp, q.price), price: s, offer: o.name }
    }
    return q
  })
}
