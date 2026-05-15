import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

// ─── REAL GOOGLE DOC URLS ─────────────────────────────────────────────────────
// All sourced directly from Xhipment Google Drive
const D = {
  // ── Ocean Export Full-Workflow SOPs ────────────────────────────────────────
  in2us_export_t1:      'https://docs.google.com/document/d/1JyylCLLc1WCX7EkM1Pc1IeGGLt4IJ8pKQy11SwmBRHI/edit',
  in2us_export_t2:      'https://docs.google.com/document/d/1iq4x5H84LrtesZQP9VCYXvWSpVK1gJYFtqfH19Nr9I0/edit',
  in2us_export_t2_v2:   'https://docs.google.com/document/d/1DoMGTOaBjXmWY_LceeAXmHg8JAmmP5fjeuaJbj2AOIE/edit',
  in2de_export_t2:      'https://docs.google.com/document/d/1o59pTuCwmFZlVhK2lWLj8M-98p_ACtr9EtwYasaLsxE/edit',
  in2ca_export_t2:      'https://docs.google.com/document/d/1NGpEBBn0Jtq7P43IeXpETO2DSVeH_l1SiDrKCwicWj8/edit',
  // ── Ocean Specific SOPs ────────────────────────────────────────────────────
  doc_verification:     'https://docs.google.com/document/d/1Z0YsCOEZnfvW16GkjG2-wEKlvDgzeZnKa3mKY_JH4rs/edit',
  ams_isf:              'https://docs.google.com/document/d/1IM-sRgb7U9UaGe66nkXRpwCVZxBAMH2JqXLIJsjVXxw/edit',
  usa_drayage:          'https://docs.google.com/document/d/1V5-ra1mQv58DdRSPM5OkPqOhFNLK9bjKncERIvKWG5Y/edit',
  us_transloading:      'https://docs.google.com/document/d/1mKVse1XVLQzHzN_2CkHBc0aOm2rPM4yLrRZ4BCAaXFw/edit',
  uk_ocean_imports:     'https://docs.google.com/document/d/1YpksKsuHhxyYxexhReTsRyy8OPvzHUQlK_ztyb_H6YQ/edit',
  india_imports:        'https://docs.google.com/document/d/1qzn5xTmWd5VB3IIULahZDN00ITYg031PCGysS16c454/edit',
  // ── Air SOPs ───────────────────────────────────────────────────────────────
  uk_us_air:            'https://docs.google.com/document/d/1lTXvjUpVs2uJ9z9dIh8L_z0mAM5XckDO-O6RtmLPy0o/edit',
  // ── Other Origins ──────────────────────────────────────────────────────────
  chn2uk_ocean:         'https://docs.google.com/document/d/16G8TqcApKIDFeQEk7SS8nL_7K1XcMcbou9Uz_J-43AU/edit',
  chn2us_ocean:         'https://docs.google.com/document/d/1asxtNfXQ1WVxNs1W-doWPZqQPv74CGDUeOyHB0dDX04/edit',
  bangladesh_exports:   'https://docs.google.com/document/d/1cXc8Mx0rJRejaGEnMoP4bkNlZey8c_-qFHzehXJku3M/edit',
  uae_imports:          'https://docs.google.com/document/d/1zvj_H5DjDRA2IAoNm0XJ_3zNf_gq520PSxnfrCWxVGA/edit',
}

// ─── OCEAN STAGES ─────────────────────────────────────────────────────────────
// Each SOP card maps to a REAL Google Doc. Cards with no link show "Coming soon".
const OCEAN_STAGES = [
  {
    id:'booking', label:'Booking Confirmation', short:'Booking', icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, space booking, liner selection and booking amendments',
    sops:{ 'IN2US':[
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','IN2US'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','IN2US'], link:D.in2us_export_t2 },
      { title:'IN2US Ocean Export — Team 2 SOP V2', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','IN2US','v2'], link:D.in2us_export_t2_v2 },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US','imports'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE','all-stages'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'documents', label:'Document Verification', short:'Doc Verify', icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, cargo insurance',
    sops:{ 'IN2US':[
      { title:'Document Verification SOP', owner:'Shashidhar / Dipalli', type:'Specific SOP', tags:['verification','checklist'], link:D.doc_verification },
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','doc-section'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','doc-section'], link:D.in2us_export_t2 },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US','docs-section'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE','docs-section'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'pickup', label:'Pickup / Drop Off', short:'Pickup', icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper warehouse, drop-off at CFS',
    sops:{ 'IN2US':[
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','pickup-section'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','pickup-section'], link:D.in2us_export_t2 },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'carting', label:'Carting & Export Clearance', short:'Carting', icon:'🏭', color:'#8B5CF6',
    desc:'CFS inbound, checklist validation, customs export clearance, AMS / ISF filing',
    sops:{ 'IN2US':[
      { title:'AMS & ISF Manual Filing SOP', owner:'Diyanjali', type:'Specific SOP', tags:['AMS','ISF','TradeTech'], link:D.ams_isf },
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','clearance-section'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','clearance-section'], link:D.in2us_export_t2 },
    ],'UK2US':[
      { title:'AMS & ISF Manual Filing SOP', owner:'Diyanjali', type:'Specific SOP', tags:['AMS','ISF'], link:D.ams_isf },
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'AMS & ISF Manual Filing SOP', owner:'Diyanjali', type:'Specific SOP', tags:['AMS','ISF'], link:D.ams_isf },
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'stuffing', label:'Empty Container Pickup & Stuffing', short:'Stuffing', icon:'📦', color:'#F59E0B',
    desc:'Empty container from depot, loading plan, stuffing and sealing',
    sops:{ 'IN2US':[
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','stuffing-section'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','stuffing-section'], link:D.in2us_export_t2 },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'sailout', label:'Container Gate In & Sail Out', short:'Sail Out', icon:'🚢', color:'#06B6D4',
    desc:'Gate-in confirmation, BL release, freight release, sailing milestone',
    sops:{ 'IN2US':[
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','BL','freight-release'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','BL','freight-release'], link:D.in2us_export_t2 },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'clearance', label:'Import Clearance', short:'Import Clear', icon:'🛃', color:'#EF4444',
    desc:'7501 entry filing, customs duty payment, freight and customs release',
    sops:{ 'IN2US':[
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','import','7501'], link:D.in2us_export_t1 },
      { title:'IN2US Ocean Export — Team 2 Full Workflow SOP', owner:'Rohan', type:'Full Workflow', tags:['all-stages','import','7501'], link:D.in2us_export_t2 },
      { title:'India Imports SOP', owner:'Mustafa', type:'Specific SOP', tags:['India','imports'], link:D.india_imports },
    ],'UK2US':[
      { title:'UK Ocean Imports SOP', owner:'Raunak', type:'Full Workflow', tags:['UK2US','import','clearance'], link:D.uk_ocean_imports },
    ],'DE2US':[
      { title:'IN2DE Ocean Export — Team 2 SOP', owner:'Rohan', type:'Full Workflow', tags:['IN2DE','import'], link:D.in2de_export_t2 },
    ]}
  },
  {
    id:'delivery', label:'Delivery', short:'Delivery', icon:'🏁', color:'#10B981',
    desc:'Direct drayage to FBA / Walmart, or transloading + last mile delivery',
    subStages:['Direct Drayage','Transloading'],
    sops:{ 'IN2US':[
      { title:'OPS/OIM/USA/DRA — USA Drayage SOP', owner:'Raunak / Vishnu', type:'Specific SOP', tags:['drayage','Amazon','Walmart','XPO'], link:D.usa_drayage },
      { title:'OPS/OIM/USA/TLD — US Transloading SOP', owner:'Raunak / Krisha', type:'Specific SOP', tags:['transloading','storage','last-mile'], link:D.us_transloading },
      { title:'IN2US Ocean Export — Team 1 Full Workflow SOP', owner:'Diyanjali', type:'Full Workflow', tags:['all-stages','delivery-section'], link:D.in2us_export_t1 },
    ],'UK2US':[
      { title:'OPS/OIM/USA/DRA — USA Drayage SOP', owner:'Raunak', type:'Specific SOP', tags:['drayage','last-mile'], link:D.usa_drayage },
      { title:'OPS/OIM/USA/TLD — US Transloading SOP', owner:'Raunak', type:'Specific SOP', tags:['transloading','storage'], link:D.us_transloading },
    ],'DE2US':[
      { title:'OPS/OIM/USA/DRA — USA Drayage SOP', owner:'Raunak', type:'Specific SOP', tags:['drayage','last-mile'], link:D.usa_drayage },
      { title:'OPS/OIM/USA/TLD — US Transloading SOP', owner:'Raunak', type:'Specific SOP', tags:['transloading','storage'], link:D.us_transloading },
    ]}
  },
]

// ─── AIR STAGES ──────────────────────────────────────────────────────────────
const AIR_STAGES = [
  {
    id:'booking', label:'Booking Confirmation', short:'Booking', icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, ICL / FedEx / disaggregated booking, space allocation',
    sops:{ 'IN2US':[], 'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','air','all-stages'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
  {
    id:'documents', label:'Document Verification', short:'Doc Verify', icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, FedEx shipping label',
    sops:{ 'IN2US':[
      { title:'Document Verification SOP', owner:'Shashidhar / Dipalli', type:'Specific SOP', tags:['verification','checklist'], link:D.doc_verification },
    ],'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','docs-section'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
  {
    id:'pickup', label:'Pickup / Drop Off', short:'Pickup', icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper, CFS / RGL drop-off, checklist verification',
    sops:{ 'IN2US':[], 'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','pickup-section'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
  {
    id:'consol', label:'Consol Planning & Export Clearance', short:'Consol / Export', icon:'🏭', color:'#8B5CF6',
    desc:'CSBV + Commercial consol planning, export clearance, ICL operations',
    sops:{ 'IN2US':[
      { title:'AMS & ISF Manual Filing SOP', owner:'Diyanjali', type:'Specific SOP', tags:['AMS','ISF','consol'], link:D.ams_isf },
    ],'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','consol-section'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
  {
    id:'clearance', label:'Import Clearance', short:'Import Clear', icon:'🛃', color:'#EF4444',
    desc:'7501 entry validation, customs clearance, cargo pull, ISC payment',
    sops:{ 'IN2US':[], 'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','import-section'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
  {
    id:'delivery', label:'Delivery', short:'Delivery', icon:'🏁', color:'#10B981',
    desc:'FedEx last-mile (aggregated) or destination delivery for disaggregated shipments',
    subStages:['FedEx Aggregated','Disaggregated Last Mile'],
    sops:{ 'IN2US':[], 'UK2US':[
      { title:'UK–US Air Ops SOP', owner:'Dipankar / Rohan', type:'Full Workflow', tags:['UK2US','delivery-section'], link:D.uk_us_air },
    ],'DE2US':[] }
  },
]

// ─── PRIORITY / TYPE CONFIG ───────────────────────────────────────────────────
const TYPE_CONFIG = {
  'Full Workflow': { bg:'#EFF6FF', border:'#BFDBFE', text:'#1D4ED8', dot:'#3B82F6' },
  'Specific SOP':  { bg:'#F0FDF4', border:'#BBF7D0', text:'#15803D', dot:'#22C55E' },
}

// ─── STAGE TIMELINE ───────────────────────────────────────────────────────────
function StageTimeline({ stages, activeId, onSelect, lane }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:4 }}>
      <div style={{ display:'flex', alignItems:'flex-start', minWidth:stages.length * 110 }}>
        {stages.map((s, i) => {
          const isActive = s.id === activeId
          const isLast   = i === stages.length - 1
          const count    = s.sops[lane]?.length || 0
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', flex:isLast ? 0 : 1 }}>
              <div onClick={() => onSelect(s.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer', flexShrink:0 }}>
                <div style={{
                  width:isActive ? 48 : 38, height:isActive ? 48 : 38, borderRadius:'50%',
                  background:isActive ? s.color : '#F1F5F9',
                  border:`2px solid ${isActive ? s.color : '#E2E8F0'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:isActive ? 20 : 15, transition:'all .2s',
                  boxShadow:isActive ? `0 0 0 4px ${s.color}22` : 'none',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:8.5, textTransform:'uppercase', fontWeight:isActive ? 700 : 500, color:isActive ? s.color : '#94A3B8', textAlign:'center', maxWidth:82, lineHeight:1.3 }}>
                  {s.short}
                </div>
                <div style={{ fontSize:8.5, fontWeight:600, padding:'1px 7px', borderRadius:20, background:isActive ? s.color : '#F1F5F9', color:isActive ? '#fff' : '#94A3B8', border:`1px solid ${isActive ? s.color : '#E2E8F0'}` }}>
                  {count} {count === 1 ? 'doc' : 'docs'}
                </div>
              </div>
              {!isLast && <div style={{ flex:1, height:2, marginBottom:44, background:`linear-gradient(90deg,${s.color}33,${stages[i+1].color}33)` }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SOP CARD ─────────────────────────────────────────────────────────────────
function SOPCard({ sop, stageColor }) {
  const tc = TYPE_CONFIG[sop.type] || TYPE_CONFIG['Specific SOP']
  return (
    <div
      onClick={() => window.open(sop.link, '_blank')}
      style={{
        background:'#fff', borderRadius:12, padding:'16px 18px',
        border:'1.5px solid #E2E8F0', cursor:'pointer',
        transition:'all .15s', boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
        borderLeft:`4px solid ${stageColor}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 6px 20px rgba(0,0,0,0.10)`; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      {/* Type badge */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:tc.bg, border:`1px solid ${tc.border}` }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:tc.dot, flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:700, color:tc.text, letterSpacing:.3 }}>{sop.type}</span>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', alignItems:'center', gap:4, color:'#FF6B2B', fontSize:12, fontWeight:700 }}>
          <span>↗</span><span>Open Doc</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontSize:14, fontWeight:700, color:'#0F172A', lineHeight:1.4, marginBottom:10 }}>
        {sop.title}
      </div>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <div style={{ fontSize:11, color:'#64748B', display:'flex', alignItems:'center', gap:4 }}>
          <span>👤</span><span>{sop.owner}</span>
        </div>
        <div style={{ flex:1 }} />
        {sop.tags.slice(0, 3).map(t => (
          <div key={t} style={{ fontSize:9, padding:'2px 7px', borderRadius:20, background:'#F1F5F9', border:'1px solid #E2E8F0', color:'#64748B', fontWeight:500 }}>
            #{t}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
function EmptyStage({ stage, lane }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:12, border:'1.5px dashed #E2E8F0' }}>
      <div style={{ fontSize:36, marginBottom:12 }}>📝</div>
      <div style={{ fontSize:15, fontWeight:700, color:'#0F172A', marginBottom:6 }}>
        No SOP linked yet for {stage.label} — {lane}
      </div>
      <div style={{ fontSize:13, color:'#94A3B8', marginBottom:20, maxWidth:400, margin:'0 auto 20px' }}>
        Upload your PDF to Google Drive, make it shareable, then paste the link in the Admin Dashboard to add it here.
      </div>
      <div style={{ display:'inline-flex', flexDirection:'column', gap:8, textAlign:'left', background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:10, padding:'14px 18px', fontSize:12, color:'#64748B' }}>
        <div style={{ fontWeight:700, color:'#0F172A', marginBottom:4 }}>How to add an SOP:</div>
        <div>1. Upload PDF to Google Drive</div>
        <div>2. Right-click → Share → "Anyone with link" → Copy link</div>
        <div>3. Admin Dashboard → New SOP → paste the link</div>
        <div>4. It appears here instantly ✓</div>
      </div>
    </div>
  )
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────
export default function PublicView() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [mode, setMode] = useState('ocean')
  const [lane, setLane] = useState('IN2US')
  const [activeStageId, setActiveStageId] = useState('booking')
  const [search, setSearch] = useState('')

  const stages      = mode === 'ocean' ? OCEAN_STAGES : AIR_STAGES
  const activeStage = stages.find(s => s.id === activeStageId) || stages[0]

  const handleMode  = (m)  => { setMode(m); setActiveStageId(stages[0].id); setSearch('') }
  const handleStage = (id) => { setActiveStageId(id); setSearch('') }

  const stageDocs = activeStage.sops[lane] || []
  const filtered  = stageDocs.filter(s =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )

  const totalDocs = stages.reduce((a, s) => a + (s.sops[lane]?.length || 0), 0)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F8FAFC' }}>

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside style={{ width:230, minWidth:230, background:'#0F172A', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'2px 0 8px rgba(0,0,0,0.12)' }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'#FF6B2B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>X</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>Xhipment</div>
              <div style={{ fontSize:9, color:'#475569', letterSpacing:1.5, textTransform:'uppercase' }}>SOP Portal</div>
            </div>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', animation:'pulse 2s infinite' }} />
            <div style={{ fontSize:9, fontWeight:600, color:'#10B981', letterSpacing:1 }}>LIVE</div>
          </div>
        </div>

        {/* Mode switcher */}
        <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>Mode</div>
          <div style={{ display:'flex', gap:5, background:'#1E293B', padding:4, borderRadius:8 }}>
            {[['ocean','🚢','Ocean'],['air','✈️','Air']].map(([m,ic,lb]) => (
              <button key={m} onClick={() => handleMode(m)} style={{
                flex:1, padding:'7px 4px', borderRadius:6, cursor:'pointer', border:'none',
                background:mode===m?'#FF6B2B':'transparent',
                color:mode===m?'#fff':'#64748B', fontSize:12, fontWeight:mode===m?700:500, transition:'all .15s',
              }}>{ic} {lb}</button>
            ))}
          </div>
        </div>

        {/* Lane filter */}
        <div style={{ padding:'12px 14px 8px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>Trade Lane</div>
          {['IN2US','UK2US','DE2US'].map(l => {
            const count = stages.reduce((a,s) => a + (s.sops[l]?.length || 0), 0)
            return (
              <div key={l} onClick={() => setLane(l)} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'7px 12px', borderRadius:6, cursor:'pointer', marginBottom:3,
                background:lane===l?'rgba(255,107,43,0.15)':'transparent',
                border:lane===l?'1px solid rgba(255,107,43,0.4)':'1px solid transparent', transition:'all .15s',
              }}>
                <span style={{ fontSize:12, fontWeight:lane===l?700:500, color:lane===l?'#FF6B2B':'#94A3B8' }}>{l}</span>
                <span style={{ fontSize:10, fontWeight:600, color:lane===l?'#FF6B2B':'#475569', background:lane===l?'rgba(255,107,43,0.1)':'#1E293B', padding:'1px 7px', borderRadius:20 }}>{count}</span>
              </div>
            )
          })}
        </div>

        {/* Stage nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8, paddingLeft:4 }}>Lifecycle Stages</div>
          {stages.map(s => {
            const isActive = s.id === activeStageId
            const count = s.sops[lane]?.length || 0
            return (
              <div key={s.id} onClick={() => handleStage(s.id)} style={{
                display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                borderRadius:8, cursor:'pointer', marginBottom:2,
                background:isActive?'rgba(255,107,43,0.12)':'transparent',
                borderLeft:isActive?'3px solid #FF6B2B':'3px solid transparent', transition:'all .15s',
              }}>
                <span style={{ fontSize:13 }}>{s.icon}</span>
                <span style={{ fontSize:11, color:isActive?'#FF6B2B':'#94A3B8', flex:1, lineHeight:1.3, fontWeight:isActive?600:400 }}>{s.short}</span>
                <span style={{ fontSize:10, fontWeight:700, color:isActive?'#FF6B2B':'#475569', background:isActive?'rgba(255,107,43,0.15)':'#1E293B', borderRadius:20, padding:'1px 6px' }}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 14px', borderTop:'1px solid #1E293B' }}>
          <button onClick={() => navigate(isAdmin?'/admin':'/admin/login')} style={{
            width:'100%', padding:9, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600,
            border:'1px solid rgba(255,107,43,0.35)', background:isAdmin?'rgba(255,107,43,0.15)':'transparent',
            color:isAdmin?'#FF6B2B':'#64748B', transition:'all .15s',
          }}>
            {isAdmin ? '⚙️ Admin Dashboard' : '🔐 Admin Login'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <div style={{ height:60, padding:'0 24px', background:'#fff', borderBottom:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'#0F172A' }}>
              {mode==='ocean'?'🚢':'✈️'} {mode==='ocean'?'Ocean':'Air'} <span style={{ color:'#FF6B2B' }}>SOP Lifecycle</span>
            </div>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{lane} · {totalDocs} documents linked</div>
          </div>
          <div style={{ flex:1 }} />
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', fontSize:13 }}>🔍</span>
            <input placeholder="Search SOPs..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:30, paddingRight:12, paddingTop:8, paddingBottom:8, width:240, fontSize:13 }} />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background:'#fff', borderBottom:'1.5px solid #E2E8F0', padding:'16px 24px 4px', flexShrink:0 }}>
          <StageTimeline stages={stages} activeId={activeStageId} onSelect={handleStage} lane={lane} />
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 32px' }}>

          {/* Stage header */}
          <div style={{ background:'#fff', border:'1.5px solid #E2E8F0', borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', borderLeft:`4px solid ${activeStage.color}` }}>
            <div style={{ width:46, height:46, borderRadius:10, background:`${activeStage.color}14`, border:`1.5px solid ${activeStage.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
              {activeStage.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#0F172A', marginBottom:3 }}>{activeStage.label}</div>
              <div style={{ fontSize:12, color:'#64748B' }}>{activeStage.desc}</div>
              {activeStage.subStages && (
                <div style={{ display:'flex', gap:6, marginTop:8 }}>
                  {activeStage.subStages.map(sub => (
                    <div key={sub} style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:`${activeStage.color}10`, border:`1px solid ${activeStage.color}30`, color:activeStage.color }}>
                      ⤷ {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:28, fontWeight:900, color:activeStage.color, lineHeight:1 }}>{filtered.length}</div>
              <div style={{ fontSize:9.5, color:'#94A3B8', fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>{lane} docs</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:'flex', gap:12, marginBottom:16 }}>
            {Object.entries(TYPE_CONFIG).map(([type, tc]) => (
              <div key={type} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:tc.dot }} />
                <span style={{ fontSize:11, color:'#64748B', fontWeight:500 }}>{type}</span>
              </div>
            ))}
            <div style={{ flex:1 }} />
            <div style={{ fontSize:11, color:'#94A3B8' }}>Click any card to open the Google Doc ↗</div>
          </div>

          {/* Cards or empty state */}
          {filtered.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
              {filtered.map((sop, i) => <SOPCard key={i} sop={sop} stageColor={activeStage.color} />)}
            </div>
          ) : search ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#94A3B8' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>No documents match "{search}"</div>
            </div>
          ) : (
            <EmptyStage stage={activeStage} lane={lane} />
          )}
        </div>
      </main>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
