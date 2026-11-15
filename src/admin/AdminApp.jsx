import { useState } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import { adminApi } from './adminApi'
import { AdminProvider } from './AdminContext'
import Products from './pages/Products'
import Offers from './pages/Offers'
import Coupons from './pages/Coupons'
import Settings from './pages/Settings'
import Publish from './pages/Publish'
import './admin.css'
export default function AdminApp() {
  const [ok, setOk] = useState(adminApi.isAuthed()), [pw, setPw] = useState(''), [err, setErr] = useState('')
  const go = (e) => { e.preventDefault(); adminApi.login(pw) ? setOk(true) : setErr('Wrong passcode.') }
  if (!ok) return (
    <form onSubmit={go} style={{ maxWidth: 340, margin: '20vh auto', padding: 20, textAlign: 'center' }}>
      <meta name="robots" content="noindex" /><h1>Bhuvi admin</h1><p className="cc">Enter the admin passcode</p>
      <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <p className="er" style={{ minHeight: 24 }}>{err}</p><button className="btn" style={{ width: '100%' }}>Log in</button></form>)
  const tabs = [['/admin', 'Products', true], ['/admin/offers', 'Offers'], ['/admin/coupons', 'Coupons'], ['/admin/settings', 'Settings'], ['/admin/publish', 'Publish']]
  return (
    <div className="adm"><div className="adm-top"><div className="wrap"><h2>Bhuvi admin</h2>
      {tabs.map(([to, l, end]) => <NavLink key={to} to={to} end={end}>{l}</NavLink>)}
      <button className="btn ghost" onClick={() => { adminApi.logout(); setOk(false) }}>Log out</button></div></div>
      <div className="wrap" style={{ padding: '20px 20px 60px' }}><AdminProvider>
        <Routes><Route index element={<Products />} /><Route path="offers" element={<Offers />} /><Route path="coupons" element={<Coupons />} /><Route path="settings" element={<Settings />} /><Route path="publish" element={<Publish />} /></Routes>
      </AdminProvider></div></div>)
}
