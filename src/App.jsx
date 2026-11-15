import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { CatalogProvider, useCatalog } from './context/CatalogContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
const AdminApp = lazy(() => import('./admin/AdminApp')) // admin code is a separate chunk; customers never download it
function Shell() {
  const { pathname } = useLocation(), cat = useCatalog()
  useEffect(() => { window.scrollTo(0, 0); if (pathname === '/') document.title = 'Bhuvi Ornaments — Jewellery for every you' }, [pathname])
  if (!cat.ready) return <div className="wrap empty" style={{ padding: '30vh 0' }}>{cat.error || 'Loading…'}</div>
  return (<CartProvider>
    <Header /><main>
      <Routes><Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/shop/:cat" element={<Shop />} /><Route path="/product/:id" element={<Product />} />
        <Route path="*" element={<div className="wrap empty"><h2>Page not found</h2><Link className="btn" to="/">Go home</Link></div>} /></Routes></main>
    <footer><div className="wrap">© {new Date().getFullYear()} Bhuvi Ornaments. Jewellery for every you.</div></footer><CartDrawer />
  </CartProvider>)
}
export default function App() {
  useEffect(() => { document.title = location.pathname.startsWith('/admin') ? 'Bhuvi admin' : document.title }, [])
  return (<Routes>
    <Route path="/admin/*" element={<Suspense fallback={<div className="empty">Loading…</div>}><AdminApp /></Suspense>} />
    <Route path="*" element={<CatalogProvider><Shell /></CatalogProvider>} />
  </Routes>)
}
