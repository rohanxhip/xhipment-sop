export function Toast({ toasts, dismiss }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
      {toasts.map(t => {
        const colors = {
          success:{ bg:'#F0FDF4', border:'#86EFAC', text:'#16A34A', icon:'✓' },
          error:  { bg:'#FEF2F2', border:'#FECACA', text:'#DC2626', icon:'✕' },
          warning:{ bg:'#FFFBEB', border:'#FDE68A', text:'#D97706', icon:'⚠' },
          info:   { bg:'#EFF6FF', border:'#BFDBFE', text:'#2563EB', icon:'ℹ' },
        }[t.type] || { bg:'#F8FAFC', border:'#E2E8F0', text:'#475569', icon:'ℹ' }
        return (
          <div key={t.id} onClick={() => dismiss(t.id)} style={{
            display:'flex', alignItems:'flex-start', gap:12, pointerEvents:'all', cursor:'pointer',
            background:colors.bg, border:`1.5px solid ${colors.border}`, borderRadius:10,
            padding:'13px 16px', minWidth:300, maxWidth:400,
            boxShadow:'0 4px 20px rgba(0,0,0,0.10)', animation:'toastIn .25s ease',
          }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:colors.text, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, flexShrink:0 }}>
              {colors.icon}
            </div>
            <div>
              {t.title && <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:2 }}>{t.title}</div>}
              <div style={{ fontSize:12, color:'#475569', lineHeight:1.4 }}>{t.message}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
