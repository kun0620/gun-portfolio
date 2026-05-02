# UI/UX Pro Max Design Spec (Remaining 2 Demos)

Generated with `ui-ux-pro-max` workflow (`--design-system`) and adapted to this portfolio's dark technical language.

## Scope
- Demo 09: `Logistics / Live Tracking` → **TransitOS**
- Demo 10: `Social / Community` → **PulseHub**

---

## 1) TransitOS — Logistics / Live Tracking

### 1.1 Design Direction (from ui-ux-pro-max)
- Style: **Real-Time Monitoring**
- Core behavior: live status, alerting, streaming updates, operational readability
- Typography mood: **Fira Code + Fira Sans**
- Visual guardrails:
  - No purple/pink AI gradients
  - Map-first and data-first layout
  - Strong keyboard focus and WCAG-friendly contrast

### 1.2 Prompt (for Stitch / AI UI)
```text
Apply a UI/UX Pro Max pass.

Design a dark technical web app demo called “TransitOS” (Logistics / Live Tracking), aligned with my portfolio style (black/cyan, operational, dense-but-clear). Build the actual product UI, not a marketing landing page.

Primary style direction:
- Real-time monitoring dashboard
- Live status indicators, alert rails, active map routing
- High information density with clean hierarchy
- Fira Code + Fira Sans feeling for technical readability

Layout:
1) Top nav (56px): brand, global search, EN/TH toggle, theme toggle, notifications, profile
2) Left sidebar: Live Map, Shipments, Fleet, Alerts, Analytics, Settings
3) Main canvas:
   - Large live map panel (routes, moving vehicles, hub markers, legend)
   - Right-side critical panel: Critical Alerts, ETA Drift, SLA Risks
4) Bottom section:
   - Shipment table (ID, origin, destination, carrier, ETA, status, risk)
   - KPI cards: Active Shipments, On-time Rate, Avg ETA Error, Incidents

Interactions:
- Filter chips: In Transit / Delayed / Delivered / Exception
- Search shipment ID, city, customer
- Sort and column toggles in table
- Click row opens shipment detail drawer:
  timeline checkpoints, driver, vehicle, temp/sensor data, customer note
- Severity system: info/warning/critical with clear visual encoding
- Include loading / empty / error states

Visual rules:
- No purple/pink AI gradients
- Use subtle cyan accents + orange for warning
- Keep hover transitions 150–250ms (color/opacity only)
- No layout shift on hover
- Strong keyboard focus states
- Respect prefers-reduced-motion

Responsive:
- Provide desktop/tablet/mobile variants at 1440 / 1024 / 768 / 375
- No horizontal overflow
- On mobile, convert table to stacked cards with preserved critical fields
```

### 1.3 Implementation Notes (React + Vite)
- Keep layout deterministic (no random visual placements).
- Use reusable blocks:
  - `TopNav`, `SideNav`, `MapPanel`, `AlertRail`, `ShipmentTable`, `ShipmentDrawer`, `KpiRow`.
- Use status token mapping:
  - `info`, `warning`, `critical` → consistent badge + icon + border color.
- Ensure mobile does not render desktop-wide table overflow.

---

## 2) PulseHub — Social / Community

### 2.1 Design Direction (from ui-ux-pro-max, adapted)
- Base result suggested vibrant social style.
- Adapted to this project’s visual language:
  - dark technical UI
  - restrained accent usage
  - productivity-first community surface
- Typography mood: **Inter**

### 2.2 Prompt (for Stitch / AI UI)
```text
Apply a UI/UX Pro Max pass.

Design a dark community product demo called “PulseHub”, but keep it in the same technical design family as my portfolio (not playful/marketing). Build a real in-app experience from first screen.

Primary style direction:
- Productive social/community workspace
- Feed-centric, modular, high scannability
- Inter-based typography, crisp spacing, strong contrast
- Calm dark surfaces with cyan accents (brand-consistent)

Layout:
1) Top nav: brand, search, EN/TH toggle, theme toggle, messages, notifications, user menu
2) Left sidebar: Home Feed, Explore, Groups, Events, Bookmarks, Profile
3) Center column:
   - Post composer (text, media attach, audience)
   - Feed list cards (author, role badge, timestamp, content, media, tags, engagement)
4) Right rail:
   - Trending topics
   - Suggested groups
   - Active members
   - Upcoming events

Interactions:
- Feed tabs: For You / Following / Groups
- Reactions, comment preview, save, share
- Open post detail modal with full thread
- Group join/request states
- Moderation states: hidden/reported/deleted placeholder
- Include loading / empty / error states

Visual rules:
- No oversized hero sections, no marketing blocks
- Keep cards compact and readable
- Hover transitions 150–250ms (no aggressive scale)
- Visible focus rings + keyboard navigation
- Respect prefers-reduced-motion

Responsive:
- 1440 / 1024 / 768 / 375 variants
- No overlaps or overflow
- Right rail collapses below feed on tablet/mobile
```

### 2.3 Implementation Notes (React + Vite)
- Suggested component boundaries:
  - `TopNav`, `LeftRail`, `FeedTabs`, `Composer`, `PostCard`, `PostModal`, `RightRail`.
- Keep one source of truth for post state and modal active post.
- Use badge tokens for roles:
  - `verified`, `admin`, `moderator` (consistent style across feed and modal).

---

## 3) Shared QA Checklist (Both Demos)
- Breakpoints verified: **375 / 768 / 1024 / 1440**
- No horizontal overflow
- Keyboard focus clearly visible
- `prefers-reduced-motion` handled
- Loading / Empty / Error states present
- EN/TH text expansion does not break layout

