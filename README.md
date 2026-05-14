# Xhipment SOP Portal

A production-grade Standard Operating Procedure management system for Xhipment's freight forwarding operations. Hosted on GitHub Pages, backed by Supabase, with automated email notifications to teams on every SOP amendment.

---

## Architecture

```
GitHub Pages (React/Vite)
    ↕
Supabase (PostgreSQL + Auth + Row-Level Security)
    ↕
EmailJS (Email notifications to team members)
```

**Public access:** Anyone with the URL can browse and read all SOPs.  
**Admin access:** Authenticated admins can create, edit, amend, and delete SOPs.  
**Notifications:** When an admin amends an SOP, every member of the assigned team receives an email automatically.

---

## Quick Start (Demo Mode)

No setup needed — the app works offline using localStorage.

```bash
git clone https://github.com/YOUR_USERNAME/xhipment-sop.git
cd xhipment-sop
npm install
npm run dev
```

Visit `http://localhost:5173/xhipment-sop/`

**Demo admin login:**
- Email: `admin@xhipment.com`
- Password: `admin123`

---

## Production Setup (3 services, ~45 minutes)

### Step 1 — Fork & Enable GitHub Pages

1. Fork this repo to your GitHub account or organisation
2. Go to **Settings → Pages**
3. Set Source to **GitHub Actions**
4. The site will deploy automatically on every push to `main`

**Your public URL will be:** `https://YOUR_USERNAME.github.io/xhipment-sop/`

---

### Step 2 — Supabase (Database & Authentication)

**2a. Create project**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `xhipment-sop`, choose a strong DB password, pick the closest region

**2b. Run schema**
1. In your Supabase project: **SQL Editor → New Query**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables, RLS policies, and seeds initial data

**2c. Get API keys**
1. Go to **Settings → API**
2. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

**2d. Create admin user**
1. Go to **Authentication → Users → Add User**
2. Enter the admin email (e.g. `admin@xhipment.com`) and a secure password
3. That's it — this user can log in to the admin portal

---

### Step 3 — EmailJS (Team Notifications)

**3a. Create account**
1. Go to [emailjs.com](https://www.emailjs.com) → Sign up (free: 200 emails/month)

**3b. Add email service**
1. **Email Services → Add New Service**
2. Connect your company email (Gmail, Outlook, SMTP, etc.)
3. Copy the **Service ID** → `VITE_EMAILJS_SERVICE_ID`

**3c. Create email template**
1. **Email Templates → Create New Template**
2. Use this template body:

```
Subject: [Xhipment SOP] Amendment Notice — {{sop_id}} {{sop_title}}

Hi {{to_name}},

An SOP assigned to the {{team_name}} team has been amended.

SOP: {{sop_id}} — {{sop_title}}
New Version: {{new_version}}
Date: {{date}}
Updated by: {{changed_by}}

WHAT CHANGED:
{{change_summary}}

View the full procedure at: {{portal_url}}

—
Xhipment SOP Portal
```

3. Copy the **Template ID** → `VITE_EMAILJS_TEMPLATE_ID`
4. Go to **Account → General** → copy **Public Key** → `VITE_EMAILJS_PUBLIC_KEY`

---

### Step 4 — Add secrets to GitHub

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

Add all five secrets:

| Secret name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

Push any commit to `main` to trigger a deploy. Your site will be live in ~2 minutes.

---

## How Notifications Work

1. Admin edits an SOP and fills in **"What changed"** (the amendment summary)
2. On save, the app queries all team members assigned to that SOP's team
3. EmailJS sends a personalised email to each member with the SOP ID, title, version, and summary
4. Every amendment is logged in the **Amendment Log** tab with timestamp and author

To add or remove notification recipients: **Admin Dashboard → Teams & Notifications**

---

## Project Structure

```
xhipment-sop/
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
├── supabase/schema.sql            # Full database schema + seed data
├── src/
│   ├── App.jsx                    # Router + auth + toast context
│   ├── pages/
│   │   ├── PublicView.jsx         # Public SOP browser
│   │   ├── AdminLogin.jsx         # Admin login page
│   │   └── AdminDashboard.jsx     # Admin CRUD + amendment log
│   ├── components/
│   │   ├── SOPEditor.jsx          # Create/edit SOP modal
│   │   ├── TeamManager.jsx        # Team & member management
│   │   └── Toast.jsx              # Notification toasts
│   ├── lib/
│   │   ├── supabase.js            # DB client + demo mode fallback
│   │   └── emailjs.js             # Email notification helper
│   └── data/initialData.js        # Seed data & category definitions
```

---

## Adding a New Admin

1. Go to **Supabase → Authentication → Users → Add User**
2. Enter their email and temporary password
3. Share credentials — they can change their password after first login

> Row-Level Security ensures only authenticated users can write data. Public users can only read.

---

## Local Development

```bash
cp .env.example .env.local
# Fill in your Supabase + EmailJS credentials (or leave blank for demo mode)
npm install
npm run dev
```

---

## Upgrading vite.config.js base path

If you rename the repo, update the `base` in `vite.config.js`:
```js
base: '/YOUR-REPO-NAME/',
```

---

Built for Xhipment — Freight Forwarding Intelligence
