export default function Section({ title, aside, children, id }) {
  return <section id={id}><div className="wrap"><div className="head"><h2>{title}</h2>{aside && <span className="cc">{aside}</span>}</div>{children}</div></section>
}
