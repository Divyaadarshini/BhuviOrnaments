import { useState } from 'react'
import { useAdmin } from '../AdminContext'
import { adminApi } from '../adminApi'
export default function Publish() {
  const { data, replace, reload } = useAdmin(), [txt, setTxt] = useState(JSON.stringify(data, null, 2)), [msg, setMsg] = useState('')
  return (<><h2>Publish changes</h2><p>Your edits are saved in this browser. To make them live, download <b>catalog.json</b>, replace the file in <code>public/</code>, and redeploy.</p>
    <div className="bar2"><button className="btn" onClick={() => adminApi.download(data)}>Download catalog.json</button>
      <button className="btn ghost" onClick={() => { navigator.clipboard?.writeText(txt); setMsg('Copied') }}>Copy JSON</button>
      <button className="btn dng" onClick={() => confirm('Discard unpublished changes?') && reload()}>Discard my changes</button><span className="ok">{msg}</span></div>
    <textarea rows="14" value={txt} onChange={(e) => setTxt(e.target.value)} />
    <div className="bar2"><button className="btn ghost" onClick={() => { try { replace(JSON.parse(txt)); setMsg('Loaded') } catch { setMsg('Invalid JSON') } }}>Load this JSON into admin</button></div></>)
}
