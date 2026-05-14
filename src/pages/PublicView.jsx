import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/supabase'
import { CATEGORIES } from '../data/initialData'
import { useAuth } from '../App'

const css = `
  .pv-app{display:flex;height:100vh;overflow:hidden}
  .pv-sidebar{width:250px;min-width:250px;background:var(--bg1);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
  .pv-logo{padding:22px 18px 18px;border-bottom:1px solid var(--border)}
  .pv-wordmark{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:3px;color:var(--gold2);line-height:1}
  .pv-sub{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;margin-top:3px}
  .pv-badge{display:inline-flex;align-items:center;gap:5px;background:var(--gold-dim);border:1px solid rgba(232,148,10,0.2);border-radius:4px;padding:2px 8px;margin-top:7px;font-size:10px;color:var(--gold);font-family:'IBM Plex Mono',monospace;letter-spacing:1px}
  .pv-dot{width:5px;height:5px;background:var(--success);border-radius:50%;animation:pulse 2s infinite}
  .pv-stats{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:14px 16px;border-bottom:1px solid var(--border)}
  .pv-stat{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:9px 10px}
  .pv-stat-val{font-family:'IBM Plex Mono',monospace;font-size:18px;font-weight:500;color:var(--text1);line-height:1}
  .pv-stat-val.g{color:var(--gold2)}
  .pv-stat-lbl{font-size:9px;color:var(--text3);margin-top:3px;text-transform:uppercase;letter-spacing:.5px}
  .pv-sec-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:14px 16px 6px;font-family:'IBM Plex Mono',monospace}
  .pv-nav{display:flex;align-items:center;gap:9px;padding:8px 16px;cursor:pointer;transition:background .15s;border-left:2px solid transparent;font-size:13px;color:var(--text2)}
  .pv-nav:hover{background:var(--bg2);color:var(--text1)}
  .pv-nav.on{background:var(--gold-dim);border-left-color:var(--gold);color:var(--gold2)}
  .pv-nav-ct{margin-left:auto;background:var(--bg3);border:1px solid var(--border);border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;padding:1px 6px;color:var(--text3)}
  .pv-nav.on .pv-nav-ct{background:var(--gold-dim);border-color:rgba(232,148,10,.3);color:var(--gold)}
  .pv-admin-btn{margin:auto 16px 16px;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);color:var(--text2);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;text-decoration:none}
  .pv-admin-btn:hover{background:var(--gold-dim);border-color:rgba(232,148,10,.35);color:var(--gold)}
  .pv-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
  .pv-topbar{padding:0 24px;height:58px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;background:var(--bg1);flex-shrink:0}
  .pv-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--text1);white-space:nowrap}
  .pv-title span{color:var(--gold)}
  .pv-div{width:1px;height:18px;background:var(--border)}
  .pv-search-wrap{flex:1;max-width:360px;position:relative}
  .pv-search{width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text1);padding:7px 11px 7px 34px;border-radius:6px;font-size:13px;font-family:'DM Sans',sans-serif}
  .pv-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:13px;pointer-events:none}
  .pv-chips{display:flex;gap:5px;margin-left:auto}
  .pv-chip{padding:5px 11px;border-radius:5px;font-size:11px;cursor:pointer;border:1px solid var(--border);background:var(--bg2);color:var(--text2);transition:all .15s;font-family:'IBM Plex Mono',monospace}
  .pv-chip:hover{border-color:var(--border2);color:var(--text1)}
  .pv-chip.on{background:var(--gold-dim);border-color:rgba(232,148,10,.35);color:var(--gold)}
  .pv-chip.ac{background:var(--success-dim);border-color:rgba(15,181,122,.35);color:var(--success)}
  .pv-chip.rv{background:var(--warn-dim);border-color:rgba(240,165,0,.35);color:var(--warn)}
  .pv-body{flex:1;display:flex;min-height:0;overflow:hidden}
  .pv-list{flex:1;min-width:0;overflow-y:auto;padding:18px 20px}
  .pv-list-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}
  .pv-ct-lbl{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text3);letter-spacing:1px}
  .pv-card{background:var(--bg1);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-bottom:9px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
  .pv-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--border);transition:background .15s}
  .pv-card.crit::before{background:var(--danger)}
  .pv-card.high::before{background:var(--warn)}
  .pv-card.med::before{background:var(--info)}
  .pv-card:hover{border-color:var(--border2);background:var(--bg2)}
  .pv-card.sel{border-color:rgba(232,148,10,.4);background:var(--bg2)}
  .pv-card.sel::before{background:var(--gold)}
  .pv-card-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .pv-card-id{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text3);letter-spacing:1px;margin-bottom:3px}
  .pv-card-title{font-size:14px;font-weight:600;color:var(--text1);line-height:1.3}
  .pv-card-desc{font-size:12px;color:var(--text3);margin-top:5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .pv-card-ft{display:flex;align-items:center;gap:6px;margin-top:10px;flex-wrap:wrap}
  .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:500;font-family:'IBM Plex Mono',monospace;letter-spacing:.5px;white-space:nowrap}
  .b-ac{background:var(--success-dim);color:var(--success);border:1px solid rgba(15,181,122,.25)}
  .b-rv{background:var(--warn-dim);color:var(--warn);border:1px solid rgba(240,165,0,.25)}
  .b-ar{background:var(--bg3);color:var(--text3);border:1px solid var(--border)}
  .b-cr{background:var(--danger-dim);color:var(--danger);border:1px solid rgba(232,64,64,.25)}
  .b-hi{background:var(--warn-dim);color:var(--warn);border:1px solid rgba(240,165,0,.25)}
  .b-me{background:var(--info-dim);color:var(--info);border:1px solid rgba(74,142,232,.25)}
  .b-ct{background:var(--cyan-dim);color:var(--cyan);border:1px solid rgba(18,181,204,.2)}
  .b-vr{background:var(--bg3);color:var(--text2);border:1px solid var(--border)}
  .pv-owner{font-size:11px;color:var(--text3);display:flex;align-items:center;gap:5px;margin-left:auto;flex-shrink:0}
  .av-xs{width:20px;height:20px;border-radius:50%;background:var(--bg3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:var(--text2)}
  .pv-detail{width:400px;min-width:400px;background:var(--bg1);border-left:1px solid var(--border);overflow-y:auto;display:flex;flex-direction:column;transition:width .2s,min-width .2s;animation:slideIn .2s ease}
  .pv-detail.closed{width:0;min-width:0;overflow:hidden}
  .pv-dtop{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg1);z-index:5}
  .pv-did{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text3);letter-spacing:1px}
  .close-btn{width:26px;height:26px;border-radius:5px;background:var(--bg2);border:1px solid var(--border);color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .15s}
  .close-btn:hover{background:var(--bg3);color:var(--text1)}
  .pv-dbody{padding:18px;flex:1}
  .pv-dtitle{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1.5px;color:var(--text1);line-height:1.1;margin-bottom:10px}
  .pv-dbadges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px}
  .pv-ddesc{font-size:12px;color:var(--text2);line-height:1.6;background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:11px 13px;margin-bottom:16px}
  .pv-dmeta{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px}
  .pv-mi{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:9px 11px}
  .pv-ml{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;font-family:'IBM Plex Mono',monospace}
  .pv-mv{font-size:12px;color:var(--text1);font-weight:500}
  .sec-title{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px}
  .sec-title::after{content:'';flex:1;height:1px;background:var(--border)}
  .prog-lbl{display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:5px;font-family:'IBM Plex Mono',monospace}
  .prog-track{height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-bottom:16px}
  .prog-fill{height:100%;background:var(--gold);border-radius:2px;transition:width .4s ease}
  .steps-list{position:relative}
  .steps-list::before{content:'';position:absolute;left:15px;top:24px;bottom:24px;width:1px;background:var(--border);z-index:0}
  .step-item{display:flex;gap:12px;margin-bottom:10px;position:relative;cursor:pointer}
  .step-num{width:30px;height:30px;border-radius:50%;flex-shrink:0;border:1px solid var(--border);background:var(--bg1);display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;color:var(--text3);position:relative;z-index:1;transition:all .15s}
  .step-item.on .step-num{background:var(--gold);border-color:var(--gold2);color:#000;font-weight:700}
  .step-item.done .step-num{background:var(--success-dim);border-color:rgba(15,181,122,.4);color:var(--success)}
  .step-body{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:10px 12px;transition:border-color .15s}
  .step-item:hover .step-body{border-color:var(--border2)}
  .step-item.on .step-body{border-color:rgba(232,148,10,.35);background:rgba(232,148,10,.04)}
  .step-hd{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:5px}
  .step-title{font-size:12px;font-weight:600;color:var(--text1)}
  .step-dur{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--gold);background:var(--gold-dim);border:1px solid rgba(232,148,10,.2);border-radius:3px;padding:1px 6px;white-space:nowrap}
  .step-dept{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--cyan);background:var(--cyan-dim);border:1px solid rgba(18,181,204,.15);border-radius:3px;padding:1px 6px;margin-bottom:5px;display:inline-block}
  .step-desc{font-size:11px;color:var(--text2);line-height:1.5}
  .tag-row{display:flex;gap:4px;flex-wrap:wrap;margin-top:14px}
  .tag{padding:3px 8px;border-radius:20px;font-size:10px;background:var(--bg3);border:1px solid var(--border);color:var(--text3);font-family:'IBM Plex Mono',monospace}
  .pv-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 24px;text-align:center}
  .pv-empty-ico{font-size:42px;margin-bottom:14px;opacity:.2}
  .pv-empty-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--text2);margin-bottom:6px}
  .pv-empty-sub{font-size:12px;color:var(--text3);line-height:1.5}
  .amend-item{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:10px 12px;margin-bottom:8px}
  .amend-ver{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--gold);margin-bottom:3px}
  .amend-sum{font-size:12px;color:var(--text1);margin-bottom:4px}
  .amend-meta{font-size:10px;color:var(--text3)}
`

function getInitials(name) {
  return name?.split(' ').map(p => p[0]).join('').toUpperCase() || '?'
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function getCatLabel(cat) {
  return CATEGORIES.find(c => c.id === cat)?.label || cat
}

function StatusBadge({ s }) {
  if (s === 'active') return <span className="badge b-ac">● ACTIVE</span>
  if (s === 'under_review') return <span className="badge b-rv">◐ REVIEW</span>
  return <span className="badge b-ar">○ ARCHIVED</span>
}
function PriBadge({ p }) {
  if (p === 'critical') return <span className="badge b-cr">▲ CRITICAL</span>
  if (p === 'high') return <span className="badge b-hi">↑ HIGH</span>
  return <span className="badge b-me">→ MEDIUM</span>
}

export default function PublicView() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [sops, setSops] = useState([])
  const [teams, setTeams] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [statusF, setStatusF] = useState('all')
  const [selected, setSelected] = useState(null)
  const [activeStep, setActiveStep] = useState(null)
  const [done, setDone] = useState({})
  const [amendments, setAmendments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([db.getSops(), db.getTeams()]).then(([s, t]) => {
      setSops(s)
      setTeams(t)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selected) db.getAmendments(selected.id).then(setAmendments)
  }, [selected])

  const filtered = sops.filter(s => {
    if (category !== 'all' && s.category !== category) return false
    if (statusF === 'active' && s.status !== 'active') return false
    if (statusF === 'under_review' && s.status !== 'under_review') return false
    if (search) {
      const q = search.toLowerCase()
      const tags = Array.isArray(s.tags) ? s.tags : []
      return s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) ||
        tags.some(t => t.toLowerCase().includes(q)) || (s.description || '').toLowerCase().includes(q)
    }
    return true
  })

  const catCounts = CATEGORIES.map(c => ({
    ...c,
    count: c.id === 'all' ? sops.length : sops.filter(s => s.category === c.id).length,
  }))

  const getProgress = (sop) => {
    if (!sop?.steps?.length) return 0
    const d = sop.steps.filter(s => done[`${sop.id}-${s.id}`]).length
    return Math.round((d / sop.steps.length) * 100)
  }

  const teamName = (tid) => teams.find(t => t.id === tid)?.name || '—'

  return (
    <>
      <style>{css}</style>
      <div className="pv-app">
        {/* SIDEBAR */}
        <aside className="pv-sidebar">
          <div className="pv-logo">
            <div className="pv-wordmark">XHIPMENT</div>
            <div className="pv-sub">Freight Forwarding Intelligence</div>
            <div className="pv-badge">
              <span className="pv-dot" />SOP PORTAL
            </div>
          </div>
          <div className="pv-stats">
            <div className="pv-stat"><div className="pv-stat-val g">{sops.length}</div><div className="pv-stat-lbl">Total SOPs</div></div>
            <div className="pv-stat"><div className="pv-stat-val">{sops.filter(s => s.status === 'active').length}</div><div className="pv-stat-lbl">Active</div></div>
            <div className="pv-stat"><div className="pv-stat-val">{sops.filter(s => s.status === 'under_review').length}</div><div className="pv-stat-lbl">In Review</div></div>
            <div className="pv-stat"><div className="pv-stat-val">{teams.length}</div><div className="pv-stat-lbl">Teams</div></div>
          </div>
          <div className="pv-sec-lbl">Operations</div>
          {catCounts.map(c => (
            <div key={c.id} className={`pv-nav${category === c.id ? ' on' : ''}`} onClick={() => { setCategory(c.id); setSelected(null) }}>
              <span style={{ fontSize: 14, width: 16, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
              <span>{c.label}</span>
              <span className="pv-nav-ct">{c.count}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          {isAdmin ? (
            <a className="pv-admin-btn" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
              ◆ Admin Dashboard
            </a>
          ) : (
            <a className="pv-admin-btn" onClick={() => navigate('/admin/login')} style={{ cursor: 'pointer' }}>
              ⚙ Admin Login
            </a>
          )}
        </aside>

        {/* MAIN */}
        <main className="pv-main">
          <div className="pv-topbar">
            <div className="pv-title">
              {category === 'all' ? <>ALL <span>PROCEDURES</span></> : getCatLabel(category).toUpperCase()}
            </div>
            <div className="pv-div" />
            <div className="pv-search-wrap">
              <span className="pv-search-ico">⌕</span>
              <input className="pv-search" placeholder="Search SOPs, tags, IDs..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="pv-chips">
              <div className={`pv-chip${statusF === 'all' ? ' on' : ''}`} onClick={() => setStatusF('all')}>ALL</div>
              <div className={`pv-chip${statusF === 'active' ? ' ac' : ''}`} onClick={() => setStatusF(statusF === 'active' ? 'all' : 'active')}>ACTIVE</div>
              <div className={`pv-chip${statusF === 'under_review' ? ' rv' : ''}`} onClick={() => setStatusF(statusF === 'under_review' ? 'all' : 'under_review')}>REVIEW</div>
            </div>
          </div>

          <div className="pv-body">
            <div className="pv-list">
              <div className="pv-list-hd">
                <div className="pv-ct-lbl">SHOWING {filtered.length} OF {sops.length} PROCEDURES</div>
              </div>
              {loading && <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: 40 }}>Loading...</div>}
              {!loading && filtered.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: 40 }}>No procedures match your filters.</div>}
              {filtered.map(sop => {
                const tags = Array.isArray(sop.tags) ? sop.tags : []
                const steps = Array.isArray(sop.steps) ? sop.steps : []
                return (
                  <div key={sop.id} className={`pv-card ${sop.priority === 'critical' ? 'crit' : sop.priority === 'high' ? 'high' : 'med'}${selected?.id === sop.id ? ' sel' : ''}`} onClick={() => setSelected(sop)}>
                    <div className="pv-card-hd">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="pv-card-id">{sop.id} · {sop.version}</div>
                        <div className="pv-card-title">{sop.title}</div>
                        <div className="pv-card-desc">{sop.description}</div>
                      </div>
                      <div className="pv-owner">
                        <div className="av-xs">{getInitials(sop.owner)}</div>
                        <span>{sop.owner?.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="pv-card-ft">
                      <StatusBadge s={sop.status} />
                      <PriBadge p={sop.priority} />
                      <span className="badge b-ct">{getCatLabel(sop.category)}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{steps.length} steps</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{fmtDate(sop.updated_at)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* DETAIL PANEL */}
            <div className={`pv-detail${selected ? '' : ' closed'}`}>
              {selected ? (() => {
                const steps = Array.isArray(selected.steps) ? selected.steps : []
                const tags = Array.isArray(selected.tags) ? selected.tags : []
                const prog = getProgress(selected)
                return (
                  <>
                    <div className="pv-dtop">
                      <div className="pv-did">{selected.id} · {selected.version}</div>
                      <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
                    </div>
                    <div className="pv-dbody">
                      <div className="pv-dtitle">{selected.title}</div>
                      <div className="pv-dbadges">
                        <StatusBadge s={selected.status} />
                        <PriBadge p={selected.priority} />
                        <span className="badge b-ct">{getCatLabel(selected.category)}</span>
                      </div>
                      <div className="pv-ddesc">{selected.description}</div>
                      <div className="pv-dmeta">
                        <div className="pv-mi"><div className="pv-ml">Owner</div><div className="pv-mv" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div className="av-xs" style={{ width: 22, height: 22, fontSize: 8 }}>{getInitials(selected.owner)}</div>{selected.owner}</div></div>
                        <div className="pv-mi"><div className="pv-ml">Team</div><div className="pv-mv">{teamName(selected.team_id)}</div></div>
                        <div className="pv-mi"><div className="pv-ml">Version</div><div className="pv-mv" style={{ fontFamily: 'IBM Plex Mono', color: 'var(--gold)' }}>{selected.version}</div></div>
                        <div className="pv-mi"><div className="pv-ml">Updated</div><div className="pv-mv">{fmtDate(selected.updated_at)}</div></div>
                      </div>

                      <div className="prog-lbl"><span>EXECUTION PROGRESS</span><span style={{ color: 'var(--gold)' }}>{prog}%</span></div>
                      <div className="prog-track"><div className="prog-fill" style={{ width: `${prog}%` }} /></div>

                      <div className="sec-title">PROCEDURE STEPS</div>
                      <div className="steps-list">
                        {steps.map(step => {
                          const isDone = done[`${selected.id}-${step.id}`]
                          const isOn = activeStep === step.id
                          return (
                            <div key={step.id} className={`step-item${isOn ? ' on' : ''}${isDone ? ' done' : ''}`} onClick={() => setActiveStep(p => p === step.id ? null : step.id)}>
                              <div className="step-num" onClick={e => { e.stopPropagation(); setDone(p => ({ ...p, [`${selected.id}-${step.id}`]: !p[`${selected.id}-${step.id}`] })) }} title="Mark complete">
                                {isDone ? '✓' : step.id}
                              </div>
                              <div className="step-body">
                                <div className="step-hd">
                                  <div className="step-title" style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1 }}>{step.title}</div>
                                  <div className="step-dur">{step.duration}</div>
                                </div>
                                <div className="step-dept">{step.dept}</div>
                                {isOn && <div className="step-desc">{step.desc}</div>}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {tags.length > 0 && (
                        <div className="tag-row">{tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>
                      )}

                      {amendments.length > 0 && (
                        <>
                          <div className="sec-title" style={{ marginTop: 18 }}>AMENDMENT HISTORY</div>
                          {amendments.map(a => (
                            <div key={a.id} className="amend-item">
                              <div className="amend-ver">{a.version} — {fmtDate(a.created_at)}</div>
                              <div className="amend-sum">{a.change_summary}</div>
                              <div className="amend-meta">By {a.changed_by}</div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </>
                )
              })() : null}

              {!selected && (
                <div className="pv-empty">
                  <div className="pv-empty-ico">⊞</div>
                  <div className="pv-empty-title">Select a Procedure</div>
                  <div className="pv-empty-sub">Click any SOP card to view full details, steps, and amendment history.</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
