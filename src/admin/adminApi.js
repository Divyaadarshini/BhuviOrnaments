// Admin "API" layer. Today it keeps edits in this browser and lets you export catalog.json.
// To move to a real backend later, replace load/save here; no admin screen needs to change.
const KEY = 'bo_admin', AUTH = 'bo_in'
const PASS = import.meta.env.VITE_ADMIN_PASS || 'bhuvi-admin' // convenience gate only; protect /admin on your host too
const blank = { settings: { wa: '', ship: 99, free: 999, cats: [] }, products: [], coupons: {}, offers: [] }
const norm = (d) => ({ ...blank, ...d, offers: d.offers || [], coupons: d.coupons || {} })
export const adminApi = {
  login: (p) => (p === PASS ? (sessionStorage.setItem(AUTH, '1'), true) : false),
  logout: () => sessionStorage.removeItem(AUTH),
  isAuthed: () => sessionStorage.getItem(AUTH) === '1',
  async load() {
    try { const l = JSON.parse(localStorage.getItem(KEY)); if (l) return norm(l) } catch {}
    try { return norm(await (await fetch('/catalog.json', { cache: 'no-cache' })).json()) } catch { return blank }
  },
  save: (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} },
  discard: () => localStorage.removeItem(KEY),
  download(d) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })); a.download = 'catalog.json'; a.click() },
}
