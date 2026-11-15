import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import Section from '../components/Section'
import ProductGrid from '../components/ProductGrid'
import ProductArt from '../components/ProductArt'
import { waLink } from '../services/whatsapp'
const TRUST = [['Quality jewellery', 'Checked piece by piece'], ['Secure packaging', 'Padded, tamper-safe boxes'], ['Easy WhatsApp ordering', 'No account or card needed'], ['Shipping across India', 'Delivered in 4–7 days'], ['Customer support', 'We reply within hours']]
export default function Home() {
  const { products, settings, offers } = useCatalog()
  return (<>
    <div className="hero"><img src="/images/banner.jpeg" alt="Bhuvi Ornaments — jewellery for every you" /></div>
    <div className="intro"><h1>Rooted in South India.</h1><p>Curated for moments that matter.</p>
      <Link className="btn" to="/shop">Shop now</Link> &nbsp; <a className="btn ghost" href="#categories">Explore collection</a></div>
    <Section title="Shop by category" id="categories">
      <div className="cats">{settings.cats.map((c) => <Link key={c} to={`/shop/${c.toLowerCase()}`} className="cat lk"><div className="art"><ProductArt p={products.find((p) => p.cat === c) || products[0]} /></div><span>{c}</span></Link>)}</div></Section>
    {offers.map((o) => { const ps = products.filter((p) => p.offer === o.name); return ps.length ? <Section key={o.id} title={o.name} aside="Special prices for a limited time"><ProductGrid products={ps.slice(0, 8)} /></Section> : null })}
    <Section title="New arrivals"><ProductGrid products={products.filter((p) => p.isNew).slice(0, 4)} /></Section>
    <Section title="Best sellers"><ProductGrid products={products.filter((p) => p.best).slice(0, 4)} /></Section>
    <section className="band"><div className="wrap trust">{TRUST.map(([a, b]) => <div key={a}><h3>{a}</h3><p>{b}</p></div>)}</div></section>
    <section id="about"><div className="wrap about"><h2>About Bhuvi Ornaments</h2><p>Bhuvi Ornaments began with a simple idea: everyone deserves jewellery that feels like theirs. Our pieces draw on South Indian temple work, pearls and soft gold tones, and are checked by hand and packed with care before they reach you.</p></div></section>
    <section className="cta"><div className="wrap"><h2>Found something you love?</h2><p>Message us to ask about a piece, a colour, or a custom set.</p><a className="btn wa" target="_blank" rel="noopener noreferrer" href={waLink(settings.wa, 'Hi, I would like to know more about your jewellery.')}>Chat on WhatsApp</a></div></section>
  </>)
}
