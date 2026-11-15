import { fmt } from './catalog'
export const waLink = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`
export function buildOrder(lines, t, code, c) {
  let m = 'Hi, I would like to place an order:\n\n'
  lines.forEach((l, i) => { m += `${i + 1}. ${l.product.name}${l.v ? ` (${l.v})` : ''}\n   Qty: ${l.q}\n   Price: ${fmt(l.product.price)}${l.q > 1 ? ' each' : ''}\n\n` })
  m += `Subtotal: ${fmt(t.sub)}\n`
  if (t.discount) m += `Discount (${code}): −${fmt(t.discount)}\n`
  m += `Shipping: ${t.shipping ? fmt(t.shipping) : 'Free'}\nTotal: ${fmt(t.total)}\n\n`
  m += `Name: ${c.n}\nPhone: ${c.ph}\nAddress: ${[c.a, c.ci, c.st, c.pin].filter(Boolean).join(', ')}\n\nPlease let me know the next steps for payment and delivery.`
  return m
}
