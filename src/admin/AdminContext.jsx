import { createContext, useContext, useEffect, useState } from 'react'
import { adminApi } from './adminApi'
const Ctx = createContext()
export const useAdmin = () => useContext(Ctx)
export function AdminProvider({ children }) {
  const [data, setData] = useState(null)
  useEffect(() => { adminApi.load().then(setData) }, [])
  const update = (fn) => setData((d) => { const n = fn(d); adminApi.save(n); return n })
  const reload = () => { adminApi.discard(); setData(null); adminApi.load().then(setData) }
  if (!data) return <div className="empty">Loading…</div>
  return <Ctx.Provider value={{ data, update, reload, replace: (d) => update(() => d) }}>{children}</Ctx.Provider>
}
