# gun-portfolio

Personal portfolio for **Gorawit Phinit (Gun)** — IT Support Engineer specializing in factory infrastructure, ERP systems, and web development.

Live: [gun-portfolio.vercel.app](https://gun-portfolio.vercel.app) &nbsp;·&nbsp; Admin: `/admin`

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + Motion (Framer) |
| 3D / Canvas | Three.js (V2 hero) |
| i18n | react-i18next (EN / TH) |
| Database | Supabase (PostgreSQL + Storage) |
| Routing | React Router v7 |
| Deploy | Vercel |

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Main portfolio — dark-tech design with topology canvas, glitch hero, customize panel |
| `/demo/saas-dashboard` | Demo 01 — SaaS Analytics Dashboard |
| `/demo/ecommerce-storefront` | Demo 02 — E-commerce Storefront |
| `/demo/two-sided-marketplace` | Demo 03 — Two-sided Marketplace |
| `/demo/crm-sales-pipeline` | Demo 04 — CRM / Sales Pipeline |
| `/demo/booking-reservation` | Demo 05 — Booking & Reservation |
| `/demo/lms-course-platform` | Demo 06 — LMS / Course Platform |
| `/demo/personal-finance-tracker` | Demo 07 — Personal Finance Tracker |
| `/demo/patient-portal` | Demo 08 — Patient Portal |
| `/demo/logistics-live-tracking` | Demo 09 — Logistics / Live Tracking |
| `/demo/social-community` | Demo 10 — Social / Community |
| `/admin` | Admin dashboard (requires auth) |
| `/admin/login` | Admin login |

---

## Features

- **Live status ticker** — real-time ping, uptime counter, deploy label in navbar
- **4 hero styles** — ascii / terminal / split (with system panel) / minimal — switchable live
- **Glitch effect** on hero name (hover or auto every 4.5s)
- **Typewriter role** — 3 animation modes: typewriter / fade / terminal
- **Topology canvas** — animated network graph background (desktop only)
- **Customize UI panel** — visitors can tweak accent palette, bg pattern, hero style, density live
- **Global theme/lang sync** — `gun_tweaks.theme` + `gun_tweaks.lang` are shared across `/` and all `/demo/*` routes
- **Konami code** easter egg (`↑↑↓↓←→←→BA`)
- **Crosshair cursor** + **terminal beep sounds** (opt-in)
- **Bilingual** — EN / TH via i18n, persisted to localStorage
- **Supabase CMS** — profile, projects, experience, messages managed via admin dashboard
- **Contact form** → Supabase `messages` table (real-time insert)
- **CV download** from Supabase Storage

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/kun0620/gun-portfolio.git
cd gun-portfolio

# 2. Install dependencies
npm install

# 3. Environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Run dev server
npm run dev
# http://localhost:5173
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> The portfolio falls back to locale data (`src/locales/en.js` / `th.js`) if Supabase is not configured.

---

## Data Source Notes

- **Main portfolio (`/`)**: Supabase-backed for profile/projects/experience/messages (with locale fallback if Supabase is not configured).
- **Demo pages (`/demo/*`)**: mock data (frontend-only showcase; no backend required).

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Status ticker + nav + Typewriter
│   ├── Hero.jsx            # 4 hero style variants + glitch
│   ├── Sections.jsx        # About, Skills, Projects, Experience, Contact, KonamiOverlay
│   ├── CustomizePanel.jsx  # Visitor-facing live tweak panel
│   ├── Topology.jsx        # Canvas2D network topology background
│   ├── Footer.jsx
│   └── Skeleton.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── EcommerceStorefrontPage.jsx
│   ├── KradoMarketplacePage.jsx
│   ├── PipelinePage.jsx
│   ├── BookingPage.jsx
│   ├── LearnlyPage.jsx
│   ├── FinancePage.jsx
│   ├── HealthPage.jsx
│   ├── LogisticsPage.jsx
│   ├── PulseHubPage.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       └── AdminDashboard.jsx  # Profile / Projects / Experience / Messages tabs
├── hooks/
│   ├── useProfile.js
│   ├── useProjects.js
│   ├── useExperience.js
│   ├── useAuth.js
│   └── useUpload.js
├── lib/
│   ├── supabase.js
│   ├── utils.js            # applyAccent, beep, useReveal, useKonami, useLiveStatus...
│   └── ...
├── context/
│   ├── globalTweak.js      # global theme/lang source of truth (gun_tweaks)
│   └── ...                 # per-demo thin wrappers
├── locales/
│   ├── en.js
│   └── th.js
├── App.jsx                 # Router + Portfolio wrapper
├── main.jsx
└── index.css               # Tailwind v4 + custom classes
```

---

## Supabase Schema

### `profile`
Stores personal info, stats, photo/CV/QR URLs, social links.

### `projects`
Fields: `tag` (INFRA/WEB), `name_en/th`, `sub_en/th`, `body_en/th`, `stack[]`, `metrics jsonb`, `featured`, `display_order`

### `experience`
Fields: `range_en/th`, `role`, `org_en/th`, `body_en/th`, `display_order`

### `messages`
Contact form submissions. Insert: anon. Read/update: authenticated only.

### Storage: `portfolio-assets`
```
portfolio-assets/
├── profile/    ← profile photo
├── cv/         ← CV PDF (EN / TH)
└── qr/         ← WeChat QR image
```

---

## Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## Admin Panel

1. Go to `/admin/login`
2. Sign in with the Supabase Auth user
3. Manage: **Profile** · **Projects** · **Experience** · **Messages**

Changes reflect on the portfolio immediately (no rebuild needed).

---

## License

Personal portfolio — not for redistribution.
