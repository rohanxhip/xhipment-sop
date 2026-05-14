import { useState } from 'react'
import { db } from '../lib/supabase'

const S = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' },
  modal: { width: '100%', maxWidth: 680, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', animation: 'fadeIn .2s ease', marginBottom: 24 },
  hdr: { padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)' },
  hdrTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: 'var(--text1)' },
  body: { padding: 24 },
  teamCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12, overflow: 'hidden' },
  teamHd: { padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)' },
  teamName: { fontSize: 14, fontWeight: 600, color: 'var(--text1)' },
  teamDesc: { fontSize: 11, color: 'var(--text3)', marginTop: 2 },
  teamBody: { padding: '12px 16px' },
  memberRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' },
  memberName: { fontSize: 13, color: 'var(--text1)', flex: 1 },
  memberEmail: { fontSize: 11, color: 'var(--text3)', fontFamily: "'IBM Plex Mono', monospace" },
  delBtn: { width: 24, height: 24, borderRadius: 4, background: 'var(--danger-dim)', border: '1px solid rgba(232,64,64,.2)', color: 'var(--danger)', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addRow: { display: 'flex', gap: 8, marginTop: 10 },
  input: { flex: 1, padding: '7px 10px', borderRadius: 6 },
  addBtn: { padding: '7px 14px', borderRadius: 6, background: 'var(--gold)', border: 'none', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  newTeamSection: { background: 'var(--bg2)', border: '1px dashed var(--border2)', borderRadius: 8, padding: 16, marginBottom: 12 },
  secTitle: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 },
  secLine: { flex: 1, height: 1, background: 'var(--border)' },
  memberCount: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 7px' },
}

export default function TeamManager({ teams, members, onRefresh, onClose }) {
  const [expanded, setExpanded] = useState(null)
  const [newMember, setNewMember] = useState({})
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const getMembersForTeam = (tid) => members.filter(m => m.team_id === tid)

  const addMember = async (teamId) => {
    const m = newMember[teamId] || {}
    if (!m.name?.trim() || !m.email?.trim()) return
    setLoading(true)
    await db.addMember({ team_id: teamId, name: m.name.trim(), email: m.email.trim() })
    setNewMember(p => ({ ...p, [teamId]: { name: '', email: '' } }))
    await onRefresh()
    setLoading(false)
  }

  const removeMember = async (id) => {
    await db.deleteMember(id)
    await onRefresh()
  }

  const addTeam = async () => {
    if (!newTeam.name.trim()) return
    setLoading(true)
    await db.createTeam({ name: newTeam.name.trim(), description: newTeam.description.trim() })
    setNewTeam({ name: '', description: '' })
    await onRefresh()
    setLoading(false)
  }

  const setNM = (teamId, k, v) => setNewMember(p => ({ ...p, [teamId]: { ...(p[teamId] || {}), [k]: v } }))

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.hdr}>
          <div>
            <div style={S.hdrTitle}>TEAM MANAGEMENT</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--text3)', letterSpacing: 1, marginTop: 2 }}>Manage notification recipients per team</div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', width: 28, height: 28, borderRadius: 5, cursor: 'pointer', fontSize: 12 }}>✕</button>
        </div>

        <div style={S.body}>
          <div style={S.secTitle}><span>CREATE NEW TEAM</span><div style={S.secLine} /></div>
          <div style={S.newTeamSection}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...S.input, flex: 2 }} placeholder="Team name (e.g. Air Freight)" value={newTeam.name} onChange={e => setNewTeam(p => ({ ...p, name: e.target.value }))} />
              <input style={{ ...S.input, flex: 3 }} placeholder="Description (optional)" value={newTeam.description} onChange={e => setNewTeam(p => ({ ...p, description: e.target.value }))} />
              <button style={S.addBtn} onClick={addTeam}>+ Team</button>
            </div>
          </div>

          <div style={{ ...S.secTitle, marginTop: 8 }}><span>TEAMS & MEMBERS</span><div style={S.secLine} /></div>

          {teams.map(team => {
            const tm = getMembersForTeam(team.id)
            const isOpen = expanded === team.id
            return (
              <div key={team.id} style={S.teamCard}>
                <div style={S.teamHd} onClick={() => setExpanded(isOpen ? null : team.id)}>
                  <div>
                    <div style={S.teamName}>{team.name}</div>
                    {team.description && <div style={S.teamDesc}>{team.description}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={S.memberCount}>{tm.length} members</span>
                    <span style={{ color: 'var(--text3)', fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={S.teamBody}>
                    {tm.length === 0 && (
                      <div style={{ fontSize: 12, color: 'var(--text3)', padding: '6px 0 10px', fontStyle: 'italic' }}>No members yet. Add members below to receive SOP notifications.</div>
                    )}
                    {tm.map(m => (
                      <div key={m.id} style={S.memberRow}>
                        <div style={S.memberName}>{m.name}</div>
                        <div style={S.memberEmail}>{m.email}</div>
                        <button style={S.delBtn} onClick={() => removeMember(m.id)} title="Remove member">✕</button>
                      </div>
                    ))}
                    <div style={S.addRow}>
                      <input
                        style={S.input} placeholder="Full name"
                        value={newMember[team.id]?.name || ''}
                        onChange={e => setNM(team.id, 'name', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addMember(team.id)}
                      />
                      <input
                        style={S.input} placeholder="email@xhipment.com" type="email"
                        value={newMember[team.id]?.email || ''}
                        onChange={e => setNM(team.id, 'email', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addMember(team.id)}
                      />
                      <button style={S.addBtn} onClick={() => addMember(team.id)} disabled={loading}>
                        {loading ? '...' : '+ Add'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
