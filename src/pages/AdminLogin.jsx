import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { isDemoMode } from '../lib/supabase'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(isDemoMode ? 'admin@xhipment.com' : '')
  const [password, setPassword] = useState(isDemoMode ? 'admin123' : '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await login(email, password)
    setLoading(false)
    if (err) setError(typeof err === 'string' ? err : err.message || 'Login failed')
    else navigate('/admin')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'#FF6B2B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff' }}>X</div>
            <span style={{ fontSize:22, fontWeight:800, color:'#0F172A', letterSpacing:-.3 }}>Xhipment</span>
          </div>
          <div style={{ fontSize:13, color:'#64748B' }}>Sign in to the SOP Management Portal</div>
        </div>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #E2E8F0', padding:'32px 32px 28px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:18, fontWeight:800, color:'#0F172A', marginBottom:6 }}>Admin Sign In</div>
          <div style={{ fontSize:13, color:'#94A3B8', marginBottom:24 }}>Access the dashboard to manage SOPs, teams and amendments.</div>

          {isDemoMode && (
            <div style={{ background:'#FFF4EE', border:'1.5px solid #FFD4B5', borderRadius:8, padding:'10px 14px', marginBottom:20, fontSize:12, color:'#C2410C' }}>
              <div style={{ fontWeight:700, marginBottom:2 }}>🧪 Demo Mode — no Supabase configured</div>
              <div>Email: admin@xhipment.com · Password: admin123</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#DC2626', fontWeight:500 }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="admin@xhipment.com"
                style={{ width:'100%', padding:'10px 13px' }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width:'100%', padding:'10px 13px' }} />
            </div>
            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'12px', borderRadius:8, border:'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#94A3B8' : '#FF6B2B', color:'#fff', fontSize:14, fontWeight:700,
              transition:'background .15s', letterSpacing:.3,
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <span onClick={() => navigate('/')} style={{ fontSize:13, color:'#94A3B8', cursor:'pointer', fontWeight:500 }}>
            ← Back to SOP Portal
          </span>
        </div>
      </div>
    </div>
  )
}
