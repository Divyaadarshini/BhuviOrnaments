// Placeholder artwork. If a product has an `img` path in catalog.json, the photo is used instead.
const cols = [['#EFE6CF', '#2E4420'], ['#E6EBD5', '#2E4420'], ['#F3E3B8', '#2E4420'], ['#F1EAD9', '#8A6A14']]
export default function ProductArt({ p }) {
  if (p.img) return <img src={p.img} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  const [bg, fg] = cols[[...p.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 4], g = '#C39A2B', c = p.cat
  let s
  if (c === 'Necklaces' || c === 'Bridal') s = <><path d="M45 55Q100 185 155 55" fill="none" stroke={g} strokeWidth="3" />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={62 + i * 19} cy={[100, 124, 132, 124, 100][i]} r="6" fill={fg} />)}<path d="M100 138l7 12-7 12-7-12z" fill={g} /></>
  else if (c === 'Earrings') s = [68, 132].map((x) => <g key={x}><circle cx={x} cy="60" r="8" fill={g} /><path d={`M${x - 22} 100Q${x} 66 ${x + 22} 100L${x + 26} 138H${x - 26}z`} fill={fg} opacity=".85" /><circle cx={x} cy="150" r="5" fill={g} /></g>)
  else if (c === 'Rings') s = <><circle cx="100" cy="112" r="42" fill="none" stroke={g} strokeWidth="8" /><path d="M100 46l16 20-16 22-16-22z" fill={fg} /></>
  else if (c === 'Bangles') s = [52, 40, 28].map((r) => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={g} strokeWidth={r / 5} />)
  else s = <><ellipse cx="100" cy="100" rx="52" ry="40" fill="none" stroke={g} strokeWidth="3" />{[...Array(8)].map((_, i) => <circle key={i} cx={100 + 52 * Math.cos(i * 0.785)} cy={100 + 40 * Math.sin(i * 0.785)} r="5" fill={fg} />)}</>
  return <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label={p.name}><rect width="200" height="200" fill={bg} />{s}</svg>
}
