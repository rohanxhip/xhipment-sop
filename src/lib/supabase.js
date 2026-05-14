import { createClient } from '@supabase/supabase-js'
import { INITIAL_SOPS, INITIAL_TEAMS } from '../data/initialData'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isDemoMode = !url || !key || url === 'https://your-project-id.supabase.co'

// Real Supabase client
export const supabase = isDemoMode ? null : createClient(url, key)

// ── Demo mode: localStorage-backed data store ──────────────────────────
const LS = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(`xhip_${k}`) || 'null') } catch { return null } },
  set: (k, v) => localStorage.setItem(`xhip_${k}`, JSON.stringify(v)),
}

function seed() {
  if (!LS.get('seeded')) {
    LS.set('sops', INITIAL_SOPS)
    LS.set('teams', INITIAL_TEAMS)
    LS.set('team_members', [])
    LS.set('amendments', [])
    LS.set('seeded', true)
  }
}

// ── Demo Auth ──────────────────────────────────────────────────────────
export const demoAuth = {
  login: (email, password) => {
    if (email === 'admin@xhipment.com' && password === 'admin123') {
      const session = { user: { email, id: 'demo-admin', role: 'admin' } }
      LS.set('session', session)
      return { session, error: null }
    }
    return { session: null, error: 'Invalid credentials. Use admin@xhipment.com / admin123' }
  },
  logout: () => { LS.set('session', null) },
  getSession: () => LS.get('session'),
}

// ── Demo DB ────────────────────────────────────────────────────────────
export const demoDB = {
  // SOPs
  getSops: () => { seed(); return LS.get('sops') || [] },
  getSop: (id) => demoDB.getSops().find(s => s.id === id) || null,
  createSop: (data) => {
    const sops = demoDB.getSops()
    const next = { ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    LS.set('sops', [...sops, next])
    return next
  },
  updateSop: (id, data) => {
    const sops = demoDB.getSops().map(s => s.id === id ? { ...s, ...data, updated_at: new Date().toISOString() } : s)
    LS.set('sops', sops)
    return sops.find(s => s.id === id)
  },
  deleteSop: (id) => { LS.set('sops', demoDB.getSops().filter(s => s.id !== id)) },

  // Teams
  getTeams: () => { seed(); return LS.get('teams') || [] },
  createTeam: (data) => {
    const teams = demoDB.getTeams()
    const next = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    LS.set('teams', [...teams, next])
    return next
  },
  updateTeam: (id, data) => {
    const teams = demoDB.getTeams().map(t => t.id === id ? { ...t, ...data } : t)
    LS.set('teams', teams)
    return teams.find(t => t.id === id)
  },
  deleteTeam: (id) => { LS.set('teams', demoDB.getTeams().filter(t => t.id !== id)) },

  // Team members
  getMembers: (teamId) => {
    const all = LS.get('team_members') || []
    return teamId ? all.filter(m => m.team_id === teamId) : all
  },
  addMember: (data) => {
    const members = demoDB.getMembers()
    const next = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    LS.set('team_members', [...members, next])
    return next
  },
  deleteMember: (id) => { LS.set('team_members', demoDB.getMembers().filter(m => m.id !== id)) },

  // Amendments
  getAmendments: (sopId) => {
    const all = LS.get('amendments') || []
    return sopId ? all.filter(a => a.sop_id === sopId) : all
  },
  addAmendment: (data) => {
    const amendments = demoDB.getAmendments()
    const next = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    LS.set('amendments', [...amendments, next])
    return next
  },
}

// ── Unified API (works in both modes) ─────────────────────────────────
export const db = {
  getSops: async () => {
    if (isDemoMode) return demoDB.getSops()
    const { data } = await supabase.from('sops').select('*').order('updated_at', { ascending: false })
    return data || []
  },
  getSop: async (id) => {
    if (isDemoMode) return demoDB.getSop(id)
    const { data } = await supabase.from('sops').select('*').eq('id', id).single()
    return data
  },
  createSop: async (data) => {
    if (isDemoMode) return demoDB.createSop(data)
    const { data: d } = await supabase.from('sops').insert(data).select().single()
    return d
  },
  updateSop: async (id, data) => {
    if (isDemoMode) return demoDB.updateSop(id, data)
    const { data: d } = await supabase.from('sops').update(data).eq('id', id).select().single()
    return d
  },
  deleteSop: async (id) => {
    if (isDemoMode) { demoDB.deleteSop(id); return }
    await supabase.from('sops').delete().eq('id', id)
  },
  getTeams: async () => {
    if (isDemoMode) return demoDB.getTeams()
    const { data } = await supabase.from('teams').select('*').order('name')
    return data || []
  },
  createTeam: async (data) => {
    if (isDemoMode) return demoDB.createTeam(data)
    const { data: d } = await supabase.from('teams').insert(data).select().single()
    return d
  },
  updateTeam: async (id, data) => {
    if (isDemoMode) return demoDB.updateTeam(id, data)
    const { data: d } = await supabase.from('teams').update(data).eq('id', id).select().single()
    return d
  },
  deleteTeam: async (id) => {
    if (isDemoMode) { demoDB.deleteTeam(id); return }
    await supabase.from('teams').delete().eq('id', id)
  },
  getMembers: async (teamId) => {
    if (isDemoMode) return demoDB.getMembers(teamId)
    let q = supabase.from('team_members').select('*')
    if (teamId) q = q.eq('team_id', teamId)
    const { data } = await q
    return data || []
  },
  addMember: async (data) => {
    if (isDemoMode) return demoDB.addMember(data)
    const { data: d } = await supabase.from('team_members').insert(data).select().single()
    return d
  },
  deleteMember: async (id) => {
    if (isDemoMode) { demoDB.deleteMember(id); return }
    await supabase.from('team_members').delete().eq('id', id)
  },
  getAmendments: async (sopId) => {
    if (isDemoMode) return demoDB.getAmendments(sopId)
    let q = supabase.from('amendments').select('*').order('created_at', { ascending: false })
    if (sopId) q = q.eq('sop_id', sopId)
    const { data } = await q
    return data || []
  },
  addAmendment: async (data) => {
    if (isDemoMode) return demoDB.addAmendment(data)
    const { data: d } = await supabase.from('amendments').insert(data).select().single()
    return d
  },
}
