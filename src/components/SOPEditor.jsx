import { useState } from 'react'

const CATEGORIES = ['import','export','customs','documentation','warehousing','dangerous']
const STATUSES = ['active','under_review','archived']
const PRIORITIES = ['critical','high','medium','low']

const S = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' },
  modal: { width: '100%', maxWidth: 760, background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', animation: 'fadeIn .2s ease', marginBottom: 24 },
  hdr: { padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)' },
  hdrTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, color: 'var(--text1)' },
  hdrSub: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--text3)', letterSpacing: 1, marginTop: 2 },
  body: { padding: 24 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 },
  field: { marginBottom: 14 },
  lbl: { display: 'block', fontSize: 10, color: 'var(--text3)', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 },
  input: { width: '100%', padding: '8px 11px', borderRadius: 6 },
  select: { width: '100%', padding: '8px 11px', borderRadius: 6 },
  textarea: { width: '100%', padding: '8px 11px', borderRadius: 6, resize: 'vertical', minHeight: 80 },
  sec: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: 18, display: 'flex', alignItems: 'center', gap: 8 },
  secLine: { flex: 1, height: 1, background: 'var(--border)' },
  stepCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 7, padding: '12px 14px', marginBottom: 9 },
  stepHd: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  stepNum: { width: 24, height: 24, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid rgba(232,148,10,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--gold)', flexShrink: 0 },
  stepDel: { marginLeft: 'auto', width: 26, height: 26, borderRadius: 5, background: 'var(--danger-dim)', border: '1px solid rgba(232,64,64,.25)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
  addStep: { width: '100%', padding: '9px', border: '1px dashed var(--border2)', borderRadius: 7, background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all .15s' },
  footer: { padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg2)' },
  btnCancel: { padding: '9px 18px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  btnSave: { padding: '9px 22px', borderRadius: 6, background: 'var(--gold)', border: 'none', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif', transition: 'background .15s" },
  amendBox: { background: 'rgba(232,148,10,.06)', border: '1px solid rgba(232,148,10,.2)', borderRadius: 7, padding: '12px 14px', marginBottom: 14 },
  amendLbl: { fontSize: 10, color: 'var(--gold)', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, marginBottom: 6 },
}

const blankStep = () => ({ id: Date.now(), title: '', duration: '', dept: '', desc: '' })

export default function SOPEditor({ sop, teams, onSave, onCancel, isAmendment }) {
  const isEdit = !!sop
  const [form, setForm] = useState({
    id: sop?.id || '',
    title: sop?.title || '',
    category: sop?.category || 'import',
    version: sop?.version || 'v1.0',
    status: sop?.status || 'active',
    priority: sop?.priority || 'medium',
    description: sop?.description || '',
    owner: sop?.owner || '',
    team_id: sop?.team_id || '',
    tags: Array.isArray(sop?.tags) ? sop.tags.join(', ') : '',
    steps: Array.isArray(sop?.steps) && sop.steps.length > 0
      ? sop.steps.map(s => ({ ...s }))
      : [blankStep()],
  })
  const [changeSummary, setChangeSummary] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const setStep = (idx, k, v) => setForm(p => ({
    ...p,
    steps: p.steps.map((s, i) => i === idx ? { ...s, [k]: v } : s),
  }))

  const addStep = () => setForm(p => ({ ...p, steps: [...p.steps, { ...blankStep(), id: p.steps.length + 1 }] }))
  const delStep = (idx) => setForm(p => ({ ...p, steps: p.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, id: i + 1 })) }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.id.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      id: form.id.trim().toUpperCase(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      steps: form.steps.map((s, i) => ({ ...s, id: i + 1 })),
    }
    await onSave(payload, changeSummary)
    setSaving(false)
  }

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={S.modal}>
        <div style={S.hdr}>
          <div>
            <div style={S.hdrTitle}>{isEdit ? (isAmendment ? 'AMEND SOP' : 'EDIT SOP') : 'CREATE NEW SOP'}</div>
            <div style={S.hdrSub}>{isEdit ? sop.id : 'New Procedure'}</div>
          </div>
          <button onClick={onCancel} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', width: 28, height: 28, borderRadius: 5, cursor: 'pointer', fontSize: 12 }}>✕</button>
        </div>

        <div style={S.body}>
          {/* Amendment summary if editing */}
          {isEdit && (
            <div style={S.amendBox}>
              <div style={S.amendLbl}>AMENDMENT CHANGE SUMMARY (REQUIRED)</div>
              <textarea
                style={{ ...S.textarea, minHeight: 60, background: 'transparent', border: '1px solid rgba(232,148,10,.2)', color: 'var(--text1)' }}
                placeholder="Describe what changed in this version (e.g. 'Updated DG screening step 5 to include new IATA 2024 requirements')"
                value={changeSummary}
                onChange={e => setChangeSummary(e.target.value)}
              />
            </div>
          )}

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.lbl}>SOP ID *</label>
              <input style={S.input} placeholder="SOP-007" value={form.id} onChange={e => set('id', e.target.value)} disabled={isEdit} />
            </div>
            <div style={S.field}>
              <label style={S.lbl}>Version *</label>
              <input style={S.input} placeholder="v1.0" value={form.version} onChange={e => set('version', e.target.value)} />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.lbl}>Title *</label>
            <input style={S.input} placeholder="Ocean LCL Export Booking Procedure" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div style={S.grid3}>
            <div style={S.field}>
              <label style={S.lbl}>Category</label>
              <select style={S.select} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.lbl}>Status</label>
              <select style={S.select} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.lbl}>Priority</label>
              <select style={S.select} value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.field}>
              <label style={S.lbl}>Owner / Author</label>
              <input style={S.input} placeholder="Sarah Chen" value={form.owner} onChange={e => set('owner', e.target.value)} />
            </div>
            <div style={S.field}>
              <label style={S.lbl}>Team (for notifications)</label>
              <select style={S.select} value={form.team_id} onChange={e => set('team_id', e.target.value)}>
                <option value="">— Select Team —</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div style={S.field}>
            <label style={S.lbl}>Description</label>
            <textarea style={S.textarea} placeholder="Brief overview of this procedure's purpose and scope..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div style={S.field}>
            <label style={S.lbl}>Tags (comma-separated)</label>
            <input style={S.input} placeholder="air, export, AWB, booking" value={form.tags} onChange={e => set('tags', e.target.value)} />
          </div>

          <div style={S.sec}><span>PROCEDURE STEPS</span><div style={S.secLine} /></div>

          {form.steps.map((step, idx) => (
            <div key={step.id} style={S.stepCard}>
              <div style={S.stepHd}>
                <div style={S.stepNum}>{idx + 1}</div>
                <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Step {idx + 1}</span>
                {form.steps.length > 1 && (
                  <button style={S.stepDel} onClick={() => delStep(idx)}>✕</button>
                )}
              </div>
              <div style={S.grid2}>
                <div style={S.field}>
                  <label style={S.lbl}>Step Title *</label>
                  <input style={S.input} placeholder="Receive Shipment Request" value={step.title} onChange={e => setStep(idx, 'title', e.target.value)} />
                </div>
                <div style={{ ...S.grid2, gridTemplateColumns: '1fr 1fr', margin: 0 }}>
                  <div style={S.field}>
                    <label style={S.lbl}>Duration</label>
                    <input style={S.input} placeholder="30 min" value={step.duration} onChange={e => setStep(idx, 'duration', e.target.value)} />
                  </div>
                  <div style={S.field}>
                    <label style={S.lbl}>Department</label>
                    <input style={S.input} placeholder="Operations" value={step.dept} onChange={e => setStep(idx, 'dept', e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <label style={S.lbl}>Description</label>
                <textarea style={{ ...S.textarea, minHeight: 60 }} placeholder="Detailed instructions for this step..." value={step.desc} onChange={e => setStep(idx, 'desc', e.target.value)} />
              </div>
            </div>
          ))}

          <button style={S.addStep} onClick={addStep}>+ Add Step</button>
        </div>

        <div style={S.footer}>
          <button style={S.btnCancel} onClick={onCancel}>Cancel</button>
          <button
            style={{ ...S.btnSave, opacity: saving || !form.title || !form.id ? .5 : 1, marginLeft: 'auto' }}
            onClick={handleSave}
            disabled={saving || !form.title || !form.id}
          >
            {saving ? 'Saving...' : isEdit ? '✓ Save Amendment' : '✓ Create SOP'}
          </button>
        </div>
      </div>
    </div>
  )
}
