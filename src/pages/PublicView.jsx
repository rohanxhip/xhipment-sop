import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

// ─── OCEAN LIFECYCLE ────────────────────────────────────────────────
const OCEAN_STAGES = [
  { id:'booking',   label:'Booking Confirmation',             short:'Booking',       icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, space booking, liner selection & booking amendment process',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-01',title:'Container Booking SOP',owner:'Jaideep',priority:'critical',tags:['MAERSK','OOCL','CMA'],link:''},
      {id:'SOP-OCN-IN-02',title:'India to US Ocean Quoting Process SOP',owner:'Jaideep',priority:'critical',tags:['LCL','FCL','pricing'],link:''},
      {id:'SOP-OCN-IN-03',title:'Port of Discharge Estimator SOP',owner:'Jaideep',priority:'high',tags:['POD','routing'],link:''},
      {id:'SOP-OCN-IN-04',title:'Liner Issue / Exception Handling SOP',owner:'Jaideep',priority:'high',tags:['exception','liner'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-01',title:'Container Booking SOP — UK Export',owner:'Jaideep',priority:'critical',tags:['UK','FCL'],link:''},
      {id:'SOP-OCN-UK-02',title:'UK2US LCL Calculator SOP',owner:'Jaideep',priority:'high',tags:['LCL','pricing'],link:''},
      {id:'SOP-OCN-UK-03',title:'UK Pickup Calculator SOP',owner:'Jaideep',priority:'high',tags:['pickup','pricing'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-01',title:'Container Booking SOP — DE Export',owner:'Jaideep',priority:'critical',tags:['DE','FCL'],link:''},
      {id:'SOP-OCN-DE-02',title:'DE2US LCL Calculator SOP',owner:'Jaideep',priority:'high',tags:['LCL','pricing'],link:''},
    ]}},
  { id:'documents', label:'Document Verification',            short:'Doc Verify',    icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, cargo insurance verification',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-05',title:'Export Document Collection & Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','IN2US'],link:''},
      {id:'SOP-OCN-IN-06',title:'Document Verification Checklist',owner:'Rohan',priority:'critical',tags:['checklist'],link:''},
      {id:'SOP-OCN-IN-07',title:'AD Code & IFSC Registration Guide',owner:'Rohan',priority:'critical',tags:['ICEGATE','AD-code'],link:''},
      {id:'SOP-OCN-IN-08',title:'Marking & Labeling Guide',owner:'Rohan',priority:'high',tags:['packaging','labels'],link:''},
      {id:'SOP-OCN-IN-09',title:'FBA ID and PO ID Collection Guide',owner:'Rohan',priority:'critical',tags:['Amazon','FBA','Walmart'],link:''},
      {id:'SOP-OCN-IN-10',title:'Cargo Insurance Procurement Guide',owner:'Rohan',priority:'medium',tags:['insurance'],link:''},
      {id:'SOP-OCN-IN-11',title:'Document Verification Exception Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-04',title:'New Customer Document Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','new-customer'],link:''},
      {id:'SOP-OCN-UK-05',title:'Existing Customer Document Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','existing'],link:''},
      {id:'SOP-OCN-UK-06',title:'EORI Number Procurement Guide',owner:'Rohan',priority:'high',tags:['EORI','UK'],link:''},
      {id:'SOP-OCN-UK-07',title:'Marking & Labeling Guide SOP',owner:'Rohan',priority:'high',tags:['packaging'],link:''},
      {id:'SOP-OCN-UK-08',title:'FBA ID and PO ID Collection Guide',owner:'Rohan',priority:'critical',tags:['Amazon','FBA'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-03',title:'New Customer Document Verification SOP — DE',owner:'Rohan',priority:'critical',tags:['verification','DE'],link:''},
      {id:'SOP-OCN-DE-04',title:'Existing Customer Document Verification SOP — DE',owner:'Rohan',priority:'critical',tags:['verification','DE'],link:''},
      {id:'SOP-OCN-DE-05',title:'EORI Number Procurement Guide',owner:'Rohan',priority:'high',tags:['EORI','DE'],link:''},
    ]}},
  { id:'pickup',    label:'Pickup / Drop Off Initiation',     short:'Pickup',        icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper warehouse, drop-off at CFS, exception handling',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-12',title:'Ocean Pickup Operations SOP',owner:'Rohan',priority:'critical',tags:['pickup','vendor'],link:''},
      {id:'SOP-OCN-IN-13',title:'Drop Off Operations Guide',owner:'Rohan',priority:'critical',tags:['CFS','drop-off'],link:''},
      {id:'SOP-OCN-IN-14',title:'Pickup & Drop Off Exception Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-10',title:'Pick Up Operations Guide — UK',owner:'Rohan',priority:'critical',tags:['pickup','UK'],link:''},
      {id:'SOP-OCN-UK-11',title:'Drop Off Operations Guide — UK',owner:'Rohan',priority:'critical',tags:['drop-off','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-07',title:'Pick Up Operations Guide — DE',owner:'Rohan',priority:'critical',tags:['pickup','DE'],link:''},
      {id:'SOP-OCN-DE-08',title:'Drop Off Operations Guide — DE',owner:'Rohan',priority:'critical',tags:['drop-off','DE'],link:''},
    ]}},
  { id:'carting',   label:'Carting & Export Clearance',       short:'Carting',       icon:'🏭', color:'#8B5CF6',
    desc:'CFS inbound, checklist validation, customs export clearance, AMS / ISF filing',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-15',title:'Checklist Generation & CFS Inbound SOP',owner:'Rohan',priority:'critical',tags:['checklist','CFS'],link:''},
      {id:'SOP-OCN-IN-16',title:'Export Clearance SOP',owner:'Rohan',priority:'critical',tags:['customs','clearance'],link:''},
      {id:'SOP-OCN-IN-17',title:'AMS Submission Process — TradeTech',owner:'Rohan',priority:'critical',tags:['AMS','TradeTech'],link:''},
      {id:'SOP-OCN-IN-18',title:'ISF Submission Process — TradeTech',owner:'Rohan',priority:'critical',tags:['ISF','TradeTech'],link:''},
      {id:'SOP-OCN-IN-19',title:'AMS / ISF Validation Guide',owner:'Rohan',priority:'critical',tags:['AMS','ISF','validation'],link:''},
      {id:'SOP-OCN-IN-20',title:'Export Operations Issue Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-13',title:'Container / Exports Planning SOP — UK',owner:'Rohan',priority:'high',tags:['planning','UK'],link:''},
      {id:'SOP-OCN-UK-14',title:'Export Clearance SOP — UK',owner:'Rohan',priority:'critical',tags:['clearance','UK'],link:''},
      {id:'SOP-OCN-UK-15',title:'AMS / ISF Submission & Validation',owner:'Rohan',priority:'critical',tags:['AMS','ISF'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-09',title:'Container / Exports Planning SOP — DE',owner:'Rohan',priority:'high',tags:['planning','DE'],link:''},
      {id:'SOP-OCN-DE-10',title:'Export Clearance SOP — DE',owner:'Rohan',priority:'critical',tags:['clearance','DE'],link:''},
    ]}},
  { id:'stuffing',  label:'Empty Container Pickup & Stuffing', short:'Stuffing',      icon:'📦', color:'#F59E0B',
    desc:'Empty container pickup from depot, container loading plan, stuffing & sealing',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-21',title:'Container / Exports Planning SOP',owner:'Rohan',priority:'high',tags:['planning','FCL'],link:''},
      {id:'SOP-OCN-IN-22',title:'Container Loading Plan Generation SOP',owner:'Rohan',priority:'high',tags:['loading','stuffing'],link:''},
      {id:'SOP-OCN-IN-23',title:'INNTRA Shipping Instructions Filing Guide',owner:'Rohan',priority:'critical',tags:['SI','INNTRA'],link:''},
      {id:'SOP-OCN-IN-24',title:'House Bill of Lading Creation Process',owner:'Rohan',priority:'critical',tags:['HBL','documentation'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-18',title:'Container Loading Plan Generation SOP — UK',owner:'Rohan',priority:'high',tags:['loading','UK'],link:''},
      {id:'SOP-OCN-UK-19',title:'House Bill of Lading Creation Process',owner:'Rohan',priority:'critical',tags:['HBL'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-12',title:'Container Loading Plan Generation SOP — DE',owner:'Rohan',priority:'high',tags:['loading','DE'],link:''},
      {id:'SOP-OCN-DE-13',title:'House Bill of Lading Creation Process — DE',owner:'Rohan',priority:'critical',tags:['HBL','DE'],link:''},
    ]}},
  { id:'sailout',   label:'Container Gate In & Sail Out',      short:'Sail Out',      icon:'🚢', color:'#06B6D4',
    desc:'Gate-in confirmation, BL release, freight release, sailing milestone tracking',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-25',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:''},
      {id:'SOP-OCN-IN-26',title:'OOCL BL & Freight Release Process',owner:'Farhan',priority:'critical',tags:['OOCL'],link:''},
      {id:'SOP-OCN-IN-27',title:'CMA CGM BL / Freight Release',owner:'Farhan',priority:'critical',tags:['CMA-CGM'],link:''},
      {id:'SOP-OCN-IN-28',title:'CP World BL / Freight Release Process',owner:'Farhan',priority:'high',tags:['CP-World'],link:''},
      {id:'SOP-OCN-IN-29',title:'Noble Shipping BL / Freight Release',owner:'Farhan',priority:'high',tags:['Noble'],link:''},
      {id:'SOP-OCN-IN-30',title:'Liner Origin D+D Information SOP',owner:'Jaideep',priority:'high',tags:['demurrage','detention'],link:''},
      {id:'SOP-OCN-IN-31',title:'Customs & Freight Release Check Guide',owner:'Raunak',priority:'critical',tags:['freight-release','terminal'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-21',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:''},
      {id:'SOP-OCN-UK-22',title:'Liner D+D Information SOP — UK',owner:'Jaideep',priority:'high',tags:['demurrage','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-15',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:''},
      {id:'SOP-OCN-DE-16',title:'Liner D+D Information SOP — DE',owner:'Jaideep',priority:'high',tags:['demurrage','DE'],link:''},
    ]}},
  { id:'clearance', label:'Import Clearance',                  short:'Import Clear',  icon:'🛃', color:'#EF4444',
    desc:'Document verification, 7501 entry filing, customs duty payment, freight & customs release',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-32',title:'Ocean Import Clearance SOP',owner:'Raunak',priority:'critical',tags:['import','7501','customs'],link:''},
      {id:'SOP-OCN-IN-33',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','exception'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-24',title:'Import Clearance SOP — UK',owner:'Raunak',priority:'critical',tags:['import','UK','7501'],link:''},
      {id:'SOP-OCN-UK-25',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-18',title:'Import Clearance SOP — DE',owner:'Raunak',priority:'critical',tags:['import','DE','7501'],link:''},
      {id:'SOP-OCN-DE-19',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','DE'],link:''},
    ]}},
  { id:'delivery',  label:'Delivery',                          short:'Delivery',      icon:'🏁', color:'#10B981',
    desc:'Direct drayage to FBA / Walmart, or transloading + last mile delivery', subStages:['Direct Drayage','Transloading'],
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-34',title:'Drayage Delivery Operations SOP — IN to US',owner:'Raunak',priority:'critical',tags:['drayage','IN2US'],link:''},
      {id:'SOP-OCN-IN-35',title:'Drayage Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','drayage'],link:''},
      {id:'SOP-OCN-IN-36',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading','storage'],link:''},
      {id:'SOP-OCN-IN-37',title:'Transloading Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','transloading'],link:''},
      {id:'SOP-OCN-IN-38',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:''},
      {id:'SOP-OCN-IN-39',title:'XPO Truck Booking Guide',owner:'Raunak',priority:'critical',tags:['XPO','truck'],link:''},
      {id:'SOP-OCN-IN-40',title:'Walmart Appointment Scheduling Guide',owner:'Raunak',priority:'high',tags:['Walmart','appointment'],link:''},
      {id:'SOP-OCN-IN-41',title:'Amazon FBA ID / FC Redirection Guide',owner:'Raunak',priority:'critical',tags:['Amazon','FBA','redirect'],link:''},
      {id:'SOP-OCN-IN-42',title:'Everlast Inbound / Outbound Process',owner:'Raunak',priority:'medium',tags:['Everlast','warehouse'],link:''},
      {id:'SOP-OCN-IN-43',title:'FedEx Label Creation & Claim Process',owner:'Raunak',priority:'medium',tags:['FedEx','label'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-26',title:'Drayage Delivery Operations SOP — UK to US',owner:'Raunak',priority:'critical',tags:['drayage','UK2US'],link:''},
      {id:'SOP-OCN-UK-27',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading','UK'],link:''},
      {id:'SOP-OCN-UK-28',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:''},
      {id:'SOP-OCN-UK-29',title:'Walmart Appointment Scheduling Guide',owner:'Raunak',priority:'high',tags:['Walmart'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-20',title:'Drayage Delivery Operations SOP — DE to US',owner:'Raunak',priority:'critical',tags:['drayage','DE2US'],link:''},
      {id:'SOP-OCN-DE-21',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading','DE'],link:''},
      {id:'SOP-OCN-DE-22',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:''},
    ]}},
]

// ─── AIR LIFECYCLE ──────────────────────────────────────────────────
const AIR_STAGES = [
  { id:'booking',   label:'Booking Confirmation',             short:'Booking',      icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, ICL / FedEx / disaggregated booking, space allocation',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-01',title:'FedEx IN2US Quoting Tool SOP',owner:'Jaideep',priority:'critical',tags:['FedEx','quoting','ICL'],link:''},
      {id:'SOP-AIR-IN-02',title:'Disaggregated Calculator — IN2US Air SOP',owner:'Jaideep',priority:'critical',tags:['disaggregated','pricing'],link:''},
      {id:'SOP-AIR-IN-03',title:'Buy Rates Updation SOP',owner:'Jaideep',priority:'high',tags:['buy-rates'],link:''},
      {id:'SOP-AIR-IN-04',title:'Vendor Onboarding SOP',owner:'Jaideep',priority:'high',tags:['vendor','onboarding'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-01',title:'UK to US Air CS Tracker SOP',owner:'Jaideep',priority:'critical',tags:['UK','CS-tracker'],link:''},
      {id:'SOP-AIR-UK-02',title:'Buy Rates Updation SOP — UK',owner:'Jaideep',priority:'high',tags:['buy-rates','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-01',title:'DE2US Air Pricing SOP',owner:'Jaideep',priority:'critical',tags:['DE','quoting'],link:''},
    ]}},
  { id:'documents', label:'Document Verification',            short:'Doc Verify',   icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, FedEx shipping label creation',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-05',title:'New Customer Document Verification SOP',owner:'Shreyas',priority:'critical',tags:['verification','new-customer'],link:''},
      {id:'SOP-AIR-IN-06',title:'AD Code & IFSC Registration Guide',owner:'Shreyas',priority:'critical',tags:['ICEGATE','AD-code'],link:''},
      {id:'SOP-AIR-IN-07',title:'FedEx Shipping Label Creation SOP',owner:'Shreyas',priority:'critical',tags:['FedEx','label'],link:''},
      {id:'SOP-AIR-IN-08',title:'Marking & Labeling Guide SOP',owner:'Shreyas',priority:'high',tags:['packaging','labels'],link:''},
      {id:'SOP-AIR-IN-09',title:'Document Verification Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','exception'],link:''},
      {id:'SOP-AIR-IN-10',title:'Cargo Insurance Guide',owner:'Shreyas',priority:'medium',tags:['insurance'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-03',title:'New Customer Document Verification SOP — UK',owner:'Shreyas',priority:'critical',tags:['verification','UK'],link:''},
      {id:'SOP-AIR-UK-04',title:'Document Verification Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-02',title:'New Customer Document Verification SOP — DE',owner:'Shreyas',priority:'critical',tags:['verification','DE'],link:''},
    ]}},
  { id:'pickup',    label:'Pickup / Drop Off',                short:'Pickup',       icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper, CFS / RGL drop-off, checklist verification',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-11',title:'Pick Up Operations Guide — Air IN2US',owner:'Shreyas',priority:'critical',tags:['pickup','air'],link:''},
      {id:'SOP-AIR-IN-12',title:'Cargo Drop-Off Operation SOP',owner:'Shreyas',priority:'critical',tags:['drop-off','CFS'],link:''},
      {id:'SOP-AIR-IN-13',title:'Checklist Verification SOP',owner:'Shreyas',priority:'critical',tags:['checklist','CFS'],link:''},
      {id:'SOP-AIR-IN-14',title:'Pickup & Drop Off Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','exception'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-05',title:'Pick Up Operations Guide — UK',owner:'Shreyas',priority:'critical',tags:['pickup','UK'],link:''},
      {id:'SOP-AIR-UK-06',title:'Drop Off Operations Guide — UK',owner:'Shreyas',priority:'critical',tags:['drop-off','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-03',title:'Pick Up Operations Guide — DE',owner:'Shreyas',priority:'critical',tags:['pickup','DE'],link:''},
    ]}},
  { id:'consol',    label:'Consol Planning & Export Clearance',short:'Consol / Export',icon:'🏭', color:'#8B5CF6',
    desc:'CSBV + Commercial consol planning, export clearance, ICL operations, shipping bill tracking',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-15',title:'Air Consol Planning SOP (CSBV + Commercial)',owner:'Shreyas',priority:'critical',tags:['consol','CSBV'],link:''},
      {id:'SOP-AIR-IN-16',title:'Air Consol Execution SOP — CSBV',owner:'Shreyas',priority:'critical',tags:['CSBV','execution'],link:''},
      {id:'SOP-AIR-IN-17',title:'CSBV Shipment & Consol Execution SOP',owner:'Shreyas',priority:'critical',tags:['CSBV','commercial'],link:''},
      {id:'SOP-AIR-IN-18',title:'ICL Warehouse Operations SOP',owner:'Shreyas',priority:'critical',tags:['ICL','warehouse'],link:''},
      {id:'SOP-AIR-IN-19',title:'ICL Weight & Audit Update SOP',owner:'Shreyas',priority:'high',tags:['ICL','weight','audit'],link:''},
      {id:'SOP-AIR-IN-20',title:'ICL Payments SOP',owner:'Farhan',priority:'critical',tags:['ICL','payments'],link:''},
      {id:'SOP-AIR-IN-21',title:'Export Ops Rep Guide — Disaggregated Supply Chain',owner:'Olympia',priority:'high',tags:['disaggregated','export'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-07',title:'UK–US Air Ops SOP',owner:'Shreyas',priority:'critical',tags:['UK','air-ops'],link:''},
      {id:'SOP-AIR-UK-08',title:'Export Operations Issue Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-04',title:'DE–US Air Export Operations SOP',owner:'Shreyas',priority:'critical',tags:['DE','air-ops'],link:''},
    ]}},
  { id:'clearance', label:'Import Clearance',                  short:'Import Clear', icon:'🛃', color:'#EF4444',
    desc:'7501 entry validation, customs clearance, cargo pull, ISC payment',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-22',title:'Import Clearance SOP — Air',owner:'Shreyas',priority:'critical',tags:['import','7501'],link:''},
      {id:'SOP-AIR-IN-23',title:'Air Import Operations SOP — Aggregated Supply Chain',owner:'Jaison',priority:'critical',tags:['import','FedEx','aggregated'],link:''},
      {id:'SOP-AIR-IN-24',title:'Cargo Pull & ISC Payment SOP — Disaggregated',owner:'Jaison',priority:'critical',tags:['cargo-pull','ISC'],link:''},
      {id:'SOP-AIR-IN-25',title:'Chargeable Weight Updation SOP',owner:'Shreyas',priority:'high',tags:['chargeable-weight'],link:''},
      {id:'SOP-AIR-IN-26',title:'Internal WBR Data Review & Callouts SOP',owner:'Shreyas',priority:'medium',tags:['WBR','reporting'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-09',title:'Import Clearance SOP — Air UK',owner:'Shreyas',priority:'critical',tags:['import','UK'],link:''},
      {id:'SOP-AIR-UK-10',title:'Cargo Recovery and ISC Payment SOP',owner:'Shreyas',priority:'critical',tags:['cargo-pull','ISC'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-05',title:'Import Clearance SOP — Air DE',owner:'Shreyas',priority:'critical',tags:['import','DE'],link:''},
    ]}},
  { id:'delivery',  label:'Delivery',                          short:'Delivery',     icon:'🏁', color:'#10B981',
    desc:'FedEx last-mile delivery (aggregated) or destination delivery for disaggregated shipments', subStages:['FedEx Aggregated','Disaggregated Last Mile'],
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-27',title:'Import Clearance & Delivery — FedEx',owner:'Jaison',priority:'critical',tags:['FedEx','delivery'],link:''},
      {id:'SOP-AIR-IN-28',title:'Amazon WBR Data Review SOP',owner:'Shreyas',priority:'medium',tags:['WBR','Amazon'],link:''},
      {id:'SOP-AIR-IN-29',title:'FedEx Claim Process SOP',owner:'Raunak',priority:'medium',tags:['FedEx','claim'],link:''},
      {id:'SOP-AIR-IN-30',title:'FedEx Labels Creation SOP',owner:'Raunak',priority:'medium',tags:['FedEx','label'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-11',title:'Destination Delivery — Last Mile (UK)',owner:'Piyush',priority:'critical',tags:['last-mile','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-06',title:'Destination Delivery — Last Mile (DE)',owner:'Shreyas',priority:'critical',tags:['last-mile','DE'],link:''},
    ]}},
]

// ─── PRIORITY CONFIG ────────────────────────────────────────────────
const PC = { critical:'#EF4444', high:'#F59E0B', medium:'#3B82F6', low:'#94A3B8' }
const PBg = { critical:'#FEF2F2', high:'#FFFBEB', medium:'#EFF6FF', low:'#F8FAFC' }
const PBd = { critical:'#FECACA', high:'#FDE68A', medium:'#BFDBFE', low:'#E2E8F0' }

// ─── STAGE TIMELINE ────────────────────────────────────────────────
function StageTimeline({ stages, activeId, onSelect, lane }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:4 }}>
      <div style={{ display:'flex', alignItems:'flex-start', minWidth: stages.length * 110 }}>
        {stages.map((s, i) => {
          const isActive = s.id === activeId
          const isLast = i === stages.length - 1
          const sopCount = s.sops[lane]?.length || 0
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', flex: isLast ? 0 : 1 }}>
              <div onClick={() => onSelect(s.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', flexShrink:0 }}>
                {/* Node */}
                <div style={{
                  width: isActive ? 48 : 40, height: isActive ? 48 : 40, borderRadius:'50%', flexShrink:0,
                  background: isActive ? s.color : '#F1F5F9',
                  border: isActive ? `2px solid ${s.color}` : '2px solid #E2E8F0',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: isActive ? 20 : 15, transition:'all .2s',
                  boxShadow: isActive ? `0 0 0 4px ${s.color}20` : 'none',
                }}>
                  {s.icon}
                </div>
                {/* Label */}
                <div style={{
                  fontSize: 9, letterSpacing:.3, textTransform:'uppercase', fontWeight: isActive ? 700 : 500,
                  color: isActive ? s.color : '#94A3B8', textAlign:'center', maxWidth:80, lineHeight:1.3,
                }}>
                  {s.short}
                </div>
                {/* Count pill */}
                <div style={{
                  fontSize:9, fontWeight:600, padding:'1px 7px', borderRadius:20,
                  background: isActive ? s.color : '#F1F5F9',
                  color: isActive ? '#fff' : '#94A3B8',
                  border: isActive ? `1px solid ${s.color}` : '1px solid #E2E8F0',
                }}>
                  {sopCount} SOPs
                </div>
              </div>
              {/* Connector */}
              {!isLast && (
                <div style={{
                  flex:1, height:2, marginBottom:44,
                  background:`linear-gradient(90deg,${stages[i].color}33,${stages[i+1].color}33)`
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SOP CARD ───────────────────────────────────────────────────────
function SOPCard({ sop, stageColor }) {
  return (
    <div
      onClick={() => sop.link && window.open(sop.link,'_blank')}
      style={{
        background:'#fff', borderRadius:10, padding:'14px 16px',
        border:'1.5px solid #E2E8F0', cursor: sop.link ? 'pointer' : 'default',
        transition:'all .15s', boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
        borderTop:`3px solid ${PC[sop.priority]}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = stageColor; e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.08)` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:600, color: stageColor, letterSpacing:.5, marginBottom:4, textTransform:'uppercase' }}>
            {sop.id}
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:'#0F172A', lineHeight:1.4 }}>{sop.title}</div>
        </div>
        <div style={{
          fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20, flexShrink:0,
          background: PBg[sop.priority], color: PC[sop.priority],
          border:`1px solid ${PBd[sop.priority]}`, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:.4,
        }}>
          {sop.priority}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#64748B' }}>
          <span>👤</span> <span>{sop.owner}</span>
        </div>
        {sop.link && (
          <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'#FF6B2B', marginLeft:'auto' }}>
            <span>↗</span> <span style={{ fontWeight:600 }}>Open Doc</span>
          </div>
        )}
        <div style={{ display:'flex', gap:4, marginLeft: sop.link ? 0 : 'auto', flexWrap:'wrap' }}>
          {sop.tags.slice(0,3).map(t => (
            <div key={t} style={{
              fontSize:9, padding:'2px 7px', borderRadius:20, fontWeight:500,
              background:'#F1F5F9', border:'1px solid #E2E8F0', color:'#64748B',
            }}>#{t}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN VIEW ──────────────────────────────────────────────────────
export default function PublicView() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [mode, setMode] = useState('ocean')
  const [lane, setLane] = useState('IN2US')
  const [activeStageId, setActiveStageId] = useState('booking')
  const [search, setSearch] = useState('')

  const stages = mode === 'ocean' ? OCEAN_STAGES : AIR_STAGES
  const activeStage = stages.find(s => s.id === activeStageId) || stages[0]

  const handleMode = (m) => { setMode(m); setActiveStageId(stages[0].id); setSearch('') }
  const handleStage = (id) => { setActiveStageId(id); setSearch('') }

  const stageSops = activeStage.sops[lane] || []
  const filtered = stageSops.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )

  const totalLaneSops = stages.reduce((a,s) => a + (s.sops[lane]?.length || 0), 0)

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F8FAFC' }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside style={{
        width:230, minWidth:230, background:'#0F172A',
        display:'flex', flexDirection:'column', overflow:'hidden',
        boxShadow:'2px 0 8px rgba(0,0,0,0.12)',
      }}>
        {/* Logo */}
        <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{
              width:36, height:36, borderRadius:8, background:'#FF6B2B',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900,
            }}>X</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#FFFFFF', letterSpacing:.5 }}>Xhipment</div>
              <div style={{ fontSize:9, color:'#64748B', letterSpacing:1.5, textTransform:'uppercase' }}>SOP Portal</div>
            </div>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', animation:'pulse 2s infinite' }} />
            <div style={{ fontSize:9, fontWeight:600, color:'#10B981', letterSpacing:1 }}>LIVE</div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ padding:'16px 14px 12px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>Mode</div>
          <div style={{ display:'flex', gap:6, background:'#1E293B', padding:4, borderRadius:8 }}>
            {[['ocean','🚢','Ocean'],['air','✈️','Air']].map(([m,icon,label]) => (
              <button key={m} onClick={() => handleMode(m)} style={{
                flex:1, padding:'7px 4px', borderRadius:6, cursor:'pointer', border:'none',
                background: mode === m ? '#FF6B2B' : 'transparent',
                color: mode === m ? '#fff' : '#64748B',
                fontSize:12, fontWeight: mode === m ? 700 : 500,
                transition:'all .15s',
              }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lane Filter */}
        <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>Trade Lane</div>
          {['IN2US','UK2US','DE2US'].map(l => (
            <div key={l} onClick={() => setLane(l)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'8px 12px', borderRadius:6, cursor:'pointer', marginBottom:4,
              background: lane === l ? 'rgba(255,107,43,0.15)' : 'transparent',
              border: lane === l ? '1px solid rgba(255,107,43,0.4)' : '1px solid transparent',
              transition:'all .15s',
            }}>
              <span style={{ fontSize:12, fontWeight: lane === l ? 700 : 500, color: lane === l ? '#FF6B2B' : '#94A3B8' }}>{l}</span>
              <span style={{ fontSize:10, fontWeight:600, color: lane === l ? '#FF6B2B' : '#475569', background: lane === l ? 'rgba(255,107,43,0.1)' : '#1E293B', padding:'1px 7px', borderRadius:20 }}>
                {stages.reduce((a,s) => a + (s.sops[l]?.length || 0), 0)}
              </span>
            </div>
          ))}
        </div>

        {/* Stage Nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px 10px' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10, paddingLeft:4 }}>Lifecycle Stages</div>
          {stages.map(s => {
            const isActive = s.id === activeStageId
            const count = s.sops[lane]?.length || 0
            return (
              <div key={s.id} onClick={() => handleStage(s.id)} style={{
                display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                borderRadius:8, cursor:'pointer', marginBottom:2,
                background: isActive ? 'rgba(255,107,43,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #FF6B2B' : '3px solid transparent',
                transition:'all .15s',
              }}>
                <span style={{ fontSize:13 }}>{s.icon}</span>
                <span style={{ fontSize:11, color: isActive ? '#FF6B2B' : '#94A3B8', flex:1, lineHeight:1.3, fontWeight: isActive ? 600 : 400 }}>{s.short}</span>
                <span style={{ fontSize:10, fontWeight:700, color: isActive ? '#FF6B2B' : '#475569', background: isActive ? 'rgba(255,107,43,0.15)' : '#1E293B', borderRadius:20, padding:'1px 6px' }}>
                  {count}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 14px', borderTop:'1px solid #1E293B' }}>
          <button
            onClick={() => navigate(isAdmin ? '/admin' : '/admin/login')}
            style={{
              width:'100%', padding:'9px', borderRadius:8, cursor:'pointer', fontSize:12,
              fontWeight:600, border:'1px solid rgba(255,107,43,0.35)',
              background: isAdmin ? 'rgba(255,107,43,0.15)' : 'transparent',
              color: isAdmin ? '#FF6B2B' : '#64748B', transition:'all .15s',
            }}
          >
            {isAdmin ? '⚙️ Admin Dashboard' : '🔐 Admin Login'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <div style={{ height:60, padding:'0 24px', background:'#fff', borderBottom:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'#0F172A', letterSpacing:-.2 }}>
              {mode === 'ocean' ? '🚢' : '✈️'} {mode === 'ocean' ? 'Ocean' : 'Air'} <span style={{ color:'#FF6B2B' }}>SOP Lifecycle</span>
            </div>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{lane} · {totalLaneSops} SOPs across {stages.length} stages</div>
          </div>
          <div style={{ flex:1 }} />
          {/* Search */}
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', fontSize:14 }}>🔍</span>
            <input
              placeholder="Search SOPs, owners, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, width:260, fontSize:13 }}
            />
          </div>
        </div>

        {/* Timeline bar */}
        <div style={{ background:'#fff', borderBottom:'1.5px solid #E2E8F0', padding:'16px 24px 4px', flexShrink:0 }}>
          <StageTimeline stages={stages} activeId={activeStageId} onSelect={handleStage} lane={lane} />
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 32px' }}>

          {/* Stage header card */}
          <div style={{
            background:'#fff', border:'1.5px solid #E2E8F0', borderRadius:12,
            padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14,
            boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
            borderLeft:`4px solid ${activeStage.color}`,
          }}>
            <div style={{
              width:48, height:48, borderRadius:10, flexShrink:0,
              background:`${activeStage.color}14`, border:`1.5px solid ${activeStage.color}33`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
            }}>{activeStage.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#0F172A', marginBottom:3 }}>{activeStage.label}</div>
              <div style={{ fontSize:12, color:'#64748B' }}>{activeStage.desc}</div>
              {activeStage.subStages && (
                <div style={{ display:'flex', gap:6, marginTop:8 }}>
                  {activeStage.subStages.map(sub => (
                    <div key={sub} style={{
                      fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20,
                      background:`${activeStage.color}10`, border:`1px solid ${activeStage.color}30`,
                      color:activeStage.color,
                    }}>⤷ {sub}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:28, fontWeight:900, color:activeStage.color, lineHeight:1 }}>{filtered.length}</div>
              <div style={{ fontSize:10, color:'#94A3B8', fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>SOPs · {lane}</div>
            </div>
          </div>

          {/* SOP grid */}
          {filtered.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
              {filtered.map(sop => <SOPCard key={sop.id} sop={sop} stageColor={activeStage.color} />)}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'80px 20px' }}>
              <div style={{ fontSize:42, marginBottom:14 }}>📭</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#0F172A', marginBottom:6 }}>
                {search ? 'No SOPs match your search' : 'No SOPs added for this stage yet'}
              </div>
              <div style={{ fontSize:13, color:'#94A3B8' }}>
                {search ? 'Try a different keyword or clear the search.' : 'Add SOPs from the Admin Dashboard.'}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
