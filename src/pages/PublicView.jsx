import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

// ─── ALL GOOGLE DOC LINKS FROM THE XHIPMENT SOP TRACKER ─────────────
// Sourced from: SOP Tracker Google Sheet (SOPs - Ocean, SOPs - Air, Existing SOPs tabs)
const L = {
  // Ocean - Document Verification
  export_doc_verification:   'https://docs.google.com/document/d/1kNUTgr9jGY1iVIVMxf9AyoCSbNn93MXG-jEGE6SAorI/edit',
  doc_verification_checklist:'https://docs.google.com/document/d/1Whh_VQo7VODvFeI4KSxjiZ7Oxu5vR5wsCV5CYpFoL70/edit',
  ad_code_ifsc:              'https://docs.google.com/document/d/1ENmnyMyzwdyBn8kMnYNKUS2zHCI270P6jVPN-7oozac/edit',
  marking_labeling:          'https://docs.google.com/document/d/1lnEA43ta5FMR2ZRe_UYVIIQU4U58JqkCOOI9t6xF-tw/edit',
  fba_po_collection:         'https://docs.google.com/document/d/1QzhG9lNIvBbdwXyWjCZdSUr7orAHCzBTtksKXlGpfkc/edit',
  cargo_insurance_ocean:     'https://docs.google.com/document/d/1Io2fIJpiq3zQh9xRgfLcQA9TFi12XwGyd-OfMTD1KC4/edit',
  doc_verification_faq:      'https://docs.google.com/document/d/1yVjBOwl5djkZBy_VeAPZu_Ybt73W6WMgqA9AKSHdvJc/edit',
  eori_guide:                'https://docs.google.com/document/d/1qb24smj7eD-wy0BL0xwC4i85qBEAoMpp4pcSyS-76hQ/edit',

  // Ocean - Pickup / Drop Off
  ocean_pickup:              'https://docs.google.com/document/d/1plE8NK2_XuID0gaJvIXygHn2o7Cx4tKSrU_G3Nf35cY/edit',
  ocean_dropoff:             'https://docs.google.com/document/d/13AsQRMqI-PG-hFfPR3kTYPjyfiWg6EppUICjZlUFG_s/edit',
  pickup_dropoff_faq:        'https://docs.google.com/document/d/1plE8NK2_XuID0gaJvIXygHn2o7Cx4tKSrU_G3Nf35cY/edit',

  // Ocean - Carting / Export Clearance
  checklist_cfs:             'https://docs.google.com/document/d/1Whh_VQo7VODvFeI4KSxjiZ7Oxu5vR5wsCV5CYpFoL70/edit',
  export_clearance:          'https://docs.google.com/document/d/1kNUTgr9jGY1iVIVMxf9AyoCSbNn93MXG-jEGE6SAorI/edit',
  ams_filing:                'https://docs.google.com/document/d/14_sA1Q4J1_vzysU7wpNf6VNwMvUI1k5m/edit',
  isf_filing:                'https://docs.google.com/document/d/1FEZCFPqo3gfjoEjUeJLshLjwmfLHm7k5M67jTnbAH5g/edit',
  ams_isf_validation:        'https://docs.google.com/document/d/1n8fjvUtTMO1q2GHBXETIUMK54Ed0iq75mWmVeG5gs4Q/edit',
  export_ops_faq:            'https://docs.google.com/document/d/1yVjBOwl5djkZBy_VeAPZu_Ybt73W6WMgqA9AKSHdvJc/edit',

  // Ocean - Stuffing / Planning
  container_planning:        'https://docs.google.com/document/d/1AmBuALZC5FXz06vArqKKtxhwnV2U4ZdbU0m7Oyj2NuE/edit',
  loading_plan:              'https://docs.google.com/document/d/1urTapNUoIHUhuTqSfEUWMTvXsGUPs4kiWEWDGOVhtLo/edit',
  inntra_si:                 'https://docs.google.com/document/d/1Uo-ckUa9WW-w-MhJZG13N5sQBVSAjbrKRtAYsyRdJ5o/edit',

  // Ocean - Sail Out / BL Release
  swb_freight_release:       'https://docs.google.com/document/d/1D-uFT03AMcBLjCLbLjNHrIoNHgLbffatLVz5Wglo3KA/edit',
  oocl_bl:                   'https://docs.google.com/document/d/1D-uFT03AMcBLjCLbLjNHrIoNHgLbffatLVz5Wglo3KA/edit',
  cma_bl:                    'https://docs.google.com/document/d/1D-uFT03AMcBLjCLbLjNHrIoNHgLbffatLVz5Wglo3KA/edit',
  customs_freight_release:   'https://docs.google.com/document/d/1D-uFT03AMcBLjCLbLjNHrIoNHgLbffatLVz5Wglo3KA/edit',

  // Ocean - Import Clearance
  ocean_import_clearance:    'https://docs.google.com/document/d/1Mz7m1_hNErSLnHLrIhwYDdPwuUexaNfVbR96R1niSqE/edit',
  import_clearance_faq:      'https://docs.google.com/document/d/1Mz7m1_hNErSLnHLrIhwYDdPwuUexaNfVbR96R1niSqE/edit',
  ocean_import_clearance_uk: 'https://docs.google.com/document/d/1cna3GgFAyVuXZlc9abOMkpIlpb3qX2n7lLswCE_aAew/edit',

  // Ocean - Delivery
  drayage_in2us:             'https://docs.google.com/document/d/1A43n5pJTTXx3l7YeTq2Aem9egKXHZwV-xvV_3nCK-5U/edit',
  drayage_faq:               'https://docs.google.com/document/d/1a4PTnjmDJgM6B92DDvtw0D1NGLoEjAjG5JORuCbwr5c/edit',
  transloading:              'https://docs.google.com/document/d/128OifNyo-8QnzHKnHhoRT003_-VpapyaST0fJd0qcA8/edit',
  transloading_faq:          'https://docs.google.com/document/d/13iMfsZZ9sxnpJuhQ-foWgos6Xay2FYP7adivb_FnXnY/edit',
  amazon_freight:            'https://docs.google.com/document/d/1TFioYB4c0kAHbvgq20e1ONwyt-GUu32yCYLpMukkABA/edit',
  xpo_booking:               'https://docs.google.com/document/d/16PQ9CWMKnVrQytt2mKoLgcecSLhrKfl5snnTswkE2Bw/edit',
  walmart_appointment:       'https://docs.google.com/document/d/1DZ7GbKTPWqbSFZN6k8bVi2VFGvUjBmdBcRbtXZh6_BY/edit',
  fba_redirection:           'https://docs.google.com/document/d/1sox2SJiTx_N_Rxghg4uEbot3USL9HdN4FD-zvpBTeGk/edit',
  everlast:                  'https://docs.google.com/document/d/1Dn_R9kt6ZB1dPobj6gl_lQo76QS5LPYpf498Ll61N-4/edit',
  drayage_uk2us:             'https://docs.google.com/document/d/1fy6lrq38NRXRDcQHCGlFR78-dlDILuuddW67XtIJi34/edit',
  drayage_de2us:             'https://docs.google.com/document/d/1Lj1mfNfUW-jF5uu3LFaFrBAZUTlgosjSCrRgJoNdcaM/edit',
  partner_portal:            'https://docs.google.com/document/d/1ahQegMZJpb6kOGW4SG8cf2w56-ndxFE-YsCqKffyhG0/edit',

  // Ocean UK/DE - Doc verification
  new_cust_verify_uk:        'https://docs.google.com/document/d/15rRyLB0jDp0bfr3UnnOsToz-Mz1M4Ykll-OLoqGk2so/edit',
  exist_cust_verify_de:      'https://docs.google.com/document/d/1VxwAHDlHsQ298jD81tXdArbUiqwZCvom8tHgaZMNjuM/edit',
  new_cust_verify_de:        'https://docs.google.com/document/d/1DWnrK8tZFHLA29WtSp0ohe0NO6BemK2TgbLFYd_JyBU/edit',
  container_planning_uk:     'https://docs.google.com/document/d/1UWU1VwTUwdFOKZoqzheSHD3hxP8nTnaDcy47vxMQqyA/edit',
  export_clearance_uk:       'https://docs.google.com/document/d/1-jEQv1UIv1hBjlW5vrMnVFHJ9LaPG2qnQkYAaTrfK0U/edit',
  loading_plan_uk:           'https://docs.google.com/document/d/1BNdXexKwynjQbV0M9J0Ld38FWnY0nCH8OepJy5HcbBg/edit',
  container_planning_de:     'https://docs.google.com/document/d/1F3UoUiWxSWFM-XWMxf6l8JBRwB7V_KZzUbVamXfirZ0/edit',
  export_clearance_de:       'https://docs.google.com/document/d/19pd_YA3J_j-JLW9AxWtKHYaFbkfX0NAqtrL7Y5YRQhw/edit',
  loading_plan_de:           'https://docs.google.com/document/d/1MMTVGHNes8eRYGUjHtD0TF7ZJIuMRXoDwf1mCebDK40/edit',
  pickup_uk:                 'https://docs.google.com/document/d/1cXAKz9fhleZu2ZcaTWyiJ8qGa5A1IR_p8u1xL01Ls44/edit',
  dropoff_uk:                'https://docs.google.com/document/d/1SFSVt48tCJc6gbHiCkqkCmUsGYnsqA6MTjOrUNTFb9w/edit',
  pickup_de:                 'https://docs.google.com/document/d/1cXAKz9fhleZu2ZcaTWyiJ8qGa5A1IR_p8u1xL01Ls44/edit',
  dropoff_de:                'https://docs.google.com/document/d/1SFSVt48tCJc6gbHiCkqkCmUsGYnsqA6MTjOrUNTFb9w/edit',
  customs_release_uk:        'https://docs.google.com/document/d/196O5gMccujpuJkOGzP5ROKTHH62XYs9JEf2muZfC1-A/edit',
  drayage_faq_uk:            'https://docs.google.com/document/d/1zpzVRqzJ7g2kVCGGOIVNHACQsTw2Q5rmV7Lb_9acfto/edit',
  import_clearance_faq_uk:   'https://docs.google.com/document/d/1Mz7m1_hNErSLnHLrIhwYDdPwuUexaNfVbR96R1niSqE/edit',

  // Air SOPs
  air_doc_verification:      'https://docs.google.com/document/d/1Z0YsCOEZnfvW16GkjG2-wEKlvDgzeZnKa3mKY_JH4rs/edit',
  air_doc_faq:               'https://docs.google.com/document/d/1lJ7dZV7l45GAmOlRNy_DQCn0l3MAubDNuCtH8VbdN_k/edit',
  fedex_label:               'https://docs.google.com/document/d/1M7k5wx_6UVcR4YrI0koHfokausRZB5doy7AEhfZOygA/edit',
  air_pickup:                'https://docs.google.com/document/d/1S6ScaRbZ6o_U1HhCtkhzEIzgvTGyL1w6/edit',
  air_dropoff:               'https://docs.google.com/document/d/1kyMv6ovMHiUk-jnYWUakiU_BV7hqIP4tJ4eLwsEKYE0/edit',
  air_pickup_faq:            'https://docs.google.com/spreadsheets/d/1lT1R4VzHVWSdAQ7h9IrEXkb56ld8ABAmEGaXLxPUq8Q/edit',
  air_checklist:             'https://docs.google.com/document/d/13W2-xbzhoyrLQdJ7o859-9n--B2bIzPhZ8r6u9ip7cM/edit',
  air_cargo_insurance:       'https://docs.google.com/document/d/1nth-_8riEh1EM0XP1FFQWkSaQMv9B0hzXNoYQRMqfGU/edit',
  air_consol_planning:       'https://docs.google.com/document/d/1wz1OJRgE7M2EYY5c9wmtvipjyLZRJ9_NJK4AGSIrdgE/edit',
  air_consol_execution:      'https://docs.google.com/document/d/18a0-yQ6bvQFxsXaMJI8FTIZv6vIQnmr8KvgZGyb8bfQ/edit',
  icl_weight_audit:          'https://docs.google.com/document/d/1Ziw-E9ovdAEk-A57PfUEx0RQTMlmCPyzeTSMyTJNXWc/edit',
  icl_warehouse:             'https://docs.google.com/document/d/1lOEMh2NtOupnuOi7_Co5cHHv_Gvcfl5m6FC-1UMzmSk/edit',
  air_import_clearance:      'https://docs.google.com/document/d/15Vf-BNRbCI7neePkn2D0AdxEyfGs51Uivr3v20NU4yI/edit',
  air_import_delivery_fedex: 'https://docs.google.com/document/d/1GJHkrWY6Xfsl8eDA9UORwNmXbx58jdAp5PiXAqDE1tQ/edit',
  cargo_pull_isc:            'https://docs.google.com/document/d/18-m_xsB2nRgc2aiFfqXqknC_DWAuJbUUR2LL-oetVO0/edit',
  wbr_internal:              'https://docs.google.com/document/d/1WiXNJrQ420HowhnnIWmInxRsXKm-hlfba3itggZ5kkk/edit',
  amazon_wbr:                'https://docs.google.com/document/d/1BU1hcNtUnAK32Gzr2oxBPbaIogbCau6JffeKrh5zdkA/edit',
  chargeable_weight:         'https://docs.google.com/document/d/1Lrak76J_jVDYWrM1jJmcvAZqXUm4QlR5tX1UUlDxofY/edit',
  uk_air_ops:                'https://docs.google.com/document/d/1-cvtqEB1LYkpMpGlJqlCz6-IRFe31wJ6/edit',
  export_ops_disagg:         'https://docs.google.com/document/d/1-cvtqEB1LYkpMpGlJqlCz6-IRFe31wJ6/edit',

  // Procurement
  container_booking_sop:     'https://docs.google.com/document/d/1AmBuALZC5FXz06vArqKKtxhwnV2U4ZdbU0m7Oyj2NuE/edit',
}

// ─── OCEAN LIFECYCLE ─────────────────────────────────────────────────
const OCEAN_STAGES = [
  { id:'booking', label:'Booking Confirmation', short:'Booking', icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, space booking, liner selection & booking amendment process',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-01',title:'Container Booking SOP',owner:'Jaideep',priority:'critical',tags:['MAERSK','OOCL','CMA'],link:L.container_booking_sop},
      {id:'SOP-OCN-IN-02',title:'India to US Ocean Quoting Process SOP',owner:'Jaideep',priority:'critical',tags:['LCL','FCL','pricing'],link:''},
      {id:'SOP-OCN-IN-03',title:'Port of Discharge Estimator SOP',owner:'Jaideep',priority:'high',tags:['POD','routing'],link:''},
      {id:'SOP-OCN-IN-04',title:'Liner Issue / Exception Handling SOP',owner:'Jaideep',priority:'high',tags:['exception','liner'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-01',title:'Container Booking SOP — UK Export',owner:'Jaideep',priority:'critical',tags:['UK','FCL'],link:L.container_booking_sop},
      {id:'SOP-OCN-UK-02',title:'UK2US LCL Calculator SOP',owner:'Jaideep',priority:'high',tags:['LCL','pricing'],link:''},
      {id:'SOP-OCN-UK-03',title:'UK Pickup Calculator SOP',owner:'Jaideep',priority:'high',tags:['pickup','pricing'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-01',title:'Container Booking SOP — DE Export',owner:'Jaideep',priority:'critical',tags:['DE','FCL'],link:L.container_booking_sop},
      {id:'SOP-OCN-DE-02',title:'DE2US LCL Calculator SOP',owner:'Jaideep',priority:'high',tags:['LCL','pricing'],link:''},
    ]}},

  { id:'documents', label:'Document Verification', short:'Doc Verify', icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, cargo insurance verification',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-05',title:'Export Document Collection & Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','IN2US'],link:L.export_doc_verification},
      {id:'SOP-OCN-IN-06',title:'Document Verification Checklist',owner:'Rohan',priority:'critical',tags:['checklist'],link:L.doc_verification_checklist},
      {id:'SOP-OCN-IN-07',title:'AD Code & IFSC Registration Guide',owner:'Rohan',priority:'critical',tags:['ICEGATE','AD-code'],link:L.ad_code_ifsc},
      {id:'SOP-OCN-IN-08',title:'Marking & Labeling Guide',owner:'Rohan',priority:'high',tags:['packaging','labels'],link:L.marking_labeling},
      {id:'SOP-OCN-IN-09',title:'FBA ID and PO ID Collection Guide',owner:'Rohan',priority:'critical',tags:['Amazon','FBA','Walmart'],link:L.fba_po_collection},
      {id:'SOP-OCN-IN-10',title:'Cargo Insurance Procurement Guide',owner:'Rohan',priority:'medium',tags:['insurance'],link:L.cargo_insurance_ocean},
      {id:'SOP-OCN-IN-11',title:'Document Verification Exception Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:L.doc_verification_faq},
    ],'UK2US':[
      {id:'SOP-OCN-UK-04',title:'New Customer Document Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','new-customer'],link:L.new_cust_verify_uk},
      {id:'SOP-OCN-UK-05',title:'Existing Customer Document Verification SOP',owner:'Rohan',priority:'critical',tags:['verification','existing'],link:L.export_doc_verification},
      {id:'SOP-OCN-UK-06',title:'EORI Number Procurement Guide',owner:'Rohan',priority:'high',tags:['EORI','UK'],link:L.eori_guide},
      {id:'SOP-OCN-UK-07',title:'Marking & Labeling Guide SOP',owner:'Rohan',priority:'high',tags:['packaging'],link:L.marking_labeling},
      {id:'SOP-OCN-UK-08',title:'FBA ID and PO ID Collection Guide',owner:'Rohan',priority:'critical',tags:['Amazon','FBA'],link:L.fba_po_collection},
    ],'DE2US':[
      {id:'SOP-OCN-DE-03',title:'New Customer Document Verification SOP — DE',owner:'Rohan',priority:'critical',tags:['verification','DE'],link:L.new_cust_verify_de},
      {id:'SOP-OCN-DE-04',title:'Existing Customer Document Verification SOP — DE',owner:'Rohan',priority:'critical',tags:['verification','DE'],link:L.exist_cust_verify_de},
      {id:'SOP-OCN-DE-05',title:'EORI Number Procurement Guide',owner:'Rohan',priority:'high',tags:['EORI','DE'],link:L.eori_guide},
    ]}},

  { id:'pickup', label:'Pickup / Drop Off Initiation', short:'Pickup', icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper warehouse, drop-off at CFS, exception handling',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-12',title:'Ocean Pickup Operations SOP',owner:'Rohan',priority:'critical',tags:['pickup','vendor'],link:L.ocean_pickup},
      {id:'SOP-OCN-IN-13',title:'Drop Off Operations Guide',owner:'Rohan',priority:'critical',tags:['CFS','drop-off'],link:L.ocean_dropoff},
      {id:'SOP-OCN-IN-14',title:'Pickup & Drop Off Exception Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:L.pickup_dropoff_faq},
    ],'UK2US':[
      {id:'SOP-OCN-UK-10',title:'Pick Up Operations Guide — UK',owner:'Rohan',priority:'critical',tags:['pickup','UK'],link:L.pickup_uk},
      {id:'SOP-OCN-UK-11',title:'Drop Off Operations Guide — UK',owner:'Rohan',priority:'critical',tags:['drop-off','UK'],link:L.dropoff_uk},
      {id:'SOP-OCN-UK-12',title:'Pickup & Drop Off Exception Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:L.pickup_dropoff_faq},
    ],'DE2US':[
      {id:'SOP-OCN-DE-07',title:'Pick Up Operations Guide — DE',owner:'Rohan',priority:'critical',tags:['pickup','DE'],link:L.pickup_de},
      {id:'SOP-OCN-DE-08',title:'Drop Off Operations Guide — DE',owner:'Rohan',priority:'critical',tags:['drop-off','DE'],link:L.dropoff_de},
    ]}},

  { id:'carting', label:'Carting & Export Clearance', short:'Carting', icon:'🏭', color:'#8B5CF6',
    desc:'CFS inbound, checklist validation, customs export clearance, AMS / ISF filing',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-15',title:'Checklist Generation & CFS Inbound SOP',owner:'Rohan',priority:'critical',tags:['checklist','CFS'],link:L.checklist_cfs},
      {id:'SOP-OCN-IN-16',title:'Export Clearance SOP',owner:'Rohan',priority:'critical',tags:['customs','clearance'],link:L.export_clearance},
      {id:'SOP-OCN-IN-17',title:'AMS Submission Process — TradeTech',owner:'Rohan',priority:'critical',tags:['AMS','TradeTech'],link:L.ams_filing},
      {id:'SOP-OCN-IN-18',title:'ISF Submission Process — TradeTech',owner:'Rohan',priority:'critical',tags:['ISF','TradeTech'],link:L.isf_filing},
      {id:'SOP-OCN-IN-19',title:'AMS / ISF Validation Guide',owner:'Rohan',priority:'critical',tags:['AMS','ISF','validation'],link:L.ams_isf_validation},
      {id:'SOP-OCN-IN-20',title:'Export Operations Issue Handling Guide',owner:'Rohan',priority:'high',tags:['FAQ','exception'],link:L.export_ops_faq},
    ],'UK2US':[
      {id:'SOP-OCN-UK-13',title:'Container / Exports Planning SOP — UK',owner:'Rohan',priority:'high',tags:['planning','UK'],link:L.container_planning_uk},
      {id:'SOP-OCN-UK-14',title:'Export Clearance SOP — UK',owner:'Rohan',priority:'critical',tags:['clearance','UK'],link:L.export_clearance_uk},
      {id:'SOP-OCN-UK-15',title:'AMS / ISF Submission & Validation',owner:'Rohan',priority:'critical',tags:['AMS','ISF'],link:L.ams_filing},
    ],'DE2US':[
      {id:'SOP-OCN-DE-09',title:'Container / Exports Planning SOP — DE',owner:'Rohan',priority:'high',tags:['planning','DE'],link:L.container_planning_de},
      {id:'SOP-OCN-DE-10',title:'Export Clearance SOP — DE',owner:'Rohan',priority:'critical',tags:['clearance','DE'],link:L.export_clearance_de},
    ]}},

  { id:'stuffing', label:'Empty Container Pickup & Stuffing', short:'Stuffing', icon:'📦', color:'#F59E0B',
    desc:'Empty container pickup from depot, container loading plan, stuffing & sealing',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-21',title:'Container / Exports Planning SOP',owner:'Rohan',priority:'high',tags:['planning','FCL'],link:L.container_planning},
      {id:'SOP-OCN-IN-22',title:'Container Loading Plan Generation SOP',owner:'Rohan',priority:'high',tags:['loading','stuffing'],link:L.loading_plan},
      {id:'SOP-OCN-IN-23',title:'INNTRA Shipping Instructions Filing Guide',owner:'Rohan',priority:'critical',tags:['SI','INNTRA','liner'],link:L.inntra_si},
      {id:'SOP-OCN-IN-24',title:'House Bill of Lading Creation Process',owner:'Rohan',priority:'critical',tags:['HBL','documentation'],link:''},
    ],'UK2US':[
      {id:'SOP-OCN-UK-18',title:'Container Loading Plan Generation SOP — UK',owner:'Rohan',priority:'high',tags:['loading','UK'],link:L.loading_plan_uk},
      {id:'SOP-OCN-UK-19',title:'House Bill of Lading Creation Process',owner:'Rohan',priority:'critical',tags:['HBL'],link:''},
    ],'DE2US':[
      {id:'SOP-OCN-DE-12',title:'Container Loading Plan Generation SOP — DE',owner:'Rohan',priority:'high',tags:['loading','DE'],link:L.loading_plan_de},
      {id:'SOP-OCN-DE-13',title:'House Bill of Lading Creation Process — DE',owner:'Rohan',priority:'critical',tags:['HBL','DE'],link:''},
    ]}},

  { id:'sailout', label:'Container Gate In & Sail Out', short:'Sail Out', icon:'🚢', color:'#06B6D4',
    desc:'Gate-in confirmation, BL release, freight release, sailing milestone tracking',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-25',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:L.swb_freight_release},
      {id:'SOP-OCN-IN-26',title:'OOCL BL & Freight Release Process',owner:'Farhan',priority:'critical',tags:['OOCL'],link:L.oocl_bl},
      {id:'SOP-OCN-IN-27',title:'CMA CGM BL / Freight Release',owner:'Farhan',priority:'critical',tags:['CMA-CGM'],link:L.cma_bl},
      {id:'SOP-OCN-IN-28',title:'CP World BL / Freight Release Process',owner:'Farhan',priority:'high',tags:['CP-World'],link:L.swb_freight_release},
      {id:'SOP-OCN-IN-29',title:'Noble Shipping BL / Freight Release',owner:'Farhan',priority:'high',tags:['Noble'],link:L.swb_freight_release},
      {id:'SOP-OCN-IN-30',title:'Liner Origin D+D Information SOP',owner:'Jaideep',priority:'high',tags:['demurrage','detention'],link:''},
      {id:'SOP-OCN-IN-31',title:'Customs & Freight Release Check Guide',owner:'Raunak',priority:'critical',tags:['freight-release','terminal'],link:L.customs_freight_release},
    ],'UK2US':[
      {id:'SOP-OCN-UK-21',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:L.swb_freight_release},
      {id:'SOP-OCN-UK-22',title:'Customs & Freight Release Check Guide',owner:'Raunak',priority:'critical',tags:['freight-release'],link:L.customs_release_uk},
    ],'DE2US':[
      {id:'SOP-OCN-DE-15',title:'SWB Release & Freight Release SOP',owner:'Farhan',priority:'critical',tags:['BL','freight-release'],link:L.swb_freight_release},
      {id:'SOP-OCN-DE-16',title:'Customs & Freight Release Check Guide',owner:'Raunak',priority:'critical',tags:['freight-release'],link:L.customs_release_uk},
    ]}},

  { id:'clearance', label:'Import Clearance', short:'Import Clear', icon:'🛃', color:'#EF4444',
    desc:'Document verification, 7501 entry filing, customs duty payment, freight & customs release',
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-32',title:'Ocean Import Clearance SOP',owner:'Raunak',priority:'critical',tags:['import','7501','customs'],link:L.ocean_import_clearance},
      {id:'SOP-OCN-IN-33',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','exception'],link:L.import_clearance_faq},
    ],'UK2US':[
      {id:'SOP-OCN-UK-24',title:'Import Clearance SOP — UK',owner:'Raunak',priority:'critical',tags:['import','UK','7501'],link:L.ocean_import_clearance_uk},
      {id:'SOP-OCN-UK-25',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','UK'],link:L.import_clearance_faq_uk},
    ],'DE2US':[
      {id:'SOP-OCN-DE-18',title:'Import Clearance SOP — DE',owner:'Raunak',priority:'critical',tags:['import','DE','7501'],link:L.ocean_import_clearance_uk},
      {id:'SOP-OCN-DE-19',title:'Import Clearance Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','DE'],link:L.import_clearance_faq},
    ]}},

  { id:'delivery', label:'Delivery', short:'Delivery', icon:'🏁', color:'#10B981',
    desc:'Direct drayage to FBA / Walmart, or transloading + last mile delivery', subStages:['Direct Drayage','Transloading'],
    sops:{ 'IN2US':[
      {id:'SOP-OCN-IN-34',title:'Drayage Delivery Operations SOP — IN to US',owner:'Raunak',priority:'critical',tags:['drayage','IN2US'],link:L.drayage_in2us},
      {id:'SOP-OCN-IN-35',title:'Drayage Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','drayage'],link:L.drayage_faq},
      {id:'SOP-OCN-IN-36',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading','storage'],link:L.transloading},
      {id:'SOP-OCN-IN-37',title:'Transloading Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','transloading'],link:L.transloading_faq},
      {id:'SOP-OCN-IN-38',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:L.amazon_freight},
      {id:'SOP-OCN-IN-39',title:'XPO Truck Booking Guide',owner:'Raunak',priority:'critical',tags:['XPO','truck'],link:L.xpo_booking},
      {id:'SOP-OCN-IN-40',title:'Walmart Appointment Scheduling Guide',owner:'Raunak',priority:'high',tags:['Walmart','appointment'],link:L.walmart_appointment},
      {id:'SOP-OCN-IN-41',title:'Amazon FBA ID / FC Redirection Guide',owner:'Raunak',priority:'critical',tags:['Amazon','FBA','redirect'],link:L.fba_redirection},
      {id:'SOP-OCN-IN-42',title:'Everlast Inbound / Outbound Process',owner:'Raunak',priority:'medium',tags:['Everlast','warehouse'],link:L.everlast},
    ],'UK2US':[
      {id:'SOP-OCN-UK-26',title:'Drayage Delivery Operations SOP — UK to US',owner:'Raunak',priority:'critical',tags:['drayage','UK2US'],link:L.drayage_uk2us},
      {id:'SOP-OCN-UK-27',title:'Drayage Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','drayage'],link:L.drayage_faq_uk},
      {id:'SOP-OCN-UK-28',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading'],link:L.transloading},
      {id:'SOP-OCN-UK-29',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:L.amazon_freight},
      {id:'SOP-OCN-UK-30',title:'Walmart Appointment Scheduling Guide',owner:'Raunak',priority:'high',tags:['Walmart'],link:L.walmart_appointment},
      {id:'SOP-OCN-UK-31',title:'Partner Portal Destination Handling SOP',owner:'Mustafa',priority:'medium',tags:['partner','portal'],link:L.partner_portal},
    ],'DE2US':[
      {id:'SOP-OCN-DE-20',title:'Drayage Delivery Operations SOP — DE to US',owner:'Raunak',priority:'critical',tags:['drayage','DE2US'],link:L.drayage_de2us},
      {id:'SOP-OCN-DE-21',title:'Drayage Issue Handling Guide',owner:'Raunak',priority:'high',tags:['FAQ','drayage'],link:L.drayage_faq_uk},
      {id:'SOP-OCN-DE-22',title:'Transloading / Storage SOP',owner:'Raunak',priority:'critical',tags:['transloading'],link:L.transloading},
      {id:'SOP-OCN-DE-23',title:'Amazon Freight Booking Guidelines',owner:'Raunak',priority:'critical',tags:['Amazon','FBA'],link:L.amazon_freight},
    ]}},
]

// ─── AIR LIFECYCLE ───────────────────────────────────────────────────
const AIR_STAGES = [
  { id:'booking', label:'Booking Confirmation', short:'Booking', icon:'📋', color:'#FF6B2B',
    desc:'Rate confirmation, ICL / FedEx / disaggregated booking, vendor rates',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-01',title:'FedEx IN2US Quoting Tool SOP',owner:'Jaideep',priority:'critical',tags:['FedEx','quoting','ICL'],link:''},
      {id:'SOP-AIR-IN-02',title:'Disaggregated Calculator — IN2US Air SOP',owner:'Jaideep',priority:'critical',tags:['disaggregated','pricing'],link:''},
      {id:'SOP-AIR-IN-03',title:'Buy Rates Updation SOP',owner:'Jaideep',priority:'high',tags:['buy-rates'],link:''},
    ],'UK2US':[
      {id:'SOP-AIR-UK-01',title:'UK to US Air CS Tracker SOP',owner:'Jaideep',priority:'critical',tags:['UK','CS-tracker'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-01',title:'DE2US Air Pricing SOP',owner:'Jaideep',priority:'critical',tags:['DE','quoting'],link:''},
    ]}},

  { id:'documents', label:'Document Verification', short:'Doc Verify', icon:'📄', color:'#3B82F6',
    desc:'Commercial invoice, packing list, AD code, FBA IDs, FedEx shipping label creation',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-04',title:'New Customer Document Verification SOP',owner:'Shreyas',priority:'critical',tags:['verification','new-customer'],link:L.air_doc_verification},
      {id:'SOP-AIR-IN-05',title:'AD Code & IFSC Registration Guide',owner:'Shreyas',priority:'critical',tags:['ICEGATE','AD-code'],link:L.ad_code_ifsc},
      {id:'SOP-AIR-IN-06',title:'FedEx Shipping Label Creation SOP',owner:'Shreyas',priority:'critical',tags:['FedEx','label'],link:L.fedex_label},
      {id:'SOP-AIR-IN-07',title:'Marking & Labeling Guide SOP',owner:'Shreyas',priority:'high',tags:['packaging','labels'],link:L.marking_labeling},
      {id:'SOP-AIR-IN-08',title:'Document Verification Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','exception'],link:L.air_doc_faq},
      {id:'SOP-AIR-IN-09',title:'Cargo Insurance Guide',owner:'Shreyas',priority:'medium',tags:['insurance'],link:L.air_cargo_insurance},
    ],'UK2US':[
      {id:'SOP-AIR-UK-02',title:'New Customer Document Verification SOP — UK',owner:'Shreyas',priority:'critical',tags:['verification','UK'],link:L.air_doc_verification},
      {id:'SOP-AIR-UK-03',title:'Document Verification Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','UK'],link:L.air_doc_faq},
    ],'DE2US':[
      {id:'SOP-AIR-DE-02',title:'New Customer Document Verification SOP — DE',owner:'Shreyas',priority:'critical',tags:['verification','DE'],link:L.air_doc_verification},
    ]}},

  { id:'pickup', label:'Pickup / Drop Off', short:'Pickup', icon:'🚚', color:'#10B981',
    desc:'Cargo pickup from shipper, CFS / RGL drop-off, checklist verification',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-10',title:'Pick Up Operations Guide — Air IN2US',owner:'Shreyas',priority:'critical',tags:['pickup','air'],link:L.air_pickup},
      {id:'SOP-AIR-IN-11',title:'Cargo Drop-Off Operation SOP',owner:'Shreyas',priority:'critical',tags:['drop-off','CFS'],link:L.air_dropoff},
      {id:'SOP-AIR-IN-12',title:'Checklist Verification SOP',owner:'Shreyas',priority:'critical',tags:['checklist','CFS'],link:L.air_checklist},
      {id:'SOP-AIR-IN-13',title:'Pickup & Drop Off Exception Handling Guide',owner:'Shreyas',priority:'high',tags:['FAQ','exception'],link:L.air_pickup_faq},
    ],'UK2US':[
      {id:'SOP-AIR-UK-04',title:'Pick Up Operations Guide — UK',owner:'Shreyas',priority:'critical',tags:['pickup','UK'],link:L.air_pickup},
      {id:'SOP-AIR-UK-05',title:'Drop Off Operations Guide — UK',owner:'Shreyas',priority:'critical',tags:['drop-off','UK'],link:L.air_dropoff},
    ],'DE2US':[
      {id:'SOP-AIR-DE-03',title:'Pick Up Operations Guide — DE',owner:'Shreyas',priority:'critical',tags:['pickup','DE'],link:L.air_pickup},
    ]}},

  { id:'consol', label:'Consol Planning & Export Clearance', short:'Consol / Export', icon:'🏭', color:'#8B5CF6',
    desc:'CSBV + Commercial consol planning, export clearance, ICL operations',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-14',title:'Air Consol Planning SOP (CSBV + Commercial)',owner:'Shreyas',priority:'critical',tags:['consol','CSBV'],link:L.air_consol_planning},
      {id:'SOP-AIR-IN-15',title:'Air Consol Execution SOP — CSBV',owner:'Shreyas',priority:'critical',tags:['CSBV','execution'],link:L.air_consol_execution},
      {id:'SOP-AIR-IN-16',title:'ICL Warehouse Operations SOP',owner:'Shreyas',priority:'critical',tags:['ICL','warehouse'],link:L.icl_warehouse},
      {id:'SOP-AIR-IN-17',title:'ICL Weight & Audit Update SOP',owner:'Shreyas',priority:'high',tags:['ICL','weight','audit'],link:L.icl_weight_audit},
      {id:'SOP-AIR-IN-18',title:'Export Ops Rep Guide — Disaggregated Supply Chain',owner:'Olympia',priority:'high',tags:['disaggregated','export'],link:L.export_ops_disagg},
    ],'UK2US':[
      {id:'SOP-AIR-UK-06',title:'UK–US Air Ops SOP',owner:'Shreyas',priority:'critical',tags:['UK','air-ops'],link:L.uk_air_ops},
    ],'DE2US':[
      {id:'SOP-AIR-DE-04',title:'DE–US Air Export Operations SOP',owner:'Shreyas',priority:'critical',tags:['DE','air-ops'],link:''},
    ]}},

  { id:'clearance', label:'Import Clearance', short:'Import Clear', icon:'🛃', color:'#EF4444',
    desc:'7501 entry validation, customs clearance, cargo pull, ISC payment',
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-19',title:'Import Clearance SOP — Air',owner:'Shreyas',priority:'critical',tags:['import','7501'],link:L.air_import_clearance},
      {id:'SOP-AIR-IN-20',title:'Air Import Operations SOP — Aggregated (FedEx)',owner:'Jaison',priority:'critical',tags:['import','FedEx','aggregated'],link:L.air_import_delivery_fedex},
      {id:'SOP-AIR-IN-21',title:'Cargo Pull & ISC Payment SOP — Disaggregated',owner:'Jaison',priority:'critical',tags:['cargo-pull','ISC'],link:L.cargo_pull_isc},
      {id:'SOP-AIR-IN-22',title:'Chargeable Weight Updation SOP',owner:'Shreyas',priority:'high',tags:['chargeable-weight'],link:L.chargeable_weight},
      {id:'SOP-AIR-IN-23',title:'Internal WBR Data Review & Callouts SOP',owner:'Shreyas',priority:'medium',tags:['WBR'],link:L.wbr_internal},
    ],'UK2US':[
      {id:'SOP-AIR-UK-07',title:'Import Clearance SOP — Air UK',owner:'Shreyas',priority:'critical',tags:['import','UK'],link:L.air_import_clearance},
      {id:'SOP-AIR-UK-08',title:'Cargo Recovery and ISC Payment SOP',owner:'Shreyas',priority:'critical',tags:['cargo-pull','ISC'],link:L.cargo_pull_isc},
    ],'DE2US':[
      {id:'SOP-AIR-DE-05',title:'Import Clearance SOP — Air DE',owner:'Shreyas',priority:'critical',tags:['import','DE'],link:L.air_import_clearance},
    ]}},

  { id:'delivery', label:'Delivery', short:'Delivery', icon:'🏁', color:'#10B981',
    desc:'FedEx last-mile delivery (aggregated) or destination delivery for disaggregated shipments', subStages:['FedEx Aggregated','Disaggregated Last Mile'],
    sops:{ 'IN2US':[
      {id:'SOP-AIR-IN-24',title:'Import Clearance & Delivery — FedEx',owner:'Jaison',priority:'critical',tags:['FedEx','delivery'],link:L.air_import_delivery_fedex},
      {id:'SOP-AIR-IN-25',title:'Amazon WBR Data Review SOP',owner:'Shreyas',priority:'medium',tags:['WBR','Amazon'],link:L.amazon_wbr},
    ],'UK2US':[
      {id:'SOP-AIR-UK-09',title:'Destination Delivery — Last Mile (UK)',owner:'Piyush',priority:'critical',tags:['last-mile','UK'],link:''},
    ],'DE2US':[
      {id:'SOP-AIR-DE-06',title:'Destination Delivery — Last Mile (DE)',owner:'Shreyas',priority:'critical',tags:['last-mile','DE'],link:''},
    ]}},
]

const PC  = { critical:'#EF4444', high:'#F59E0B', medium:'#3B82F6', low:'#94A3B8' }
const PBg = { critical:'#FEF2F2', high:'#FFFBEB', medium:'#EFF6FF', low:'#F8FAFC' }
const PBd = { critical:'#FECACA', high:'#FDE68A', medium:'#BFDBFE', low:'#E2E8F0' }

function StageTimeline({ stages, activeId, onSelect, lane }) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:4 }}>
      <div style={{ display:'flex', alignItems:'flex-start', minWidth:stages.length*108 }}>
        {stages.map((s,i) => {
          const isActive = s.id === activeId
          const isLast   = i === stages.length - 1
          const count    = s.sops[lane]?.length || 0
          return (
            <div key={s.id} style={{ display:'flex', alignItems:'center', flex:isLast?0:1 }}>
              <div onClick={() => onSelect(s.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, cursor:'pointer', flexShrink:0 }}>
                <div style={{
                  width:isActive?48:38, height:isActive?48:38, borderRadius:'50%',
                  background:isActive?s.color:'#F1F5F9',
                  border:`2px solid ${isActive?s.color:'#E2E8F0'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:isActive?20:14, transition:'all .2s',
                  boxShadow:isActive?`0 0 0 4px ${s.color}22`:'none',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:8.5, letterSpacing:.2, textTransform:'uppercase', fontWeight:isActive?700:500, color:isActive?s.color:'#94A3B8', textAlign:'center', maxWidth:78, lineHeight:1.3 }}>
                  {s.short}
                </div>
                <div style={{ fontSize:8.5, fontWeight:600, padding:'1px 7px', borderRadius:20, background:isActive?s.color:'#F1F5F9', color:isActive?'#fff':'#94A3B8', border:`1px solid ${isActive?s.color:'#E2E8F0'}` }}>
                  {count} SOPs
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

function SOPCard({ sop, stageColor }) {
  const hasLink = !!sop.link
  const open = () => hasLink && window.open(sop.link, '_blank')

  return (
    <div
      onClick={open}
      style={{
        background:'#fff', borderRadius:10, padding:'14px 16px',
        border:'1.5px solid #E2E8F0', cursor:hasLink?'pointer':'default',
        transition:'all .15s', boxShadow:'0 1px 3px rgba(0,0,0,0.05)',
        borderTop:`3px solid ${PC[sop.priority]}`,
        opacity: hasLink ? 1 : 0.72,
      }}
      onMouseEnter={e => { if (hasLink) { e.currentTarget.style.borderColor=stageColor; e.currentTarget.style.boxShadow=`0 4px 16px rgba(0,0,0,0.10)` }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9.5, fontWeight:700, color:stageColor, letterSpacing:.5, marginBottom:4, textTransform:'uppercase' }}>{sop.id}</div>
          <div style={{ fontSize:13, fontWeight:600, color:'#0F172A', lineHeight:1.4 }}>{sop.title}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0 }}>
          <div style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20, background:PBg[sop.priority], color:PC[sop.priority], border:`1px solid ${PBd[sop.priority]}`, textTransform:'uppercase', letterSpacing:.4 }}>
            {sop.priority}
          </div>
          {hasLink
            ? <div style={{ fontSize:10, fontWeight:700, color:'#FF6B2B', display:'flex', alignItems:'center', gap:3 }}>
                <span>↗</span><span>Open Doc</span>
              </div>
            : <div style={{ fontSize:9, color:'#94A3B8', fontStyle:'italic' }}>Link pending</div>
          }
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
        <div style={{ fontSize:11, color:'#64748B', display:'flex', alignItems:'center', gap:4 }}>
          <span>👤</span><span>{sop.owner}</span>
        </div>
        <div style={{ flex:1 }} />
        {sop.tags.slice(0,3).map(t => (
          <div key={t} style={{ fontSize:9, padding:'2px 7px', borderRadius:20, fontWeight:500, background:'#F1F5F9', border:'1px solid #E2E8F0', color:'#64748B' }}>#{t}</div>
        ))}
      </div>
    </div>
  )
}

export default function PublicView() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [mode, setMode] = useState('ocean')
  const [lane, setLane] = useState('IN2US')
  const [activeStageId, setActiveStageId] = useState('booking')
  const [search, setSearch] = useState('')

  const stages = mode === 'ocean' ? OCEAN_STAGES : AIR_STAGES
  const activeStage = stages.find(s => s.id === activeStageId) || stages[0]

  const handleMode  = (m)  => { setMode(m); setActiveStageId('booking'); setSearch('') }
  const handleStage = (id) => { setActiveStageId(id); setSearch('') }

  const stageSops = activeStage.sops[lane] || []
  const filtered  = stageSops.filter(s =>
    !search ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    s.owner.toLowerCase().includes(search.toLowerCase())
  )

  const totalLaneSops = stages.reduce((a,s) => a + (s.sops[lane]?.length || 0), 0)
  const linkedCount   = filtered.filter(s => s.link).length

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#F8FAFC' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:230, minWidth:230, background:'#0F172A', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'2px 0 8px rgba(0,0,0,0.12)' }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid #1E293B' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'#FF6B2B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>X</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', letterSpacing:.3 }}>Xhipment</div>
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
          {['IN2US','UK2US','DE2US'].map(l => (
            <div key={l} onClick={() => setLane(l)} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'7px 12px', borderRadius:6, cursor:'pointer', marginBottom:3,
              background:lane===l?'rgba(255,107,43,0.15)':'transparent',
              border:lane===l?'1px solid rgba(255,107,43,0.4)':'1px solid transparent', transition:'all .15s',
            }}>
              <span style={{ fontSize:12, fontWeight:lane===l?700:500, color:lane===l?'#FF6B2B':'#94A3B8' }}>{l}</span>
              <span style={{ fontSize:10, fontWeight:600, color:lane===l?'#FF6B2B':'#475569', background:lane===l?'rgba(255,107,43,0.1)':'#1E293B', padding:'1px 7px', borderRadius:20 }}>
                {stages.reduce((a,s) => a + (s.sops[l]?.length || 0), 0)}
              </span>
            </div>
          ))}
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
                <span style={{ fontSize:10, fontWeight:700, color:isActive?'#FF6B2B':'#475569', background:isActive?'rgba(255,107,43,0.15)':'#1E293B', borderRadius:20, padding:'1px 6px' }}>{count}</span>
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

      {/* ── MAIN ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <div style={{ height:60, padding:'0 24px', background:'#fff', borderBottom:'1.5px solid #E2E8F0', display:'flex', alignItems:'center', gap:16, flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'#0F172A', letterSpacing:-.2 }}>
              {mode==='ocean'?'🚢':'✈️'} {mode==='ocean'?'Ocean':'Air'} <span style={{ color:'#FF6B2B' }}>SOP Lifecycle</span>
            </div>
            <div style={{ fontSize:11, color:'#94A3B8', marginTop:1 }}>{lane} · {totalLaneSops} SOPs across {stages.length} stages</div>
          </div>
          <div style={{ flex:1 }} />
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94A3B8', fontSize:13 }}>🔍</span>
            <input placeholder="Search SOPs, owners, tags..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ paddingLeft:30, paddingRight:12, paddingTop:8, paddingBottom:8, width:260, fontSize:13 }} />
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background:'#fff', borderBottom:'1.5px solid #E2E8F0', padding:'16px 24px 4px', flexShrink:0 }}>
          <StageTimeline stages={stages} activeId={activeStageId} onSelect={handleStage} lane={lane} />
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 32px' }}>

          {/* Stage header */}
          <div style={{ background:'#fff', border:'1.5px solid #E2E8F0', borderRadius:12, padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', borderLeft:`4px solid ${activeStage.color}` }}>
            <div style={{ width:46, height:46, borderRadius:10, background:`${activeStage.color}14`, border:`1.5px solid ${activeStage.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
              {activeStage.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#0F172A', marginBottom:3 }}>{activeStage.label}</div>
              <div style={{ fontSize:12, color:'#64748B' }}>{activeStage.desc}</div>
              {activeStage.subStages && (
                <div style={{ display:'flex', gap:6, marginTop:7 }}>
                  {activeStage.subStages.map(sub => (
                    <div key={sub} style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:`${activeStage.color}10`, border:`1px solid ${activeStage.color}30`, color:activeStage.color }}>⤷ {sub}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:26, fontWeight:900, color:activeStage.color, lineHeight:1 }}>{filtered.length}</div>
              <div style={{ fontSize:9.5, color:'#94A3B8', fontWeight:600, textTransform:'uppercase', letterSpacing:.5 }}>SOPs · {lane}</div>
              {linkedCount < filtered.length && (
                <div style={{ fontSize:9.5, color:'#F59E0B', marginTop:3 }}>{linkedCount} with docs open</div>
              )}
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
                {search ? 'No SOPs match your search' : 'No SOPs for this stage yet'}
              </div>
              <div style={{ fontSize:13, color:'#94A3B8' }}>
                {search ? 'Try a different keyword or clear the search.' : 'SOPs will appear here once added.'}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}
