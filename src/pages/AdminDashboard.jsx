import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/supabase'
import { sendAmendmentNotification, emailConfigured } from '../lib/emailjs'
import { useAuth, useToast } from '../App'
import SOPEditor from '../components/SOPEditor'
import TeamManager from '../components/TeamManager'

const CSS = `
  .ad-wrap{display:flex;height:100vh;overflow:hidden;background:var(--bg0)}
  .ad-side{width:220px;min-width:220px;background:var(--bg1);border-right:1px solid var(--border);display:flex;flex-direction:column}
  .ad-side-logo{padding:20px 18px;border-bottom:1px solid var(--border)}
  .ad-side-wordmark{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:3px;color:var(--gold2)}
  .ad-side-badge{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:4px;background:rgba(232,64,64,.12);border:1px solid rgba(232,64,64,.25);font-size:9px;font-family:'IBM Plex Mono',monospace;color:var(--danger);letter-spacing:1px}
  .ad-nav{display:flex;align-items:center;gap:9px;padding:9px 16px;cursor:pointer;font-size:13px;color:var(--text2);border-left:2px solid transparent;transition:all .15s}
  .ad-nav:hover{background:var(--bg2);color:var(--text1)}
  .ad-nav.on{background:var(--gold-dim);border-left-color:var(--gold);color:var(--gold2)}
  .ad-sec-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:14px 16px 6px;font-family:'IBM Plex Mono',monospace}
  .ad-logout{margin:auto 14px 14px;padding:9px;border-radius:6px;background:var(--bg3);border:1px solid var(--border);color:var(--text3);font-size:12px;cursor:pointer;transition:all .15s;text-align:center;font-family:'DM Sans',sans-serif}
  .ad-logout:hover{border-color:var(--danger);color:var(--danger)}
  .ad-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
  .ad-topbar{height:58px;padding:0 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;background:var(--bg1);flex-shrink:0}
  .ad-page-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;color:var(--text1)}
  .ad-page-title span{color:var(--gold)}
  .ad-search{flex:1;max-width:340px;padding:7px 11px;border-radius:6px}
  .ad-actions{display:flex;gap:8px;margin-left:auto}
  .btn-gold{padding:7px 16px;border-radius:6px;background:var(--gold);border:none;color:#000;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s;white-space:nowrap}
  .btn-gold:hover{background:var(--gold2)}
  .btn-outline{padding:7px 14px;border-radius:6px;background:var(--bg2);border:1px solid var(--border2);color:var(--text2);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
  .btn-outline:hover{border-color:var(--gold);color:var(--gold)}
  .ad-content{flex:1;overflow-y:auto;padding:20px 24px}
  .sop-table{width:100%;border-collapse:collapse}
  .sop-table th{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding:8px 14px;text-align:left;border-bottom:1px solid var(--border);background:var(--bg1);position:sticky;top:0;z-index:2}
  .sop-table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text2);vertical-align:middle}
  .sop-table tr:hover td{background:var(--bg2)}
  .t-id{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--gold);letter-spacing:1px;white-space:nowrap}
  .t-title{color:var(--text1);font-weight:600}
  .t-ver{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text2)}
  .t-act{display:flex;gap:6px;align-items:center}
  .act-btn{padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid var(--border);background:var(--bg3);color:var(--text2);transition:all .15s;font-family:'DM Sans',sans-serif;white-space:nowrap}
  .act-btn:hover{border-color:var(--border2);color:var(--text1)}
  .act-btn.edit:hover{border-color:rgba(74,142,232,.4);color:var(--info)}
  .act-btn.del:hover{border-color:rgba(232,64,64,.4);color:var(--danger)}
  .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:500;font-family:'IBM Plex Mono',monospace;letter-spacing:.5px;white-space:nowrap}
  .b-ac{background:var(--success-dim);color:var(--success);border:1px solid rgba(15,181,122,.25)}
  .b-rv{background:var(--warn-dim);color:var(--warn);border:1px solid rgba(240,165,0,.25)}
  .b-ar{background:var(--bg3);color:var(--text3);border:1px solid var(--border)}
  .b-cr{background:var(--danger-dim);color:var(--danger);border:1px solid rgba(232,64,64,.25)}
  .b-hi{background:var(--warn-dim);color:var(--warn);border:1px solid rgba(240,165,0,.25)}
  .b-me{background:var(--info-dim);color:var(--info);border:1px solid rgba(74,142,232,.25)}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .stat-card{background:var(--bg1);border:1px solid var(--border);border-radius:8px;padding:16px 18px}
  .stat-val{font-family:'IBM Plex Mono',monospace;font-size:28px;font-weight:500;color:var(--text1);line-height:1}
  .stat-val.gold{color:var(--gold2)}
  .stat-lbl{font-size:11px;color:var(--text3);margin-top:5px;text-transform:uppercase;letter-spacing:.5px}
  .stat-sub{font-size:10px;color:var(--text3);margin-top:3px;font-family:'IBM Plex Mono',monospace}
  .amend-log{background:var(--bg1);border:1px solid var(--border);border-radius:8px;overflow:hidden}
  .amend-hd{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .amend-row{display:flex;align-items:flex-start;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:12px}
  .amend-row:last-child{border-bottom:none}
  .amend-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:4px}
  .amend-sop{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--gold);margin-bottom:3px}
  .amend-sum{color:var(--text1);margin-bottom:3px}
  .amend-meta{color:var(--text3);font-size:11px}
  .notif-banner{background:rgba(232,148,10,.08);border:1px solid rgba(232,148,10,.2);border-radius:7px;padding:10px 14px;margin-bottom:18px;display:flex;align-items:center;gap:10px;font-size:12px;color:var(--gold)}
  .notif-banner.warn{background:var(--warn-dim);border-color:rgba(240,165,0,.25)}
  .confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:center;justify-content:center}
  .confirm-box{background:var(--bg1);border:1px solid var(--border);border-radius:10px;padding:24px;max-width:380px;width:90%;animation:fadeIn .2s ease}
  .confirm-title{font-size:15px;font-weight:600;color:var(--text1);margin-bottom:8px}
  .confirm-msg{font-size:13px;color:var(--text2);margin-bottom:18px;line-height:1.5}
  .confirm-btns{display:flex;gap:8px;justify-content:flex-end}
`

function StatusBadge({ s }) {
  if (s === 'active') return <span className="badge b-ac">● ACTIVE</span>
  if (s === 'under_review') return <span className="badge b-rv">◐ REVIEW</span>
  return <span className="badge b-ar">○ ARCHIVED</span>
}
function PriBadge({ p }) {
  if (p === 'critical') return <span className="badge b-cr">▲ CRITICAL</span>
  if (p === 'high') return <span className="badge b-hi">↑ HIGH</span>
  return <span className="badge b-me">→ {p?.toUpperCase()}</span>
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' }

export default function AdminDashboard() {
  const { logout, session } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [page, setPage] = useState('sops')
  const [sops, setSops] = useState([])
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [amendments, setAmendments] = useState([])
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null) // null | 'new' | sopObject
  const [showTeams, setShowTeams] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const [s, t, m, a] = await Promise.all([db.getSops(), db.getTeams(), db.getMembers(), db.getAmendments()])
    setSops(s); setTeams(t); setMembers(m); setAmendments(a)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const filtered = sops.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.category?.includes(q)
  })

  const handleSave = async (payload, changeSummary) => {
    const isNew = editor === 'new'
    let saved
    if (isNew) {
      saved = await db.createSop(payload)
      toast({ type: 'success', title: 'SOP Created', message: `${payload.id} — ${payload.title} has been created.` })
    } else {
      saved = await db.updateSop(payload.id, payload)
      // Log amendment
      if (changeSummary) {
        await db.addAmendment({
          sop_id: payload.id,
          version: payload.version,
          change_summary: changeSummary,
          changed_by: session?.user?.email || 'Admin',
          notified_team_id: payload.team_id || null,
          notification_sent: false,
        })
        // Send email notifications
        const teamMembers = members.filter(m => m.team_id === payload.team_id)
        const teamObj = teams.find(t => t.id === payload.team_id)
        if (teamMembers.length > 0) {
          const result = await sendAmendmentNotification({
            sopId: payload.id, sopTitle: payload.title,
            version: payload.version, changeSummary,
            changedBy: session?.user?.email || 'Admin',
            teamName: teamObj?.name || 'Team',
            members: teamMembers,
          })
          if (emailConfigured) {
            toast({ type: 'success', title: 'Notifications Sent', message: `Emailed ${result.sent} of ${teamMembers.length} team members about this amendment.`, duration: 6000 })
          } else {
            toast({ type: 'warning', title: 'SOP Updated', message: `Amendment saved. Email notifications not sent — configure EmailJS to enable.`, duration: 6000 })
          }
        } else {
          toast({ type: 'info', title: 'Amendment Saved', message: `${payload.id} updated. No team members found to notify.` })
        }
      } else {
        toast({ type: 'success', title: 'SOP Updated', message: `${payload.id} has been updated.` })
      }
    }
    setEditor(null)
    refresh()
  }

  const handleDelete = async (sop) => {
    setConfirm({
      title: 'Delete SOP',
      message: `Are you sure you want to delete "${sop.title}" (${sop.id})? This cannot be undone.`,
      action: async () => {
        await db.deleteSop(sop.id)
        toast({ type: 'success', title: 'Deleted', message: `${sop.id} has been deleted.` })
        refresh()
      },
    })
  }

  const handleLogout = async () => { await logout(); navigate('/') }

  const adminEmail = session?.user?.email || 'Admin'

  return (
    <>
      <style>{CSS}</style>
      <div className="ad-wrap">
        {/* SIDEBAR */}
        <aside className="ad-side">
          <div className="ad-side-logo">
            <div className="ad-side-wordmark">XHIPMENT</div>
            <div style={{ fontSize: 9, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', letterSpacing: 2, marginTop: 2 }}>ADMIN PORTAL</div>
            <div className="ad-side-badge">⚙ ADMIN ACCESS</div>
          </div>
          <div style={{ padding: '10px 14px 6px', fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', letterSpacing: .5 }}>
            {adminEmail}
          </div>
          <div className="ad-sec-lbl">Management</div>
          {[
            { id: 'sops', label: 'SOP Library', icon: '☰' },
            { id: 'amendments', label: 'Amendment Log', icon: '◎' },
          ].map(n => (
            <div key={n.id} className={`ad-nav${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
              <span style={{ fontSize: 14, width: 16 }}>{n.icon}</span> {n.label}
            </div>
          ))}
          <div className="ad-nav" onClick={() => setShowTeams(true)}>
            <span style={{ fontSize: 14, width: 16 }}>◈</span> Teams & Notifications
          </div>
          <div className="ad-sec-lbl">Portal</div>
          <div className="ad-nav" onClick={() => navigate('/')}>
            <span style={{ fontSize: 14, width: 16 }}>⊞</span> View Public Portal
          </div>
          <div style={{ flex: 1 }} />
          <button className="ad-logout" onClick={handleLogout}>⎋ Sign Out</button>
        </aside>

        {/* MAIN */}
        <main className="ad-main">
          <div className="ad-topbar">
            <div className="ad-page-title">
              {page === 'sops' && <><span>SOP</span> LIBRARY</>}
              {page === 'amendments' && <><span>AMENDMENT</span> LOG</>}
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
            {page === 'sops' && (
              <>
                <input className="ad-search" placeholder="Search SOPs..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="ad-actions">
                  <button className="btn-outline" onClick={() => setShowTeams(true)}>◈ Teams</button>
                  <button className="btn-gold" onClick={() => setEditor('new')}>+ New SOP</button>
                </div>
              </>
            )}
          </div>

          <div className="ad-content">
            {!emailConfigured && (
              <div className="notif-banner warn">
                ⚠ EmailJS not configured — team notifications will not be sent. Add VITE_EMAILJS_* to your environment variables.
              </div>
            )}

            {page === 'sops' && (
              <>
                <div className="stats-row">
                  <div className="stat-card"><div className="stat-val gold">{sops.length}</div><div className="stat-lbl">Total SOPs</div></div>
                  <div className="stat-card"><div className="stat-val">{sops.filter(s => s.status === 'active').length}</div><div className="stat-lbl">Active</div><div className="stat-sub">{sops.filter(s => s.status === 'under_review').length} in review</div></div>
                  <div className="stat-card"><div className="stat-val">{sops.filter(s => s.priority === 'critical').length}</div><div className="stat-lbl">Critical Priority</div></div>
                  <div className="stat-card"><div className="stat-val">{amendments.length}</div><div className="stat-lbl">Total Amendments</div><div className="stat-sub">All time</div></div>
                </div>

                <table className="sop-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Title</th><th>Category</th><th>Version</th>
                      <th>Status</th><th>Priority</th><th>Team</th><th>Updated</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>Loading...</td></tr>
                    )}
                    {!loading && filtered.map(sop => {
                      const team = teams.find(t => t.id === sop.team_id)
                      return (
                        <tr key={sop.id}>
                          <td><div className="t-id">{sop.id}</div></td>
                          <td><div className="t-title">{sop.title}</div></td>
                          <td><span style={{ fontSize: 11, color: 'var(--cyan)', fontFamily: 'IBM Plex Mono' }}>{sop.category}</span></td>
                          <td><span className="t-ver">{sop.version}</span></td>
                          <td><StatusBadge s={sop.status} /></td>
                          <td><PriBadge p={sop.priority} /></td>
                          <td><span style={{ fontSize: 11, color: 'var(--text3)' }}>{team?.name || '—'}</span></td>
                          <td><span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'IBM Plex Mono' }}>{fmtDate(sop.updated_at)}</span></td>
                          <td>
                            <div className="t-act">
                              <button className="act-btn edit" onClick={() => setEditor(sop)}>✎ Edit</button>
                              <button className="act-btn del" onClick={() => handleDelete(sop)}>✕ Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {!loading && filtered.length === 0 && (
                      <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>No SOPs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            {page === 'amendments' && (
              <div className="amend-log">
                <div className="amend-hd">
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--text2)', letterSpacing: 1 }}>AMENDMENT HISTORY — {amendments.length} RECORDS</div>
                </div>
                {amendments.length === 0 && (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No amendments recorded yet.</div>
                )}
                {amendments.map(a => (
                  <div key={a.id} className="amend-row">
                    <div className="amend-dot" />
                    <div style={{ flex: 1 }}>
                      <div className="amend-sop">{a.sop_id} — {a.version}</div>
                      <div className="amend-sum">{a.change_summary}</div>
                      <div className="amend-meta">
                        By {a.changed_by} · {fmtDate(a.created_at)}
                        {a.notification_sent ? ' · ✉ Notified' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* SOP Editor Modal */}
      {editor && (
        <SOPEditor
          sop={editor === 'new' ? null : editor}
          teams={teams}
          isAmendment={editor !== 'new'}
          onSave={handleSave}
          onCancel={() => setEditor(null)}
        />
      )}

      {/* Team Manager Modal */}
      {showTeams && (
        <TeamManager
          teams={teams}
          members={members}
          onRefresh={refresh}
          onClose={() => setShowTeams(false)}
        />
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className="confirm-title">{confirm.title}</div>
            <div className="confirm-msg">{confirm.message}</div>
            <div className="confirm-btns">
              <button style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: 13 }} onClick={() => setConfirm(null)}>Cancel</button>
              <button style={{ padding: '7px 16px', borderRadius: 6, background: 'var(--danger)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }} onClick={() => { confirm.action(); setConfirm(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
