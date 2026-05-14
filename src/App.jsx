import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase, isDemoMode, demoAuth } from './lib/supabase'
import PublicView from './pages/PublicView'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { Toast } from './components/Toast'

// ── Toast Context ──────────────────────────────────────────────────────
export const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

// ── Auth Context ───────────────────────────────────────────────────────
export const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

let _toastId = 0

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((opts) => {
    const id = ++_toastId
    setToasts(prev => [...prev, { id, ...opts }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), opts.duration ?? 4000)
  }, [])

  const dismiss = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  // Auth init
  useEffect(() => {
    if (isDemoMode) {
      const s = demoAuth.getSession()
      setSession(s)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (isDemoMode) {
      const { session, error } = demoAuth.login(email, password)
      if (session) setSession(session)
      return { session, error }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { session: data.session, error: error?.message }
  }

  const logout = async () => {
    if (isDemoMode) { demoAuth.logout(); setSession(null); return }
    await supabase.auth.signOut()
    setSession(null)
  }

  if (session === undefined) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg0)' }}>
        <div style={{ color: 'var(--gold)', fontFamily: 'IBM Plex Mono', fontSize: 13, letterSpacing: 2 }}>LOADING...</div>
      </div>
    )
  }

  return (
    <AuthCtx.Provider value={{ session, login, logout, isAdmin: !!session }}>
      <ToastCtx.Provider value={addToast}>
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route
            path="/admin/login"
            element={session ? <Navigate to="/admin" replace /> : <AdminLogin />}
          />
          <Route
            path="/admin/*"
            element={session ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast toasts={toasts} dismiss={dismiss} />
      </ToastCtx.Provider>
    </AuthCtx.Provider>
  )
}
