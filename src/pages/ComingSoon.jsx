import { useEffect, useState } from 'react'
import { waLink } from '../services/whatsapp'

export default function ComingSoon() {
  const [wa, setWa] = useState('')
  useEffect(() => {
    document.title = 'Bhuvi Ornaments — Coming soon'
    fetch('/catalog.json').then((r) => r.json()).then((d) => setWa(d.settings?.wa || '')).catch(() => {})
  }, [])
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ maxWidth: 520 }}>
        <img src="/images/logo.jpg" alt="Bhuvi Ornaments" style={{ width: 140, height: 140, borderRadius: '50%', margin: '0 auto 24px' }} />
        <p className="cc" style={{ letterSpacing: '.3em', textTransform: 'uppercase' }}>Jewellery for every you</p>
        <h1 style={{ fontSize: 'clamp(40px, 9vw, 64px)', margin: '8px 0 14px' }}>Coming soon</h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 28px' }}>
          We're putting the finishing touches on our collection of anti-tarnish, gold-plated, pearl and temple jewellery. Message us on WhatsApp to get in touch.
        </p>
        {wa && <a className="btn wa" target="_blank" rel="noopener noreferrer" href={waLink(wa, 'Hi, I would like to know when Bhuvi Ornaments launches.')}>Chat on WhatsApp</a>}
      </div>
    </main>
  )
}