# P10 — PulseHub (Social / Community)
## design.md → Upload to Stitch
## Built with ui-ux-pro-max: Community product pattern (adapted to dark technical portfolio style)

---

## Theme Reference
gun-portfolio dark-tech + community productivity context
- Background: `#0A0A0A`
- Accent: `#22D3EE` (primary interactive)
- Secondary accent: `#3B82F6` (links/highlight)
- Style: feed-first, modular, dense readability; avoid playful marketing look
- Fonts: **Inter** (single-family consistency)

---

## App Identity
- **Name:** PulseHub
- **Type:** Social/community workspace (feed + groups + events)
- **Aesthetic:** Discord/Slack-like clarity with portfolio dark-tech polish
- **Screen:** Feed dashboard — composer + post stream + right insights rail
- **Features:** ENG/TH toggle · Dark/Light mode · ← Back to Home

---

## Typography
Source: ui-ux-pro-max → "social feed community app modern readable"

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

- Inter 700 → section headings, post author
- Inter 600 → tabs, action labels
- Inter 400/500 → body/caption/meta
- Body line-height: `1.55`

---

## Color System (Dark — Default)

```
--bg:               #0A0A0A
--surface:          #111111
--elevated:         #1A1A1A
--border:           #2A2A2A
--border-hover:     #3F3F46
--accent:           #22D3EE
--accent-2:         #3B82F6
--text-1:           #F0F0F0
--text-2:           #A1A1AA
--text-3:           #52525B
--success:          #10B981
--warning:          #F59E0B
--danger:           #EF4444
--verified:         #3B82F6
--moderator:        #A855F7
--admin:            #F59E0B
```

Light Mode:
```
--bg:               #F6F8FB
--surface:          #FFFFFF
--elevated:         #EEF2F7
--border:           #DCE3EC
--text-1:           #111827
--text-2:           #4B5563
--accent:           #0891B2
```

---

## Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ TOP NAV (56px fixed)                                               │
├──────────────┬───────────────────────────────┬─────────────────────┤
│ LEFT RAIL    │ CENTER FEED                   │ RIGHT RAIL          │
│ 240px        │ minmax(0, 1fr)                │ 320px               │
│              │                               │                     │
│ menu         │ composer + tabs + posts       │ trends + groups +   │
│              │                               │ active members +    │
│              │                               │ events              │
└──────────────┴───────────────────────────────┴─────────────────────┘
```

---

## Navbar (56px)
- fixed top, blur background, border-bottom `#2A2A2A`

Left:
- `◈ PulseHub`

Center:
- global search input

Right:
- back icon/button
- lang toggle
- theme toggle
- messages
- notifications
- profile menu

---

## Left Rail (240px)
Menu items:
- Home Feed (active)
- Explore
- Groups
- Events
- Bookmarks
- Profile

Active style:
```
background: rgba(34,211,238,0.12)
border-left: 2px solid #22D3EE
color: #22D3EE
```

---

## Center Feed

### Feed Tabs
- For You / Following / Groups
- Active tab: cyan text + bottom border

### Composer Card
- textarea ("Share an update...")
- media attach button
- audience selector
- post button

Card style:
```
bg #111111
border #2A2A2A
radius 12px
padding 14px
```

### Post Cards
Structure:
- Header: avatar, author name, role badge, timestamp, menu
- Body: content text + optional media
- Footer: reactions, comments count, save, share

Badges:
- verified: blue chip
- moderator: violet chip
- admin: amber chip

Post states:
- normal
- hidden (moderation)
- deleted placeholder

---

## Right Rail (320px)
Cards:
1. Trending Topics
2. Suggested Groups
3. Active Members
4. Upcoming Events

Each card:
```
bg #111111
border #2A2A2A
radius 10px
padding 12px
```

---

## Modal: Post Detail
- Opens on post click or comment action
- Full thread list + add comment input
- ESC closes modal
- backdrop + focus trap style behavior

---

## Interactions & States (ui-ux-pro-max)
| Element | Hover | Click | Notes |
|---|---|---|---|
| Feed tab | text accent | set active | cursor-pointer |
| Post card | border/elevated | open detail | cursor-pointer |
| Action icon | opacity shift | action event | cursor-pointer |
| Group card | border shift | join/request | cursor-pointer |
| Right-rail link | underline/opacity | navigate | cursor-pointer |

Motion:
- 150–250ms on color/opacity/shadow only
- no aggressive scaling
- supports reduced-motion

---

## Data Binding Expectations
- Feed filter tabs switch post list source
- Composer writes new post to top of feed (mock state)
- Search filters feed by author/content/tags
- Group join toggles state (`Join` → `Requested` / `Joined`)
- Modal renders selected post + comments from mapped data

---

## Responsive Rules
- 1440: 3-column layout
- 1024: right rail stacks below feed
- 768: left rail collapses to icon rail / top menu
- 375: single-column flow, sticky top nav, no overflow

---

## Pre-delivery Checklist
- [ ] No marketing hero or decorative fluff
- [ ] Feed is first-screen primary experience
- [ ] EN/TH labels fit without overlap
- [ ] Keyboard focus visible on all actions
- [ ] Modal supports ESC close
- [ ] Empty/loading/error states included
- [ ] No horizontal scroll at 375/768/1024/1440
- [ ] Dark/Light readable with same hierarchy

