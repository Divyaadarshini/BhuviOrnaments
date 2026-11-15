// import { useEffect, useState } from 'react'
// import { waLink } from '../services/whatsapp'

// export default function ComingSoon() {
//   const [wa, setWa] = useState('')
//   useEffect(() => {
//     document.title = 'Bhuvi Ornaments — Coming soon'
//     fetch('/catalog.json').then((r) => r.json()).then((d) => setWa(d.settings?.wa || '')).catch(() => {})
//   }, [])
//   return (
//     <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <img src="/images/banner.jpeg" alt="Bhuvi Ornaments — jewellery for every you"
//         style={{ width: '100%', aspectRatio: '16 / 6', maxHeight: 400, objectFit: 'cover' }} />
//       <div style={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
//         <div style={{ maxWidth: 550 }}>
//           <h1 style={{ fontSize: 'clamp(40px, 9vw, 64px)', margin: '0 0 14px' }}>Coming soon</h1>
//           <p style={{ color: 'var(--muted)', margin: '0 0 28px' }}>
//             We're putting the finishing touches on our collection of anti tarnish, gold-plated, pearl and temple jewellery. Message us on WhatsApp to ask get in touch.
//           </p>
//           {wa && <a className="btn wa" target="_blank" rel="noopener noreferrer" href={waLink(wa, 'Hi, I would like to place an order.')}>WhatsApp</a>}
//         </div>
//       </div>
//     </main>
//   )
// }



import { useEffect, useState } from 'react'
import { waLink } from '../services/whatsapp'

export default function ComingSoon() {
  const [wa, setWa] = useState('')
  useEffect(() => {
    document.title = 'Bhuvi Ornaments — Coming soon'
    fetch('/catalog.json').then((r) => r.json()).then((d) => setWa(d.settings?.wa || '')).catch(() => {})
  }, [])
  return (
    <main className="cs">
      <img className="cs-banner" src="/images/banner.jpeg" alt="Bhuvi Ornaments — jewellery for every you" />
      <div className="cs-body">
        <h1>Coming soon</h1>
        <p>We're putting the finishing touches on our collection of anti tarnish, gold-plated, pearl and temple jewellery. Message us on WhatsApp to ask get in touch.</p>
        {wa && <a className="btn wa" target="_blank" rel="noopener noreferrer" href={waLink(wa, 'Hi, I would like to enquire about the products.')}>WhatsApp</a>}
      </div>
    </main>
  )
}