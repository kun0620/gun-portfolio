# Gun Portfolio - Implementation Plan

## Context

Build a personal portfolio website from scratch using React + Vite + Tailwind CSS v4 + Supabase + React Router v6. The site has a public-facing homepage with data fetched from Supabase and a protected admin panel for content management. Deploy target is Vercel.

**Directory:** `C:/Users/ktmis010/gun-portfolio` (currently empty except `.omc/`)

## Work Objectives

1. Scaffold a Vite + React project with Tailwind CSS v4 and all dependencies
2. Create the Supabase SQL migration for all tables and RLS policies
3. Build the public site (Home page with Hero, Projects, Skills, Contact sections)
4. Build the admin panel (login, protected dashboard with CRUD for all tables)
5. Configure routing, environment, and Vercel deployment

## Guardrails

### Must Have
- All data fetched from Supabase (no hardcoded content)
- RLS policies enforcing public read / authenticated full access
- Mobile-first responsive design with Tailwind CSS
- Teal accent color #1D9E75 throughout
- Protected admin routes (redirect to login if unauthenticated)
- Immutable state patterns (no mutation)
- Input validation on contact form and admin forms
- Error handling on all Supabase calls

### Must NOT Have
- No SSR/SSG (pure SPA)
- No CSS files or CSS-in-JS (Tailwind only)
- No hardcoded secrets in source
- No unnecessary abstractions or over-engineering
- No additional UI libraries (no Material UI, Chakra, etc.)

---

## Task Flow

### Step 1: Project Scaffolding and Dependencies

**Actions:**
1. Run `npm create vite@latest . -- --template react` in `C:/Users/ktmis010/gun-portfolio`
2. Install dependencies:
   ```
   npm install @supabase/supabase-js react-router-dom
   npm install -D tailwindcss @tailwindcss/vite
   ```
3. Configure Tailwind CSS v4 in Vite config (using the `@tailwindcss/vite` plugin)
4. Update `src/index.css` with `@import "tailwindcss"`
5. Create `.env.local` with placeholder Supabase credentials
6. Clean up default Vite boilerplate (remove `App.css`, default counter app content)

**Files to create/modify:**
- `vite.config.js` — add `@tailwindcss/vite` plugin
- `src/index.css` — replace with `@import "tailwindcss"` and custom theme (teal accent via `@theme`)
- `.env.local` — `VITE_SUPABASE_URL=placeholder`, `VITE_SUPABASE_ANON_KEY=placeholder`
- `.gitignore` — ensure `.env.local` is listed
- `vercel.json` — SPA rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

**Acceptance criteria:**
- `npm run dev` starts without errors
- Tailwind utility classes render correctly
- No boilerplate counter app remains

---

### Step 2: Supabase Migration and Client Setup

**Actions:**
1. Create SQL migration file with all 4 tables, RLS policies, and seed data
2. Create the Supabase client initialization module

**Files to create:**

**`supabase/migrations/001_init.sql`:**
```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profile table (single row)
create table profile (
  id uuid primary key default uuid_generate_v4(),
  hero_title text not null default '',
  hero_subtitle text not null default '',
  about_text text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

-- Projects table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  live_url text not null default '',
  github_url text not null default '',
  image_url text not null default '',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Skills table
create table skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null default '',
  created_at timestamptz not null default now()
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  read bool not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table profile enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table messages enable row level security;

-- Public SELECT on profile, projects, skills
create policy "Public read profile" on profile for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read skills" on skills for select using (true);

-- Public INSERT on messages (contact form)
create policy "Public insert messages" on messages for insert with check (true);

-- Authenticated full access to all tables
create policy "Auth full profile" on profile for all using (auth.role() = 'authenticated');
create policy "Auth full projects" on projects for all using (auth.role() = 'authenticated');
create policy "Auth full skills" on skills for all using (auth.role() = 'authenticated');
create policy "Auth full messages" on messages for all using (auth.role() = 'authenticated');

-- Seed initial profile row
insert into profile (hero_title, hero_subtitle, about_text)
values ('Hello, I''m Gun', 'Full-Stack Developer', 'I build things for the web.');
```

**`src/lib/supabase.js`:**
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Acceptance criteria:**
- SQL file is valid and creates all 4 tables with correct types
- RLS policies allow public SELECT on profile/projects/skills, public INSERT on messages
- RLS policies allow authenticated users full CRUD on all tables
- `supabase` client exports correctly and reads env vars

---

### Step 3: Routing, Layout, and Hooks Infrastructure

**Actions:**
1. Set up React Router v6 with all routes
2. Create auth context/hook for Supabase auth state
3. Create data-fetching hooks for each table
4. Create a protected route wrapper component

**Files to create:**

**`src/App.jsx`** — Router setup:
- `/` renders `Home`
- `/admin/login` renders `AdminLogin`
- `/admin` renders `AdminDashboard` (wrapped in `ProtectedRoute`)

**`src/hooks/useAuth.js`** — Custom hook:
- Subscribes to `supabase.auth.onAuthStateChange`
- Returns `{ user, loading, signIn, signOut }`
- `signIn(email, password)` calls `supabase.auth.signInWithPassword`
- `signOut()` calls `supabase.auth.signOut`

**`src/hooks/useProfile.js`** — Fetches single profile row via `supabase.from('profile').select('*').single()`

**`src/hooks/useProjects.js`** — Fetches projects ordered by `display_order`

**`src/hooks/useSkills.js`** — Fetches skills, groups by category client-side

**`src/components/ProtectedRoute.jsx`** — Uses `useAuth`:
- If loading, show spinner
- If no user, redirect to `/admin/login`
- Otherwise render `children`

**Acceptance criteria:**
- Navigation between `/`, `/admin/login`, `/admin` works
- Unauthenticated users are redirected from `/admin` to `/admin/login`
- All hooks return `{ data, loading, error }` pattern
- Auth state persists across page refreshes

---

### Step 4: Public Site — Home Page Sections

**Actions:**
1. Build the Home page as a single-page layout composing 4 sections
2. Build each section component fetching its own data
3. Build reusable UI components (Button, Card, SectionHeading, Navbar, Footer)

**Files to create:**

**`src/pages/Home.jsx`** — Composes `<Navbar />`, `<Hero />`, `<Projects />`, `<Skills />`, `<Contact />`, `<Footer />`

**`src/sections/Hero.jsx`:**
- Uses `useProfile` hook
- Displays `hero_title`, `hero_subtitle`, `avatar_url`
- Full-viewport height, centered content
- Teal accent on CTA button

**`src/sections/Projects.jsx`:**
- Uses `useProjects` hook
- Grid of project cards (responsive: 1 col mobile, 2 col md, 3 col lg)
- Each card shows: image, title, description, tags as pills, links to live/github

**`src/sections/Skills.jsx`:**
- Uses `useSkills` hook
- Groups skills by category
- Display as category headings with skill pills/badges underneath
- Teal border/accent on pills

**`src/sections/Contact.jsx`:**
- Form with name, email, message fields
- Validates inputs before submit (non-empty, valid email format)
- Submits via `supabase.from('messages').insert()`
- Shows success/error feedback
- Teal submit button

**`src/components/Navbar.jsx`:**
- Sticky top nav
- Site name/logo on left
- Section links (Hero, Projects, Skills, Contact) as smooth-scroll anchors
- Mobile hamburger menu
- Teal accent on active/hover states

**`src/components/Footer.jsx`:**
- Simple footer with copyright and social links

**`src/components/SectionHeading.jsx`** — Reusable h2 with consistent styling

**`src/components/ProjectCard.jsx`** — Card component for project display

**`src/components/SkillBadge.jsx`** — Pill/badge component for skills

**Design patterns:**
- All colors via Tailwind: use custom theme color `teal` defined in index.css `@theme` block
- Loading states: skeleton placeholders or spinner
- Error states: subtle inline error messages

**Acceptance criteria:**
- Home page renders all 4 sections with data from Supabase
- Contact form validates and submits successfully
- Responsive layout works on mobile (375px), tablet (768px), desktop (1280px)
- Smooth scroll navigation works from navbar
- All sections show loading states while data loads

---

### Step 5: Admin Panel — Login and Dashboard with CRUD

**Actions:**
1. Build the login page
2. Build the dashboard with tab navigation
3. Build CRUD interfaces for each tab

**Files to create:**

**`src/pages/admin/AdminLogin.jsx`:**
- Email + password form
- Calls `signIn` from `useAuth`
- Redirects to `/admin` on success
- Shows error message on failure
- If already authenticated, redirect to `/admin`

**`src/pages/admin/AdminDashboard.jsx`:**
- Tab bar: Profile | Projects | Skills | Messages
- Renders the active tab's content component
- Sign out button in header
- Uses state for active tab

**`src/pages/admin/tabs/ProfileTab.jsx`:**
- Loads profile data with `useProfile`
- Form to edit: `hero_title`, `hero_subtitle`, `about_text`, `avatar_url`
- Save button calls `supabase.from('profile').update()`
- Shows success/error feedback

**`src/pages/admin/tabs/ProjectsTab.jsx`:**
- Lists all projects in a table/list
- "Add Project" button opens inline form
- Each row has Edit and Delete actions
- Form fields: title, description, tags (comma-separated input), live_url, github_url, image_url, display_order
- CRUD via `supabase.from('projects').insert/update/delete`

**`src/pages/admin/tabs/SkillsTab.jsx`:**
- Lists skills grouped by category
- "Add Skill" form with name + category fields
- Delete button per skill
- CRUD via `supabase.from('skills').insert/delete`

**`src/pages/admin/tabs/MessagesTab.jsx`:**
- Lists messages in reverse chronological order
- Shows name, email, message preview, timestamp
- Unread messages highlighted
- Click to expand full message
- "Mark as read" button calls `supabase.from('messages').update({ read: true })`
- Unread count badge on Messages tab

**Acceptance criteria:**
- Login works with valid Supabase credentials
- Invalid credentials show error message
- All 4 tabs render and switch correctly
- Profile edits persist to Supabase
- Projects can be created, edited, and deleted
- Skills can be added and removed
- Messages display correctly with read/unread state
- All forms validate inputs before submission
- Error handling on every Supabase call

---

### Step 6: Polish, Theme, and Deployment Config

**Actions:**
1. Define custom teal theme color in Tailwind v4 `@theme` block
2. Add page title and favicon
3. Ensure consistent spacing, typography, and transitions
4. Verify `vercel.json` for SPA routing
5. Final review of responsive design across breakpoints

**Files to modify:**
- `src/index.css` — Add `@theme { --color-teal: #1D9E75; }` and any other design tokens
- `index.html` — Update `<title>` to "Gun Portfolio", add favicon link
- All components — Ensure consistent use of theme color, spacing scale, font sizes

**Acceptance criteria:**
- Teal accent color (#1D9E75) used consistently for buttons, links, accents, badges
- Site looks clean and minimal on all screen sizes
- `vercel.json` correctly handles SPA routing
- No console errors or warnings
- Page title and favicon are set

---

## File Creation Order (for executor)

```
Phase 1 - Scaffolding:
  npm create vite@latest . -- --template react
  .env.local
  vite.config.js (modify)
  src/index.css (replace)
  vercel.json
  .gitignore (verify)

Phase 2 - Database:
  supabase/migrations/001_init.sql
  src/lib/supabase.js

Phase 3 - Infrastructure:
  src/hooks/useAuth.js
  src/hooks/useProfile.js
  src/hooks/useProjects.js
  src/hooks/useSkills.js
  src/components/ProtectedRoute.jsx
  src/App.jsx (replace)

Phase 4 - Public Site:
  src/components/Navbar.jsx
  src/components/Footer.jsx
  src/components/SectionHeading.jsx
  src/components/ProjectCard.jsx
  src/components/SkillBadge.jsx
  src/sections/Hero.jsx
  src/sections/Projects.jsx
  src/sections/Skills.jsx
  src/sections/Contact.jsx
  src/pages/Home.jsx

Phase 5 - Admin:
  src/pages/admin/AdminLogin.jsx
  src/pages/admin/tabs/ProfileTab.jsx
  src/pages/admin/tabs/ProjectsTab.jsx
  src/pages/admin/tabs/SkillsTab.jsx
  src/pages/admin/tabs/MessagesTab.jsx
  src/pages/admin/AdminDashboard.jsx

Phase 6 - Polish:
  src/index.css (finalize theme)
  index.html (title + favicon)
  Final responsive review
```

## Success Criteria

- [ ] `npm run dev` starts and renders the home page with all 4 sections
- [ ] Data loads from Supabase (or shows loading states with placeholder env vars)
- [ ] Contact form validates and inserts into Supabase messages table
- [ ] `/admin/login` authenticates via Supabase Auth
- [ ] `/admin` is protected and redirects unauthenticated users
- [ ] Admin dashboard has 4 working tabs with full CRUD
- [ ] Site is responsive (mobile-first) with teal (#1D9E75) accent
- [ ] `vercel.json` enables SPA routing for Vercel deployment
- [ ] SQL migration file creates all tables with correct RLS policies
- [ ] No hardcoded secrets in source code
