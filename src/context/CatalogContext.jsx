import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadCatalog, applyOffers } from '../services/catalog'
const Ctx = createContext()
export const useCatalog = () => useContext(Ctx)
export function CatalogProvider({ children }) {
  const [raw, setRaw] = useState(null), [error, setError] = useState('')
  useEffect(() => { loadCatalog().then(setRaw).catch((e) => setError(e.message)) }, [])
  const value = useMemo(() => raw ? { ready: true, settings: raw.settings, coupons: raw.coupons || {}, offers: (raw.offers || []).filter((o) => o.active), products: applyOffers(raw.products, raw.offers) } : { ready: false, error }, [raw, error])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
