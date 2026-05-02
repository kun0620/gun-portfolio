# P09 — TransitOS (Logistics / Live Tracking)
## design.md → Upload to Stitch
## Built with ui-ux-pro-max: Dark Real-Time Monitoring + Ops Console pattern

---

## Theme Reference
gun-portfolio dark-tech + operations context
- Background: `#0A0A0A` (OLED black)
- Accent: `#22D3EE` (Cyan — live telemetry clarity)
- Warning: `#F59E0B` (ETA drift / delay)
- Critical: `#EF4444` (incident / exception)
- Style: dark technical precision — no marketing hero, no clutter, high scan speed
- Fonts: **Fira Code (heading/data)** + **Fira Sans (body)**

---

## App Identity
- **Name:** TransitOS
- **Type:** Two-sided logistics live tracking console
- **Aesthetic:** NOC + dispatch center (calm but high-signal)
- **Screen:** Operations dashboard — map + alerts + shipments + KPI
- **Features:** ENG/TH toggle · Dark/Light mode · ← Back to Home

---

## Typography
Source: ui-ux-pro-max → "real-time monitoring dashboard technical analytics"

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

- Fira Code 700 → KPI values, shipment IDs, ETA values
- Fira Code 600 → section headings, status counters
- Fira Sans 400/500 → table/body/filter labels
- Fira Sans 300 → muted metadata
- Line-height: `1.5` body / `1.2` data
- Letter-spacing: 0 (no compressed tracking)

---

## Color System (Dark — Default)

```
--bg:              #0A0A0A
--surface:         #111111
--elevated:        #1A1A1A
--border:          #2A2A2A
--border-hover:    #3F3F46
--accent:          #22D3EE
--accent-dim:      #0891B2
--accent-glow:     rgba(34,211,238,0.12)
--text-1:          #F0F0F0
--text-2:          #A1A1AA
--text-3:          #52525B
--status-ok:       #10B981
--status-warn:     #F59E0B
--status-critical: #EF4444
--status-neutral:  #64748B
```

Light Mode:
```
--bg:              #F5F7FA
--surface:         #FFFFFF
--elevated:        #EEF2F7
--border:          #DCE3EC
--text-1:          #111827
--text-2:          #4B5563
--accent:          #0E7490
```

---

## Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ NAVBAR (56px fixed)                                                  │
├───────────────┬──────────────────────────────────────┬───────────────┤
│               │                                      │               │
│ LEFT SIDEBAR  │ MAP PANEL (primary)                 │ ALERT RAIL    │
│ 240px         │ flex-1                               │ 320px         │
│               │                                      │               │
├───────────────┴──────────────────────────────────────┴───────────────┤
│ KPI ROW + SHIPMENT TABLE (full width under map area)                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Navbar (56px)
- `position: fixed; top:0; z-index:50`
- `background: rgba(10,10,10,0.88); backdrop-filter: blur(14px)`
- border-bottom `1px solid #2A2A2A`, padding `0 24px`

Left:
- `◈ TransitOS` (Fira Code 18/700, cyan brand mark)

Right controls (gap 12px):
- Back (icon + label)
- Language toggle (EN/TH)
- Theme toggle
- Notifications
- Profile

---

## Left Sidebar (240px)
- Sticky under navbar
- Nav items:
  - Live Map (active)
  - Shipments
  - Fleet
  - Alerts
  - Analytics
  - Settings

Active row:
```
background: rgba(34,211,238,0.12)
border-left: 2px solid #22D3EE
color: #22D3EE
```

---

## Main — Live Map Panel
- Card surface with rounded 12px, border `#2A2A2A`
- Header:
  - `Live Operations`
  - status badges: `Sync: Live`, `Latency: 124ms`
  - right controls: map layer, region selector

Map content:
- Route lines (active cyan, delayed amber, exception red)
- Vehicle nodes:
  - dot + heading arrow
  - tooltip: shipment ID, ETA, driver
- Hub markers with count bubbles
- Legend row fixed bottom-left

---

## Alert Rail (320px)
- Vertical list of cards:
  - Critical Alerts
  - ETA Drift
  - SLA Risk

Alert item fields:
- Severity chip
- Shipment ID
- route summary
- timestamp
- action icon

Severity tokens:
- Info: `#64748B`
- Warning: `#F59E0B`
- Critical: `#EF4444`

---

## KPI Row
4 compact cards:
1. Active Shipments
2. On-time Rate
3. Avg ETA Error
4. Incidents

Card spec:
```
background: #111111
border: 1px solid #2A2A2A
radius: 10px
padding: 14px 16px
```
- Label: Fira Sans 11 (`#A1A1AA`)
- Value: Fira Code 28/700 (`#F0F0F0`)
- Delta: status color small row

---

## Shipment Table
Columns:
- Shipment ID
- Origin
- Destination
- Carrier
- ETA
- Status
- Risk

Behaviors:
- Filter pills: All / In Transit / Delayed / Delivered / Exception
- Search input (ID / destination / customer)
- Sort by ETA / status / risk
- Row click opens right drawer

Drawer content:
- timeline checkpoints
- assigned driver + vehicle
- temperature/sensor flags
- customer notes

---

## Interactions & States (ui-ux-pro-max)
| Element | Hover | Click | Notes |
|---|---|---|---|
| Sidebar row | bg elevated | active state | cursor-pointer |
| Filter pill | border/text shift | active cyan | cursor-pointer |
| Shipment row | bg #1A1A1A | open drawer | cursor-pointer |
| Alert row | subtle border | open detail | cursor-pointer |
| KPI card | border accent | — | cursor-default |

Motion:
- 150–250ms color/opacity transitions only
- no layout shift scaling
- supports `prefers-reduced-motion`

---

## Responsive Rules
- 1440: full layout
- 1024: alert rail collapses below map
- 768: table converts to compact rows with key fields
- 375: map height reduced; details via stacked cards; no horizontal scroll

---

## Pre-delivery Checklist
- [ ] No emoji icons (Lucide/Material only)
- [ ] Keyboard focus visible on controls
- [ ] Search/filter/sort all wired
- [ ] Drawer opens from row click
- [ ] Status colors consistent across map/table/alerts
- [ ] No horizontal overflow at 375/768/1024/1440
- [ ] Dark/Light both readable
- [ ] EN/TH copy expansion does not break layout

