import { useEffect } from 'react'

const S = {
  wrap: {
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
  },
  toast: (type) => ({
    display: 'flex', alignItems: 'flex-start', gap: 12,
    background: 'var(--bg2)', border: `1px solid ${
      type === 'success' ? 'rgba(15,181,122,0.35)' :
      type === 'error'   ? 'rgba(232,64,64,0.35)' :
      type === 'info'    ? 'rgba(74,142,232,0.35)' :
      'rgba(240,165,0,0.35)'
    }`,
    borderRadius: 8, padding: '12px 16px', minWidth: 280, maxWidth: 380,
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    animation: 'toastIn 0.25s ease',
    pointerEvents: 'all',
  }),
  icon: (type) => ({
    fontSize: 16, marginTop: 1,
    color: type === 'success' ? 'var(--success)' :
           type === 'error'   ? 'var(--danger)' :
           type === 'info'    ? 'var(--info)' : 'var(--warn)',
  }),
  title: { fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 2 },
  msg: { fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 },
}

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }

export function Toast({ toasts, dismiss }) {
  return (
    <div style={S.wrap}>
      {toasts.map(t => (
        <div key={t.id} style={S.toast(t.type)} onClick={() => dismiss(t.id)}>
          <span style={S.icon(t.type)}>{ICONS[t.type] || 'ℹ'}</span>
          <div>
            {t.title && <div style={S.title}>{t.title}</div>}
            <div style={S.msg}>{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

let _add = null
export function useToast() {
  return {
    toast: (opts) => _add?.(opts),
  }
}

export function ToastProvider({ children }) {
  return children
}

// Simple global toast hook
export function useToastState() {
  const [toasts, setToasts] = ([])
  return { toasts, add: () => {}, dismiss: () => {} }
}
