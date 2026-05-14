-- ============================================================
-- XHIPMENT SOP PORTAL — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- TEAM MEMBERS (email recipients for notifications)
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- SOPS
CREATE TABLE IF NOT EXISTS sops (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  version text NOT NULL DEFAULT 'v1.0',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','under_review','archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical','high','medium','low')),
  description text,
  owner text,
  team_id uuid REFERENCES teams(id),
  tags text[] DEFAULT '{}',
  steps jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AMENDMENTS (full history log)
CREATE TABLE IF NOT EXISTS amendments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_id text REFERENCES sops(id) ON DELETE CASCADE,
  version text NOT NULL,
  change_summary text NOT NULL,
  changed_by text NOT NULL,
  previous_steps jsonb,
  previous_description text,
  notified_team_id uuid REFERENCES teams(id),
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- AUTO-UPDATE updated_at on sops
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sops_updated_at
  BEFORE UPDATE ON sops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE amendments ENABLE ROW LEVEL SECURITY;

-- Public can read SOPs and teams (authenticated or anon)
CREATE POLICY "SOPs are publicly readable" ON sops FOR SELECT USING (true);
CREATE POLICY "Teams are publicly readable" ON teams FOR SELECT USING (true);
CREATE POLICY "Team members are publicly readable" ON team_members FOR SELECT USING (true);
CREATE POLICY "Amendments are publicly readable" ON amendments FOR SELECT USING (true);

-- Only authenticated users (admins) can write
CREATE POLICY "Admins can insert SOPs" ON sops FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update SOPs" ON sops FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete SOPs" ON sops FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admins can manage teams" ON teams FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage team members" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can insert amendments" ON amendments FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO teams (id, name, description) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Operations', 'Air & Ocean freight operations team'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Customs & Compliance', 'Customs clearance and trade compliance'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Documentation', 'Shipping documentation and records'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Warehouse', 'Cargo handling and warehousing'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'Customer Service', 'Client communication and support')
ON CONFLICT DO NOTHING;

INSERT INTO sops (id, title, category, version, status, priority, description, owner, team_id, tags, steps) VALUES
('SOP-001','Air Freight Export Booking','export','v2.3','active','critical',
 'End-to-end procedure for booking air freight export shipments from customer inquiry through cargo acceptance.',
 'Sarah Chen','a1b2c3d4-0001-0001-0001-000000000001',
 ARRAY['air','export','AWB'],
 '[{"id":1,"title":"Receive Shipment Request","duration":"15 min","dept":"Customer Service","desc":"Collect all shipment details from customer: commodity, weight, dimensions, origin/destination, required delivery date."},{"id":2,"title":"Rate Quotation","duration":"30 min","dept":"Pricing","desc":"Check airline rate contracts, calculate all-in price including handling, fuel surcharge, security, and destination charges."},{"id":3,"title":"Space Booking Confirmation","duration":"20 min","dept":"Operations","desc":"Reserve space on preferred airline. Confirm booking and obtain AWB prefix/booking reference number."},{"id":4,"title":"Documentation Preparation","duration":"45 min","dept":"Documentation","desc":"Prepare MAWB, HAWB, packing list, commercial invoice, and any certificates required by destination country."},{"id":5,"title":"Cargo Acceptance & Screening","duration":"60 min","dept":"Warehouse","desc":"Physical receipt and verification of cargo weight/dimensions. Complete DG check and security screening. Issue cargo receipt."},{"id":6,"title":"Customs Export Filing","duration":"30 min","dept":"Customs","desc":"Submit electronic export declaration, obtain export clearance, attach clearance document to AWB."},{"id":7,"title":"Cargo Delivery to Airport","duration":"90 min","dept":"Transport","desc":"Transport cargo to airport, deliver to airline terminal within cut-off time, obtain airside receipt."}]'::jsonb
),
('SOP-002','Ocean FCL Import Clearance','import','v3.1','active','critical',
 'Full Container Load ocean import procedure from pre-arrival through customs clearance and final delivery.',
 'Michael Torres','a1b2c3d4-0002-0002-0002-000000000002',
 ARRAY['ocean','FCL','import','B/L'],
 '[{"id":1,"title":"Pre-Arrival Notification","duration":"1 day","dept":"Operations","desc":"Monitor vessel tracking, notify consignee of ETA, request original B/L or telex release from shipper."},{"id":2,"title":"Document Collection","duration":"2 days","dept":"Documentation","desc":"Collect B/L, commercial invoice, packing list, certificate of origin, and any import permits required."},{"id":3,"title":"Customs Entry Preparation","duration":"4 hours","dept":"Customs","desc":"Classify goods using HS codes, calculate duties and taxes, prepare electronic entry declaration."},{"id":4,"title":"Customs Submission & Release","duration":"2 hours","dept":"Customs","desc":"File electronic entry, facilitate duty payment, obtain customs release or examination order."},{"id":5,"title":"Port Charges & Demurrage","duration":"30 min","dept":"Operations","desc":"Calculate remaining free time, arrange pick-up before demurrage charges apply."},{"id":6,"title":"Container Release","duration":"3 hours","dept":"Operations","desc":"Collect delivery order from shipping line, pay THC, schedule container pick-up."},{"id":7,"title":"Final Delivery","duration":"1 day","dept":"Transport","desc":"Coordinate last-mile delivery, obtain signed POD, update shipment records."}]'::jsonb
),
('SOP-003','Dangerous Goods Declaration','dangerous','v1.8','active','critical',
 'Mandatory compliance procedure for IATA/IMDG classified dangerous goods shipments.',
 'James Wilson','a1b2c3d4-0002-0002-0002-000000000002',
 ARRAY['DG','IATA','IMDG','hazmat'],
 '[{"id":1,"title":"DG Classification Verification","duration":"1 hour","dept":"Compliance","desc":"Verify UN number, proper shipping name, hazard class and packing group using IATA DGR or IMDG Code."},{"id":2,"title":"Packaging & Labeling Check","duration":"45 min","dept":"Compliance","desc":"Confirm UN-specification packaging. Verify correct hazard labels, handling marks and UN number marks are affixed."},{"id":3,"title":"DG Declaration Completion","duration":"30 min","dept":"Documentation","desc":"Complete Shippers Declaration for Dangerous Goods accurately. Obtain original signature from DG-certified rep."},{"id":4,"title":"Carrier Acceptance Approval","duration":"2 hours","dept":"Operations","desc":"Submit advance DG notification to carrier. Obtain written acceptance confirmation."},{"id":5,"title":"Emergency Response Documentation","duration":"15 min","dept":"Compliance","desc":"Ensure MSDS/SDS on file, emergency contact numbers documented, ERP procedures communicated to all staff."}]'::jsonb
)
ON CONFLICT DO NOTHING;
