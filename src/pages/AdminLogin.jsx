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
    <>
      <style>{`
        .login-page{height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg0);padding:20px}
        .login-card{width:100%;max-width:400px;background:var(--bg1);border:1px solid var(--border);border-radius:12px;overflow:hidden}
        .login-header{padding:32px 32px 24px;border-bottom:1px solid var(--border);text-align:center}
        .login-logo{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:4px;color:var(--gold2);line-height:1}
        .login-sub{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text3);letter-spacing:2px;margin-top:4px}
        .login-tag{display:inline-block;margin-top:10px;padding:3px 10px;border-radius:4px;background:var(--bg3);border:1px solid var(--border2);font-size:10px;font-family:'IBM Plex Mono',monospace;color:var(--text2);letter-spacing:1px}
        .login-body{padding:28px 32px 32px}
        .login-title{font-size:16px;font-weight:600;color:var(--text1);margin-bottom:6px}
        .login-hint{font-size:12px;color:var(--text3);margin-bottom:20px;line-height:1.5}
        .login-field{margin-bottom:14px}
        .login-lbl{display:block;font-size:11px;color:var(--text2);margin-bottom:6px;font-family:'IBM Plex Mono',monospace;letter-spacing:.5px}
        .login-input{width:100%;padding:9px 12px;background:var(--bg2);border:1px solid var(--border);color:var(--text1);border-radius:6px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s}
        .login-input:focus{border-color:rgba(232,148,10,.45)}
        .login-err{background:var(--danger-dim);border:1px solid rgba(232,64,64,.3);border-radius:6px;padding:10px 12px;font-size:12px;color:var(--danger);margin-bottom:14px}
        .login-btn{width:100%;padding:11px;background:var(--gold);border:none;border-radius:6px;color:#000;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s;letter-spacing:.5px}
        .login-btn:hover{background:var(--gold2)}
        .login-btn:disabled{opacity:.5;cursor:not-allowed}
        .login-back{display:block;text-align:center;margin-top:16px;font-size:12px;color:var(--text3);cursor:pointer;transition:color .15s}
        .login-back:hover{color:var(--text2)}
        .demo-box{background:rgba(232,148,10,.06);border:1px solid rgba(232,148,10,.2);border-radius:6px;padding:10px 12px;margin-bottom:18px;font-size:11px;color:var(--gold);font-family:'IBM Plex Mono',monospace;line-height:1.6}
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">XHIPMENT</div>
            <div className="login-sub">Freight Forwarding Intelligence</div>
            <div className="login-tag">⚙ ADMIN PORTAL</div>
          </div>
          <div className="login-body">
            <div className="login-title">Admin Sign In</div>
            <div className="login-hint">Access the SOP management dashboard to create, edit, and publish procedures.</div>

            {isDemoMode && (
              <div className="demo-box">
                DEMO MODE — No Supabase configured<br />
                Email: admin@xhipment.com<br />
                Password: admin123
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {error && <div className="login-err">⚠ {error}</div>}
              <div className="login-field">
                <label className="login-lbl">EMAIL ADDRESS</label>
                <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@xhipment.com" />
              </div>
              <div className="login-field">
                <label className="login-lbl">PASSWORD</label>
                <input className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'SIGNING IN...' : 'SIGN IN →'}
              </button>
            </form>
            <span className="login-back" onClick={() => navigate('/')}>← Back to SOP Portal</span>
          </div>
        </div>
      </div>
    </>
  )
}
