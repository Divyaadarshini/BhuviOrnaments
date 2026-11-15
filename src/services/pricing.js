import { fmt } from './catalog'
export function calcTotals(lines, code, coupons, settings) {
  const sub = lines.reduce((s, l) => s + l.product.price * l.q, 0)
  let discount = 0, note = ''
  const c = coupons[code]
  if (c) { if (sub < (c.min || 0)) note = `Add ${fmt(c.min - sub)} more to use ${code}`; else discount = c.t === 'p' ? Math.min((sub * c.v) / 100, c.max || Infinity) : c.v }
  const after = Math.max(sub - discount, 0)
  const shipping = !sub || after >= settings.free ? 0 : settings.ship
  return { sub, discount, shipping, total: after + shipping, note }
}
