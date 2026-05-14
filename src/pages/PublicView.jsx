import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/supabase'
import { useAuth } from '../App'

// ─── OCEAN LIFECYCLE ──────────────────────────────────────────────────────────
const OCEAN_STAGES = [
  {
    id: 'booking', label: 'Booking Confirmation', short: 'Booking', icon: '📋', color: '#E8940A',
    desc: 'Rate confirmation, space booking, liner selection & amendment process',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-01', title:'Container Booking SOP', owner:'Jaideep', priority:'critical', tags:['MAERSK','OOCL','CMA'], link:'https://docs.google.com/document/d/container-booking' },
        { id:'SOP-OCN-IN-02', title:'India to US Ocean Quoting Process SOP', owner:'Jaideep', priority:'critical', tags:['LCL','FCL','pricing'], link:'' },
        { id:'SOP-OCN-IN-03', title:'Port of Discharge Estimator SOP', owner:'Jaideep', priority:'high', tags:['POD','routing'], link:'' },
        { id:'SOP-OCN-IN-04', title:'Liner Issue / Exception Handling SOP', owner:'Jaideep', priority:'high', tags:['exception','liner'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-01', title:'Container Booking SOP — UK Export', owner:'Jaideep', priority:'critical', tags:['UK','FCL','booking'], link:'' },
        { id:'SOP-OCN-UK-02', title:'UK2US LCL Calculator SOP', owner:'Jaideep', priority:'high', tags:['LCL','pricing'], link:'' },
        { id:'SOP-OCN-UK-03', title:'UK Pickup Calculator SOP', owner:'Jaideep', priority:'high', tags:['pickup','pricing'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-01', title:'Container Booking SOP — DE Export', owner:'Jaideep', priority:'critical', tags:['DE','FCL','booking'], link:'' },
        { id:'SOP-OCN-DE-02', title:'DE2US LCL Calculator SOP', owner:'Jaideep', priority:'high', tags:['LCL','pricing'], link:'' },
      ],
    }
  },
  {
    id: 'documents', label: 'Document Verification', short: 'Doc Verify', icon: '📄', color: '#4A8EE8',
    desc: 'Commercial invoice, packing list, AD code, FBA IDs, cargo insurance',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-05', title:'Export Document Collection & Verification SOP', owner:'Rohan', priority:'critical', tags:['verification','IN2US'], link:'https://docs.google.com/document/d/export-doc-verification' },
        { id:'SOP-OCN-IN-06', title:'Document Verification Checklist', owner:'Rohan', priority:'critical', tags:['checklist'], link:'' },
        { id:'SOP-OCN-IN-07', title:'AD Code & IFSC Registration Guide', owner:'Rohan', priority:'critical', tags:['ICEGATE','AD-code'], link:'' },
        { id:'SOP-OCN-IN-08', title:'Marking & Labeling Guide', owner:'Rohan', priority:'high', tags:['packaging','labels'], link:'' },
        { id:'SOP-OCN-IN-09', title:'FBA ID and PO ID Collection Guide', owner:'Rohan', priority:'critical', tags:['Amazon','FBA','Walmart'], link:'' },
        { id:'SOP-OCN-IN-10', title:'Cargo Insurance Procurement Guide', owner:'Rohan', priority:'medium', tags:['insurance'], link:'' },
        { id:'SOP-OCN-IN-11', title:'Document Verification Exception Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-04', title:'New Customer Document Verification SOP', owner:'Rohan', priority:'critical', tags:['verification','new-customer'], link:'' },
        { id:'SOP-OCN-UK-05', title:'Existing Customer Document Verification SOP', owner:'Rohan', priority:'critical', tags:['verification','existing'], link:'' },
        { id:'SOP-OCN-UK-06', title:'EORI Number Procurement Guide', owner:'Rohan', priority:'high', tags:['EORI','UK','compliance'], link:'' },
        { id:'SOP-OCN-UK-07', title:'Marking & Labeling Guide SOP', owner:'Rohan', priority:'high', tags:['packaging','labels'], link:'' },
        { id:'SOP-OCN-UK-08', title:'FBA ID and PO ID Collection Guide', owner:'Rohan', priority:'critical', tags:['Amazon','FBA'], link:'' },
        { id:'SOP-OCN-UK-09', title:'Document Verification Exception Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-03', title:'New Customer Document Verification SOP — DE', owner:'Rohan', priority:'critical', tags:['verification','DE'], link:'' },
        { id:'SOP-OCN-DE-04', title:'Existing Customer Document Verification SOP — DE', owner:'Rohan', priority:'critical', tags:['verification','DE'], link:'' },
        { id:'SOP-OCN-DE-05', title:'EORI Number Procurement Guide', owner:'Rohan', priority:'high', tags:['EORI','DE','compliance'], link:'' },
        { id:'SOP-OCN-DE-06', title:'Cargo Insurance Guide — DE', owner:'Rohan', priority:'medium', tags:['insurance','DE'], link:'' },
      ],
    }
  },
  {
    id: 'pickup', label: 'Pickup / Drop Off', short: 'Pickup', icon: '🚚', color: '#0FB57A',
    desc: 'Cargo pickup from shipper warehouse, drop-off at CFS',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-12', title:'Ocean Pickup Operations SOP', owner:'Rohan', priority:'critical', tags:['pickup','vendor'], link:'' },
        { id:'SOP-OCN-IN-13', title:'Drop Off Operations Guide', owner:'Rohan', priority:'critical', tags:['CFS','drop-off'], link:'' },
        { id:'SOP-OCN-IN-14', title:'Pickup & Drop Off Exception Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-10', title:'Pick Up Operations Guide — UK', owner:'Rohan', priority:'critical', tags:['pickup','UK'], link:'' },
        { id:'SOP-OCN-UK-11', title:'Drop Off Operations Guide — UK', owner:'Rohan', priority:'critical', tags:['drop-off','UK'], link:'' },
        { id:'SOP-OCN-UK-12', title:'Pickup & Drop Off Exception Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-07', title:'Pick Up Operations Guide — DE', owner:'Rohan', priority:'critical', tags:['pickup','DE'], link:'' },
        { id:'SOP-OCN-DE-08', title:'Drop Off Operations Guide — DE', owner:'Rohan', priority:'critical', tags:['drop-off','DE'], link:'' },
      ],
    }
  },
  {
    id: 'carting', label: 'Carting & Export Clearance', short: 'Carting', icon: '🏭', color: '#9B59B6',
    desc: 'CFS inbound, checklist validation, customs export clearance, AMS / ISF filing',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-15', title:'Checklist Generation & CFS Inbound SOP', owner:'Rohan', priority:'critical', tags:['checklist','CFS'], link:'' },
        { id:'SOP-OCN-IN-16', title:'Export Clearance SOP', owner:'Rohan', priority:'critical', tags:['customs','clearance'], link:'' },
        { id:'SOP-OCN-IN-17', title:'AMS Submission Process — TradeTech', owner:'Rohan', priority:'critical', tags:['AMS','TradeTech'], link:'' },
        { id:'SOP-OCN-IN-18', title:'ISF Submission Process — TradeTech', owner:'Rohan', priority:'critical', tags:['ISF','TradeTech'], link:'' },
        { id:'SOP-OCN-IN-19', title:'AMS / ISF Validation Guide', owner:'Rohan', priority:'critical', tags:['AMS','ISF','validation'], link:'' },
        { id:'SOP-OCN-IN-20', title:'Export Operations Issue Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-13', title:'Container / Exports Planning SOP — UK', owner:'Rohan', priority:'high', tags:['planning','UK'], link:'' },
        { id:'SOP-OCN-UK-14', title:'Export Clearance SOP — UK', owner:'Rohan', priority:'critical', tags:['clearance','UK'], link:'' },
        { id:'SOP-OCN-UK-15', title:'AMS Submission Process — TradeTech', owner:'Rohan', priority:'critical', tags:['AMS','TradeTech'], link:'' },
        { id:'SOP-OCN-UK-16', title:'ISF Submission Process — TradeTech', owner:'Rohan', priority:'critical', tags:['ISF','TradeTech'], link:'' },
        { id:'SOP-OCN-UK-17', title:'Export Operations Issue Handling Guide', owner:'Rohan', priority:'high', tags:['FAQ'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-09', title:'Container / Exports Planning SOP — DE', owner:'Rohan', priority:'high', tags:['planning','DE'], link:'' },
        { id:'SOP-OCN-DE-10', title:'Export Clearance SOP — DE', owner:'Rohan', priority:'critical', tags:['clearance','DE'], link:'' },
        { id:'SOP-OCN-DE-11', title:'AMS / ISF Submission Process', owner:'Rohan', priority:'critical', tags:['AMS','ISF'], link:'' },
      ],
    }
  },
  {
    id: 'stuffing', label: 'Empty Container Pickup & Stuffing', short: 'Stuffing', icon: '📦', color: '#E67E22',
    desc: 'Empty container pickup from depot, loading plan, stuffing & sealing',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-21', title:'Container / Exports Planning SOP', owner:'Rohan', priority:'high', tags:['planning','FCL'], link:'' },
        { id:'SOP-OCN-IN-22', title:'Container Loading Plan Generation SOP', owner:'Rohan', priority:'high', tags:['loading','stuffing'], link:'' },
        { id:'SOP-OCN-IN-23', title:'INNTRA Shipping Instructions Filing Guide', owner:'Rohan', priority:'critical', tags:['SI','INNTRA','liner'], link:'' },
        { id:'SOP-OCN-IN-24', title:'House Bill of Lading Creation Process', owner:'Rohan', priority:'critical', tags:['HBL','documentation'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-18', title:'Container Loading Plan Generation SOP — UK', owner:'Rohan', priority:'high', tags:['loading','UK'], link:'' },
        { id:'SOP-OCN-UK-19', title:'House Bill of Lading Creation Process', owner:'Rohan', priority:'critical', tags:['HBL'], link:'' },
        { id:'SOP-OCN-UK-20', title:'Entire Export Operations Workflow — UK', owner:'Rohan', priority:'high', tags:['workflow','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-12', title:'Container Loading Plan Generation SOP — DE', owner:'Rohan', priority:'high', tags:['loading','DE'], link:'' },
        { id:'SOP-OCN-DE-13', title:'House Bill of Lading Creation Process — DE', owner:'Rohan', priority:'critical', tags:['HBL','DE'], link:'' },
        { id:'SOP-OCN-DE-14', title:'Entire Export Operations Workflow — DE', owner:'Rohan', priority:'high', tags:['workflow','DE'], link:'' },
      ],
    }
  },
  {
    id: 'sailout', label: 'Container Gate In & Sail Out', short: 'Sail Out', icon: '🚢', color: '#12B5CC',
    desc: 'Gate-in confirmation, BL release, freight release, sailing milestone tracking',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-25', title:'SWB Release & Freight Release SOP', owner:'Farhan', priority:'critical', tags:['BL','freight-release'], link:'' },
        { id:'SOP-OCN-IN-26', title:'OOCL BL & Freight Release Process', owner:'Farhan', priority:'critical', tags:['OOCL'], link:'' },
        { id:'SOP-OCN-IN-27', title:'CMA CGM BL / Freight Release', owner:'Farhan', priority:'critical', tags:['CMA-CGM'], link:'' },
        { id:'SOP-OCN-IN-28', title:'CP World BL / Freight Release Process', owner:'Farhan', priority:'high', tags:['CP-World'], link:'' },
        { id:'SOP-OCN-IN-29', title:'Noble Shipping BL / Freight Release', owner:'Farhan', priority:'high', tags:['Noble'], link:'' },
        { id:'SOP-OCN-IN-30', title:'Liner Origin D+D Information SOP', owner:'Jaideep', priority:'high', tags:['demurrage','detention'], link:'' },
        { id:'SOP-OCN-IN-31', title:'Customs & Freight Release Check Guide', owner:'Raunak', priority:'critical', tags:['freight-release','terminal'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-21', title:'SWB Release & Freight Release SOP', owner:'Farhan', priority:'critical', tags:['BL','freight-release'], link:'' },
        { id:'SOP-OCN-UK-22', title:'Liner Origin D+D Information SOP — UK', owner:'Jaideep', priority:'high', tags:['demurrage','detention'], link:'' },
        { id:'SOP-OCN-UK-23', title:'Customs & Freight Release Check Guide', owner:'Raunak', priority:'critical', tags:['freight-release'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-15', title:'SWB Release & Freight Release SOP', owner:'Farhan', priority:'critical', tags:['BL','freight-release'], link:'' },
        { id:'SOP-OCN-DE-16', title:'Liner Origin D+D Information SOP — DE', owner:'Jaideep', priority:'high', tags:['demurrage','DE'], link:'' },
        { id:'SOP-OCN-DE-17', title:'Customs & Freight Release Check Guide', owner:'Raunak', priority:'critical', tags:['freight-release'], link:'' },
      ],
    }
  },
  {
    id: 'clearance', label: 'Import Clearance', short: 'Import Clear', icon: '🛃', color: '#E84040',
    desc: 'Document verification, 7501 entry filing, customs duty, freight & customs release',
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-32', title:'Ocean Import Clearance SOP', owner:'Raunak', priority:'critical', tags:['import','7501','customs'], link:'' },
        { id:'SOP-OCN-IN-33', title:'Import Clearance Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','exception'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-24', title:'Import Clearance SOP — UK', owner:'Raunak', priority:'critical', tags:['import','UK','7501'], link:'' },
        { id:'SOP-OCN-UK-25', title:'Import Clearance Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-18', title:'Import Clearance SOP — DE', owner:'Raunak', priority:'critical', tags:['import','DE','7501'], link:'' },
        { id:'SOP-OCN-DE-19', title:'Import Clearance Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','DE'], link:'' },
      ],
    }
  },
  {
    id: 'delivery', label: 'Delivery', short: 'Delivery', icon: '🏁', color: '#0FB57A',
    desc: 'Direct drayage to FBA / Walmart warehouse, or transloading + last mile delivery',
    subStages: ['Direct Drayage', 'Transloading'],
    sops: {
      'IN2US': [
        { id:'SOP-OCN-IN-34', title:'Drayage Delivery Operations SOP — IN to US', owner:'Raunak', priority:'critical', tags:['drayage','IN2US'], link:'' },
        { id:'SOP-OCN-IN-35', title:'Drayage Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','drayage'], link:'' },
        { id:'SOP-OCN-IN-36', title:'Transloading / Storage SOP', owner:'Raunak', priority:'critical', tags:['transloading','storage'], link:'' },
        { id:'SOP-OCN-IN-37', title:'Transloading Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','transloading'], link:'' },
        { id:'SOP-OCN-IN-38', title:'Amazon Freight Booking Guidelines', owner:'Raunak', priority:'critical', tags:['Amazon','FBA'], link:'' },
        { id:'SOP-OCN-IN-39', title:'XPO Truck Booking Guide', owner:'Raunak', priority:'critical', tags:['XPO','truck'], link:'' },
        { id:'SOP-OCN-IN-40', title:'Walmart Appointment Scheduling Guide', owner:'Raunak', priority:'high', tags:['Walmart','appointment'], link:'' },
        { id:'SOP-OCN-IN-41', title:'Amazon FBA ID / FC Redirection Guide', owner:'Raunak', priority:'critical', tags:['Amazon','FBA','redirect'], link:'' },
        { id:'SOP-OCN-IN-42', title:'Everlast Inbound / Outbound Process', owner:'Raunak', priority:'medium', tags:['Everlast','warehouse'], link:'' },
        { id:'SOP-OCN-IN-43', title:'FedEx Label Creation & Claim Process', owner:'Raunak', priority:'medium', tags:['FedEx','label'], link:'' },
        { id:'SOP-OCN-IN-44', title:'Container Detention Calculation SOP', owner:'Raunak', priority:'high', tags:['detention','demurrage'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-OCN-UK-26', title:'Drayage Delivery Operations SOP — UK to US', owner:'Raunak', priority:'critical', tags:['drayage','UK2US'], link:'' },
        { id:'SOP-OCN-UK-27', title:'Drayage Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','drayage'], link:'' },
        { id:'SOP-OCN-UK-28', title:'Transloading / Storage SOP', owner:'Raunak', priority:'critical', tags:['transloading','UK'], link:'' },
        { id:'SOP-OCN-UK-29', title:'Amazon Freight Booking Guidelines', owner:'Raunak', priority:'critical', tags:['Amazon','FBA'], link:'' },
        { id:'SOP-OCN-UK-30', title:'Walmart Appointment Scheduling Guide', owner:'Raunak', priority:'high', tags:['Walmart'], link:'' },
        { id:'SOP-OCN-UK-31', title:'Partner Portal Destination Handling SOP', owner:'Mustafa', priority:'medium', tags:['partner','portal'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-OCN-DE-20', title:'Drayage Delivery Operations SOP — DE to US', owner:'Raunak', priority:'critical', tags:['drayage','DE2US'], link:'' },
        { id:'SOP-OCN-DE-21', title:'Drayage Issue Handling Guide', owner:'Raunak', priority:'high', tags:['FAQ','drayage'], link:'' },
        { id:'SOP-OCN-DE-22', title:'Transloading / Storage SOP', owner:'Raunak', priority:'critical', tags:['transloading','DE'], link:'' },
        { id:'SOP-OCN-DE-23', title:'Amazon Freight Booking Guidelines', owner:'Raunak', priority:'critical', tags:['Amazon','FBA'], link:'' },
        { id:'SOP-OCN-DE-24', title:'Walmart Appointment Scheduling Guide', owner:'Raunak', priority:'high', tags:['Walmart'], link:'' },
      ],
    }
  },
]

// ─── AIR LIFECYCLE ────────────────────────────────────────────────────────────
const AIR_STAGES = [
  {
    id: 'booking', label: 'Booking Confirmation', short: 'Booking', icon: '📋', color: '#E8940A',
    desc: 'Rate confirmation, ICL / FedEx / disaggregated booking, space allocation',
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-01', title:'FedEx IN2US Quoting Tool SOP', owner:'Jaideep', priority:'critical', tags:['FedEx','quoting','ICL'], link:'' },
        { id:'SOP-AIR-IN-02', title:'Disaggregated Calculator — IN2US Air SOP', owner:'Jaideep', priority:'critical', tags:['disaggregated','pricing'], link:'' },
        { id:'SOP-AIR-IN-03', title:'Buy Rates Updation SOP', owner:'Jaideep', priority:'high', tags:['buy-rates','procurement'], link:'' },
        { id:'SOP-AIR-IN-04', title:'Vendor Onboarding SOP', owner:'Jaideep', priority:'high', tags:['vendor','onboarding'], link:'' },
        { id:'SOP-AIR-IN-05', title:'Pricing Support — Ticket Handling SOP', owner:'Jaideep', priority:'medium', tags:['pricing','support'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-01', title:'UK to US Air CS Tracker SOP', owner:'Jaideep', priority:'critical', tags:['UK','quoting','CS-tracker'], link:'' },
        { id:'SOP-AIR-UK-02', title:'Buy Rates Updation SOP — UK', owner:'Jaideep', priority:'high', tags:['buy-rates','UK'], link:'' },
        { id:'SOP-AIR-UK-03', title:'Vendor Payments SOP', owner:'Farhan', priority:'high', tags:['payments','vendor'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-01', title:'DE2US Air Pricing SOP', owner:'Jaideep', priority:'critical', tags:['DE','quoting'], link:'' },
        { id:'SOP-AIR-DE-02', title:'Vendor Payments SOP — DE', owner:'Farhan', priority:'high', tags:['payments','DE'], link:'' },
      ],
    }
  },
  {
    id: 'documents', label: 'Document Verification', short: 'Doc Verify', icon: '📄', color: '#4A8EE8',
    desc: 'Commercial invoice, packing list, AD code, FBA IDs, FedEx shipping label',
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-06', title:'New Customer Document Verification SOP', owner:'Shreyas', priority:'critical', tags:['verification','new-customer'], link:'' },
        { id:'SOP-AIR-IN-07', title:'AD Code & IFSC Registration Guide', owner:'Shreyas', priority:'critical', tags:['ICEGATE','AD-code'], link:'' },
        { id:'SOP-AIR-IN-08', title:'FedEx Shipping Label Creation SOP', owner:'Shreyas', priority:'critical', tags:['FedEx','label'], link:'' },
        { id:'SOP-AIR-IN-09', title:'Document Verification Exception Handling Guide', owner:'Shreyas', priority:'high', tags:['FAQ','exception'], link:'' },
        { id:'SOP-AIR-IN-10', title:'Marking & Labeling Guide SOP', owner:'Shreyas', priority:'high', tags:['packaging','labels'], link:'' },
        { id:'SOP-AIR-IN-11', title:'Cargo Insurance Guide', owner:'Shreyas', priority:'medium', tags:['insurance'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-04', title:'New Customer Document Verification SOP — UK', owner:'Shreyas', priority:'critical', tags:['verification','UK'], link:'' },
        { id:'SOP-AIR-UK-05', title:'Document Verification Exception Handling Guide', owner:'Shreyas', priority:'high', tags:['FAQ','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-03', title:'New Customer Document Verification SOP — DE', owner:'Shreyas', priority:'critical', tags:['verification','DE'], link:'' },
        { id:'SOP-AIR-DE-04', title:'AD Code & IFSC Registration Guide', owner:'Shreyas', priority:'critical', tags:['AD-code','DE'], link:'' },
      ],
    }
  },
  {
    id: 'pickup', label: 'Pickup / Drop Off', short: 'Pickup', icon: '🚚', color: '#0FB57A',
    desc: 'Cargo pickup from shipper, porter booking, CFS / RGL drop-off',
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-12', title:'Pick Up Operations Guide — Air IN2US', owner:'Shreyas', priority:'critical', tags:['pickup','air'], link:'' },
        { id:'SOP-AIR-IN-13', title:'Cargo Drop-Off Operation SOP', owner:'Shreyas', priority:'critical', tags:['drop-off','CFS'], link:'' },
        { id:'SOP-AIR-IN-14', title:'Pickup & Drop Off Exception Handling Guide', owner:'Shreyas', priority:'high', tags:['FAQ','exception'], link:'' },
        { id:'SOP-AIR-IN-15', title:'Checklist Verification SOP', owner:'Shreyas', priority:'critical', tags:['checklist','CFS'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-06', title:'Pick Up Operations Guide — UK', owner:'Shreyas', priority:'critical', tags:['pickup','UK'], link:'' },
        { id:'SOP-AIR-UK-07', title:'Drop Off Operations Guide — UK', owner:'Shreyas', priority:'critical', tags:['drop-off','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-05', title:'Pick Up Operations Guide — DE', owner:'Shreyas', priority:'critical', tags:['pickup','DE'], link:'' },
        { id:'SOP-AIR-DE-06', title:'Drop Off Operations Guide — DE', owner:'Shreyas', priority:'critical', tags:['drop-off','DE'], link:'' },
      ],
    }
  },
  {
    id: 'consol', label: 'Consol Planning & Export Clearance', short: 'Consol / Export', icon: '🏭', color: '#9B59B6',
    desc: 'CSBV + Commercial consol planning, export clearance, shipping bill tracking',
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-16', title:'Air Consol Planning SOP (CSBV + Commercial)', owner:'Shreyas', priority:'critical', tags:['consol','CSBV','planning'], link:'' },
        { id:'SOP-AIR-IN-17', title:'Air Consol Execution SOP — CSBV', owner:'Shreyas', priority:'critical', tags:['consol','CSBV','execution'], link:'' },
        { id:'SOP-AIR-IN-18', title:'CSBV Shipment & Consol Execution SOP', owner:'Shreyas', priority:'critical', tags:['CSBV','commercial'], link:'' },
        { id:'SOP-AIR-IN-19', title:'ICL Weight & Audit Update SOP', owner:'Shreyas', priority:'high', tags:['ICL','weight','audit'], link:'' },
        { id:'SOP-AIR-IN-20', title:'Export Ops Rep Guide — Disaggregated Supply Chain', owner:'Olympia', priority:'high', tags:['disaggregated','export'], link:'' },
        { id:'SOP-AIR-IN-21', title:'ICL Warehouse Operations SOP', owner:'Shreyas', priority:'critical', tags:['ICL','warehouse'], link:'' },
        { id:'SOP-AIR-IN-22', title:'ICL Payments SOP', owner:'Farhan', priority:'critical', tags:['ICL','payments'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-08', title:'UK–US Air Ops SOP', owner:'Shreyas', priority:'critical', tags:['UK','air-ops'], link:'' },
        { id:'SOP-AIR-UK-09', title:'Export Operations Issue Handling Guide', owner:'Shreyas', priority:'high', tags:['FAQ','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-07', title:'DE–US Air Export Operations SOP', owner:'Shreyas', priority:'critical', tags:['DE','air-ops'], link:'' },
        { id:'SOP-AIR-DE-08', title:'Export Clearance SOP — DE', owner:'Shreyas', priority:'critical', tags:['clearance','DE'], link:'' },
      ],
    }
  },
  {
    id: 'clearance', label: 'Import Clearance', short: 'Import Clear', icon: '🛃', color: '#E84040',
    desc: '7501 entry validation, customs clearance, cargo pull, ISC payment',
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-23', title:'Import Clearance SOP — Air', owner:'Shreyas', priority:'critical', tags:['import','7501','clearance'], link:'' },
        { id:'SOP-AIR-IN-24', title:'Air Import Operations SOP — Aggregated Supply Chain', owner:'Jaison', priority:'critical', tags:['import','FedEx','aggregated'], link:'' },
        { id:'SOP-AIR-IN-25', title:'Cargo Pull & ISC Payment SOP — Disaggregated', owner:'Jaison', priority:'critical', tags:['cargo-pull','ISC','disaggregated'], link:'' },
        { id:'SOP-AIR-IN-26', title:'Internal WBR Data Review and Callouts SOP', owner:'Shreyas', priority:'medium', tags:['WBR','reporting'], link:'' },
        { id:'SOP-AIR-IN-27', title:'Chargeable Weight Updation SOP', owner:'Shreyas', priority:'high', tags:['chargeable-weight'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-10', title:'Import Clearance SOP — Air UK', owner:'Shreyas', priority:'critical', tags:['import','UK','clearance'], link:'' },
        { id:'SOP-AIR-UK-11', title:'Cargo Recovery and ISC Payment SOP', owner:'Shreyas', priority:'critical', tags:['cargo-pull','ISC'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-09', title:'Import Clearance SOP — Air DE', owner:'Shreyas', priority:'critical', tags:['import','DE','clearance'], link:'' },
      ],
    }
  },
  {
    id: 'delivery', label: 'Delivery', short: 'Delivery', icon: '🏁', color: '#0FB57A',
    desc: 'FedEx last-mile delivery (aggregated) or destination delivery for disaggregated supply chain',
    subStages: ['FedEx Aggregated', 'Disaggregated Last Mile'],
    sops: {
      'IN2US': [
        { id:'SOP-AIR-IN-28', title:'Import Clearance & Delivery — FedEx', owner:'Jaison', priority:'critical', tags:['FedEx','delivery','aggregated'], link:'' },
        { id:'SOP-AIR-IN-29', title:'Amazon WBR Data Review SOP', owner:'Shreyas', priority:'medium', tags:['WBR','Amazon'], link:'' },
        { id:'SOP-AIR-IN-30', title:'FedEx Claim Process SOP', owner:'Raunak', priority:'medium', tags:['FedEx','claim'], link:'' },
        { id:'SOP-AIR-IN-31', title:'FedEx Labels Creation SOP', owner:'Raunak', priority:'medium', tags:['FedEx','label'], link:'' },
      ],
      'UK2US': [
        { id:'SOP-AIR-UK-12', title:'Destination Delivery — Last Mile (UK)', owner:'Piyush', priority:'critical', tags:['last-mile','UK'], link:'' },
      ],
      'DE2US': [
        { id:'SOP-AIR-DE-10', title:'Destination Delivery — Last Mile (DE)', owner:'Shreyas', priority:'critical', tags:['last-mile','DE'], link:'' },
      ],
    }
  },
]

const PRIORITY_COLOR = { critical:'#E84040', high:'#F0A500', medium:'#4A8EE8', low:'#4A5A78' }
const PRIORITY_BG = { critical:'rgba(232,64,64,0.12)', high:'rgba(240,165,0,0.12)', medium:'rgba(74,142,232,0.12)', low:'rgba(74,90,120,0.12)' }

function StageTimeline({ stages, activeStageId, onSelect }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:4 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:0, minWidth: stages.length * 100 }}>
        {stages.map((stage, i) => {
          const isActive = activeStageId === stage.id
          const isLast = i === stages.length - 1
          return (
            <div key={stage.id} style={{ display:'flex', alignItems:'center', flex: isLast ? 0 : 1 }}>
              <div onClick={() => onSelect(stage.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer', flexShrink:0 }}>
                <div style={{
                  width: isActive ? 46 : 36, height: isActive ? 46 : 36, borderRadius:'50%',
                  background: isActive ? stage.color : '#111721',
                  border: `2px solid ${isActive ? stage.color : '#1E2C42'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: isActive ? 18 : 13, transition:'all .2s',
                  boxShadow: isActive ? `0 0 18px ${stage.color}55` : 'none',
                }}>
                  {stage.icon}
                </div>
                <div style={{
                  fontSize:8, fontFamily:'monospace', letterSpacing:.5,
                  color: isActive ? stage.color : '#4A5A78',
                  textAlign:'center', maxWidth:76, lineHeight:1.3,
                  fontWeight: isActive ? 700 : 400, textTransform:'uppercase',
                }}>
                  {stage.short}
                </div>
                <div style={{
                  fontSize:8, fontFamily:'monospace',
                  color: isActive ? '#fff' : '#4A5A78',
                  background: isActive ? stage.color : '#172030',
                  borderRadius:10, padding:'1px 5px',
                  border:`1px solid ${isActive ? stage.color : '#1E2C42'}`,
                }}>
                  {Object.values(stage.sops).flat().length} SOPs
                </div>
              </div>
              {!isLast && (
                <div style={{
                  flex:1, height:2, marginBottom:36,
                  background:`linear-gradient(90deg,${stages[i].color}44,${stages[i+1].color}44)`
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SOPCard({ sop, stageColor }) {
  return (
    <div
      onClick={() => sop.link && window.open(sop.link, '_blank')}
      style={{
        background:'#0C1018', border:'1px solid #1E2C42', borderRadius:8,
        padding:'13px 15px', cursor: sop.link ? 'pointer' : 'default',
        borderLeft:`3px solid ${PRIORITY_COLOR[sop.priority]}`, transition:'all .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = stageColor; e.currentTarget.style.background = '#111820' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2C42'; e.currentTarget.style.background = '#0C1018' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, fontFamily:'monospace', color:stageColor, letterSpacing:1, marginBottom:3 }}>{sop.id}</div>
          <div style={{ fontSize:12, fontWeight:600, color:'#E0E8F5', lineHeight:1.35 }}>{sop.title}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
          <div style={{
            fontSize:8, fontFamily:'monospace', padding:'2px 6px', borderRadius:4,
            background:PRIORITY_BG[sop.priority], color:PRIORITY_COLOR[sop.priority],
            border:`1px solid ${PRIORITY_COLOR[sop.priority]}44`, whiteSpace:'nowrap',
          }}>
            {sop.priority === 'critical' ? '🔴' : sop.priority === 'high' ? '🟡' : '🔵'} {sop.priority}
          </div>
          {sop.link && <div style={{ fontSize:7, color:'#4A5A78', fontFamily:'monospace' }}>↗ Google Doc</div>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
        <div style={{ fontSize:9, color:'#4A5A78', fontFamily:'monospace' }}>👤 {sop.owner}</div>
        <div style={{ flex:1 }} />
        {sop.tags.slice(0,3).map(t => (
          <div key={t} style={{
            fontSize:8, fontFamily:'monospace', padding:'1px 5px', borderRadius:20,
            background:'#172030', border:'1px solid #1E2C42', color:'#4A5A78',
          }}>#{t}</div>
        ))}
      </div>
    </div>
  )
}

export default function PublicView() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [mode, setMode] = useState('ocean')   // 'ocean' | 'air'
  const [lane, setLane] = useState('IN2US')   // 'IN2US' | 'UK2US' | 'DE2US'
  const [activeStageId, setActiveStageId] = useState('booking')
  const [search, setSearch] = useState('')

  const stages = mode === 'ocean' ? OCEAN_STAGES : AIR_STAGES
  const activeStage = stages.find(s => s.id === activeStageId) || stages[0]

  // Reset to first stage when mode changes
  const handleModeChange = (m) => { setMode(m); setActiveStageId(stages[0].id); setSearch('') }
  const handleStageSelect = (id) => { setActiveStageId(id); setSearch('') }

  const stageSops = activeStage.sops[lane] || []
  const filtered = stageSops.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )

  const totalSops = stages.reduce((a, s) => a + Object.values(s.sops).flat().length, 0)
  const laneSops = stages.reduce((a, s) => a + (s.sops[lane]?.length || 0), 0)
  const modeColor = mode === 'ocean' ? '#12B5CC' : '#4A8EE8'

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#07090F' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:220, minWidth:220, background:'#0C1018', borderRight:'1px solid #1E2C42', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid #1E2C42' }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:24, letterSpacing:3, color:'#FFB627', lineHeight:1 }}>XHIPMENT</div>
          <div style={{ fontSize:9, fontFamily:'monospace', color:'#4A5A78', letterSpacing:2, marginTop:3 }}>SOP PORTAL</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:5, marginTop:8, padding:'2px 8px', background:'rgba(18,181,204,0.1)', border:'1px solid rgba(18,181,204,0.2)', borderRadius:4 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#0FB57A', animation:'pulse 2s infinite' }} />
            <div style={{ fontSize:9, fontFamily:'monospace', color:'#12B5CC', letterSpacing:1 }}>LIVE</div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ padding:'14px 12px 10px', borderBottom:'1px solid #1E2C42' }}>
          <div style={{ fontSize:9, fontFamily:'monospace', color:'#4A5A78', letterSpacing:1.5, marginBottom:8 }}>MODE</div>
          <div style={{ display:'flex', gap:6 }}>
            {[['ocean','🚢','Ocean'],['air','✈️','Air']].map(([m,icon,label]) => (
              <button key={m} onClick={() => handleModeChange(m)} style={{
                flex:1, padding:'7px 4px', borderRadius:6, cursor:'pointer', transition:'all .15s',
                background: mode === m ? (m === 'ocean' ? '#12B5CC22' : '#4A8EE822') : 'transparent',
                border: mode === m ? `1px solid ${m === 'ocean' ? '#12B5CC' : '#4A8EE8'}` : '1px solid #1E2C42',
                color: mode === m ? (m === 'ocean' ? '#12B5CC' : '#4A8EE8') : '#4A5A78',
                fontSize:11, fontWeight: mode === m ? 700 : 400,
              }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lane Filter */}
        <div style={{ padding:'12px', borderBottom:'1px solid #1E2C42' }}>
          <div style={{ fontSize:9, fontFamily:'monospace', color:'#4A5A78', letterSpacing:1.5, marginBottom:8 }}>TRADE LANE</div>
          {['IN2US','UK2US','DE2US'].map(l => (
            <div key={l} onClick={() => setLane(l)} style={{
              padding:'8px 12px', borderRadius:6, cursor:'pointer', marginBottom:4,
              background: lane === l ? `${modeColor}18` : 'transparent',
              border: lane === l ? `1px solid ${modeColor}55` : '1px solid transparent',
              borderLeft: lane === l ? `2px solid ${modeColor}` : '2px solid transparent',
              color: lane === l ? modeColor : '#4A5A78', fontSize:12, transition:'all .15s',
            }}>
              <span style={{ fontFamily:'monospace', fontWeight: lane === l ? 700 : 400 }}>{l}</span>
              <span style={{ float:'right', fontSize:10, opacity:.6 }}>
                {stages.reduce((a,s) => a + (s.sops[l]?.length || 0), 0)}
              </span>
            </div>
          ))}
        </div>

        {/* Stage quick-nav */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>
          <div style={{ fontSize:9, fontFamily:'monospace', color:'#4A5A78', letterSpacing:1.5, marginBottom:8 }}>LIFECYCLE STAGES</div>
          {stages.map(s => (
            <div key={s.id} onClick={() => handleStageSelect(s.id)} style={{
              display:'flex', alignItems:'center', gap:8, padding:'7px 10px',
              borderRadius:6, cursor:'pointer', marginBottom:3,
              background: activeStageId === s.id ? `${s.color}18` : 'transparent',
              borderLeft: activeStageId === s.id ? `2px solid ${s.color}` : '2px solid transparent',
              transition:'all .15s',
            }}>
              <span style={{ fontSize:12 }}>{s.icon}</span>
              <span style={{ fontSize:11, color: activeStageId === s.id ? s.color : '#889ABB', flex:1, lineHeight:1.3 }}>{s.short}</span>
              <span style={{
                fontSize:9, fontFamily:'monospace',
                color: activeStageId === s.id ? s.color : '#4A5A78',
                background: activeStageId === s.id ? `${s.color}22` : '#172030',
                borderRadius:10, padding:'1px 5px',
              }}>{s.sops[lane]?.length || 0}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px', borderTop:'1px solid #1E2C42' }}>
          {isAdmin ? (
            <button onClick={() => navigate('/admin')} style={{ width:'100%', padding:8, background:'rgba(232,148,10,0.1)', border:'1px solid rgba(232,148,10,0.3)', color:'#E8940A', borderRadius:6, cursor:'pointer', fontSize:11, fontFamily:'monospace' }}>
              ⚙ Admin Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/admin/login')} style={{ width:'100%', padding:8, background:'transparent', border:'1px solid #1E2C42', color:'#4A5A78', borderRadius:6, cursor:'pointer', fontSize:11, fontFamily:'monospace' }}>
              🔐 Admin Login
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <div style={{ height:56, padding:'0 22px', borderBottom:'1px solid #1E2C42', display:'flex', alignItems:'center', gap:14, background:'#0C1018', flexShrink:0 }}>
          <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:18, letterSpacing:2, color:'#E0E8F5' }}>
            {mode === 'ocean' ? '🚢' : '✈️'} {mode.toUpperCase()} <span style={{ color:modeColor }}>SOP LIFECYCLE</span>
          </div>
          <div style={{ width:1, height:18, background:'#1E2C42' }} />
          <div style={{ fontSize:11, fontFamily:'monospace', color:'#4A5A78' }}>{lane} · {laneSops} SOPs</div>
          <div style={{ flex:1 }} />
          <input
            placeholder="🔍 Search SOPs, tags, owners..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background:'#172030', border:'1px solid #1E2C42', color:'#E0E8F5', padding:'7px 12px', borderRadius:6, fontSize:12, outline:'none', width:240 }}
          />
        </div>

        {/* Timeline */}
        <div style={{ padding:'18px 22px 0', borderBottom:'1px solid #1E2C42', background:'#0C1018', flexShrink:0 }}>
          <StageTimeline stages={stages} activeStageId={activeStageId} onSelect={handleStageSelect} />
        </div>

        {/* Active stage detail */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 22px 24px' }}>

          {/* Stage header */}
          <div style={{
            background:'#0C1018', border:`1px solid ${activeStage.color}33`,
            borderRadius:10, padding:'14px 18px', marginBottom:16,
            display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{
              width:42, height:42, borderRadius:'50%', flexShrink:0,
              background:`${activeStage.color}22`, border:`2px solid ${activeStage.color}`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
            }}>{activeStage.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'monospace', fontSize:13, letterSpacing:1.5, color:activeStage.color, fontWeight:900, textTransform:'uppercase' }}>
                {activeStage.label}
              </div>
              <div style={{ fontSize:11, color:'#889ABB', marginTop:2 }}>{activeStage.desc}</div>
              {activeStage.subStages && (
                <div style={{ display:'flex', gap:6, marginTop:6 }}>
                  {activeStage.subStages.map(s => (
                    <div key={s} style={{
                      fontSize:9, fontFamily:'monospace', padding:'2px 8px', borderRadius:4,
                      background:`${activeStage.color}18`, border:`1px solid ${activeStage.color}44`,
                      color:activeStage.color,
                    }}>⤷ {s}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:22, fontFamily:'monospace', color:activeStage.color, fontWeight:900 }}>{filtered.length}</div>
              <div style={{ fontSize:9, fontFamily:'monospace', color:'#4A5A78' }}>SOPs · {lane}</div>
            </div>
          </div>

          {/* SOP Grid */}
          {filtered.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:9 }}>
              {filtered.map(sop => <SOPCard key={sop.id} sop={sop} stageColor={activeStage.color} />)}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#4A5A78' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
              <div style={{ fontFamily:'monospace', fontSize:14, letterSpacing:1 }}>
                {search ? 'No SOPs match your search' : 'No SOPs for this stage / lane yet'}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  )
}
