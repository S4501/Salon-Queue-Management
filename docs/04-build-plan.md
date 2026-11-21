# Step-by-Step Engineering Build Plan & Agent Execution Prompts
## Real-Time Salon Queue Management System (React + Vite + Tailwind CSS)

- **Document Version**: 1.0.0
- **Target Tech Stack**: React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Zustand (or React Context) + BroadcastChannel API.
- **Visual Foundation**: Reference template photo (`Beautyrel BEAUTY SALON`) styling with soft peach/blush canvas (`#FDF4F1`), midnight navy buttons and typography (`#12183A`), and warm terracotta coral accents (`#EE7A68`).

---

## Roadmap Overview

```
  ┌──────────────────────────────────────────────────────────────┐
  │ STEP 1: Project Scaffold, Theme Tokens, Routes & i18n        │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 2: Unified Queue Store, Smart FIFO & Seed Mock Data     │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 3: Customer Screens (Home, Remote Join, Status Tracker) │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 4: Receptionist Tablet Dashboard & Walk-In Modal        │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 5: Barber Station & TV Display (with Web Audio Chime)   │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 6: Owner Admin Console & Cross-Viewport Sync Engine     │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 7: Lifecycle Guards, Zero-Barber Fallback & 15-Pt QA    │
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │ STEP 8: Production Build, Vercel Deploy & Documentation      │
  └──────────────────────────────────────────────────────────────┘
```

---

## Step 1: Project Setup, Theme Configuration, Routing & Localization

### Goal
Initialize the Vite + React + Tailwind CSS project, configure custom visual design tokens extracted directly from the reference template photo, setup React Router for all 7 required screen routes, and implement a persistent bilingual localization engine (English & Gujarati) with a header toggle.

### Files to Create / Modify
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `src/index.css`
- `src/main.jsx`
- `src/App.jsx`
- `src/i18n/translations.js`
- `src/context/LanguageContext.jsx`
- `src/components/common/Header.jsx`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Initialize a new React 18 + Vite project named `salon-queue-system` with Tailwind CSS and Lucide React.

1. In `tailwind.config.js`, configure the exact visual design system extracted from our salon reference image:
   - Primary Navy: `#12183A`, Hover: `#1E2548`
   - Secondary Coral/Terracotta: `#EE7A68`, Hover: `#E26956`
   - Warm Canvas: `#FDF4F1`, Light Warm: `#FFF1ED`
   - Border Hairline: `#F3E8E2`
   - Status Accents: Emerald `#10B981`, Amber `#F59E0B`, Rose `#EF4444`
   - Font Family: `Plus Jakarta Sans`, `Inter`, `sans-serif`
   - Custom shadows: `card-soft`: `0 4px 20px -2px rgba(18, 24, 58, 0.06)`

2. Setup `src/i18n/translations.js` with comprehensive English and Gujarati translations covering all salon terminology:
   - Actions: Join Queue (કતારમાં જોડાઓ), Call Next (ગ્રાહકને બોલાવો), Start Service (સેવા શરૂ કરો), Complete (પૂર્ણ), Cancel (રદ કરો).
   - Statuses: Waiting (પ્રતીક્ષામાં), Approaching (તમારો વારો નજીક છે), Called (તમારો વારો આવી ગયો!), In Service (સેવા ચાલુ છે), Completed (પૂર્ણ થયેલ), On Break (બ્રેક પર).
   - Services: Classic Haircut, Beard Trim, Shave, Hair Spa, Massage, Facial, Color, Combo.

3. Create `src/context/LanguageContext.jsx` providing:
   - `language` state ('en' | 'gu', persisting in localStorage)
   - `toggleLanguage()` and translation helper `t(key)`

4. Setup React Router (`react-router-dom`) with route skeletons for the 7 required screens:
   - `/` -> Customer Home
   - `/join` -> Remote Join Queue
   - `/status/:id` -> Live Token Tracker
   - `/reception` -> Receptionist Tablet Dashboard
   - `/barber/:name` -> Barber Workstation
   - `/display` -> Waiting Area Wall TV Display
   - `/admin` -> Owner Settings & Analytics

5. Build `src/components/common/Header.jsx` displaying the stylized lotus brand logo "GlamourSync" in midnight navy, salon status indicator, and the interactive `EN | ગુજ` language toggle.
```

### Verification & Testing Criteria
- `npm run dev` starts without errors.
- Navigating between `/`, `/join`, `/status/test`, `/reception`, `/barber/sameer`, `/display`, and `/admin` renders without 404s.
- Clicking the language toggle in the header instantly switches all test text between English and Gujarati, and persists upon page refresh.
- Background color matches `#FDF4F1`, and card components display the soft hairline border `#F3E8E2`.

---

## Step 2: Shared Queue Store, State Machine & Wait Time Engine

### Goal
Implement the central reactive queue state store (using Zustand or React Context + localStorage persistence), the Smart FIFO dispatch algorithm, mathematical wait time calculation, and seed mock data with 4 barbers, 8 services, and 8 realistic tokens.

### Files to Create / Modify
- `src/types/queue.ts` (or JSDoc schema)
- `src/data/seedData.js`
- `src/utils/waitTimeCalculator.js`
- `src/store/useQueueStore.js`
- `src/utils/audioChime.js`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Implement the core queue state machine, dispatch engine, and seed data in `src/store/useQueueStore.js` and supporting utilities:

1. Create `src/data/seedData.js`:
   - 4 Barbers: Sameer Khan (Chair 1, Busy with T-101), Vikram Solanki (Chair 2, Available), Rahul Trivedi (Chair 3, On Break), Manoj Parmar (Chair 4, Busy with T-99). Include avatars, specialties, and chair numbers.
   - 8 Services: Durations from 20 to 60 mins, prices from ₹150 to ₹900 (Haircut, Beard Trim, Luxury Shave, Hair Spa, Head Massage, De-Tan Facial, Hair Color, Royal Combo) with bilingual names.
   - 8 Initial Tokens (T-101 to T-108) covering states: IN_SERVICE, CALLED, and WAITING.

2. Implement `src/utils/waitTimeCalculator.js`:
   - Formula: Wait Time = (Sum of Durations of Waiting Customers Ahead + Remaining Minutes of In-Chair Customers) / Active On-Duty Barbers ($N_{active}$).
   - If a customer requested a specific barber, calculate wait time based exclusively on that barber's queue.
   - Zero-Barber Fallback: If $N_{active} === 0$, return `{ isPaused: true, text: "Queue Paused (All Stylists on Break)" }`.

3. Implement `src/store/useQueueStore.js` with actions:
   - `joinQueue({ name, phone, serviceIds, preferredBarberId, source })`:
     - Guard: Checks if phone already exists with status in ['WAITING', 'CALLED', 'IN_SERVICE']. Blocks duplicate.
     - Generates next sequential token (e.g. T-109) and appends to end of queue.
   - `callNextCustomer(barberId)`:
     - Smart FIFO Rule: Finds oldest WAITING customer where `preferredBarberId === barberId` OR `preferredBarberId === 'ANY'`. Skips customers waiting for other barbers.
     - Updates token status to `CALLED`, sets `calledAt = Date.now()`.
   - `startService(tokenId, barberId)`: Sets status to `IN_SERVICE`, records `serviceStartedAt`.
   - `completeService(tokenId)`: Sets status to `COMPLETED`, frees barber chair to `AVAILABLE`.
   - `markNoShow(tokenId)`: Sets status to `NO_SHOW`, frees chair.
   - `reAddNoShow(tokenId)`: Generates fresh token appended strictly at tail end of queue.
   - `cancelToken(tokenId)`: Sets status to `CANCELLED`, triggers real-time queue recalculation.
   - `toggleBarberBreak(barberId)`: Flips barber status between AVAILABLE and ON_BREAK.

4. Implement `src/utils/audioChime.js`:
   - Synthesizes a soothing 2-tone melodic chime (C5: 523Hz for 250ms -> E5: 659Hz for 400ms) using the native HTML5 Web Audio API `AudioContext`.
```

### Verification & Testing Criteria
- Unit test / console test verifying:
  - Barber B calling next skips customer waiting for Barber A and correctly picks customer for Barber B or "ANY".
  - Adding a customer with duplicate active phone throws validation error.
  - Calling next when a customer is already `IN_SERVICE` in that chair is blocked.
  - Triggering `playChime()` plays an audible sound in the browser without external network requests.

---

## Step 3: Customer Mobile Experience (Screens 1, 2, 3)

### Goal
Build the 3 public customer-facing screens: the welcoming Home Landing page (`/`), the interactive Remote Join Queue form (`/join`), and the Live Dynamic Status Tracker (`/status/:id`) with full-screen "It's Your Turn!" approach modal.

### Files to Create / Modify
- `src/pages/customer/HomePage.jsx`
- `src/pages/customer/JoinQueuePage.jsx`
- `src/pages/customer/StatusTrackerPage.jsx`
- `src/components/customer/ServiceSelector.jsx`
- `src/components/customer/BarberRadioGroup.jsx`
- `src/components/customer/ApproachModal.jsx`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Build the three customer mobile screens with high-fidelity visual styling matching the reference image:

1. `HomePage.jsx` (`/`):
   - Hero banner with warm blush background (`bg-[#FDF4F1]`), lotus logo, and headline "Effortless Grooming, Zero Waiting."
   - 3-card live salon quick stats: People Waiting, Current Est. Wait, Active Stylists.
   - Primary Coral CTA: "Join Live Queue" (links to `/join`).
   - Secondary White Card CTA: "Track Existing Token" with token ID search modal.
   - Ambient notice banner if user has an active token stored in localStorage.

2. `JoinQueuePage.jsx` (`/join`):
   - Form container in elevated white card with hairline border (`border-[#F3E8E2] rounded-3xl p-6`).
   - Customer Full Name and 10-digit Phone input with real-time validation.
   - Service multi-selector: Grid of 8 service cards with checkboxes, duration badges, and INR prices. Max 3 selectable (disables 4th selection with feedback).
   - Dynamic service summary bar showing selected count, total duration, and total cost.
   - Barber preference selector: Radio cards for "Any Barber (Fastest Available)" with lightning icon, or individual stylists with photos and queue length.
   - Real-time estimated wait preview box.
   - Submit button: Executes `joinQueue`, checks duplicate phone guard, navigates to `/status/:id`.

3. `StatusTrackerPage.jsx` (`/status/:id`):
   - Displays Token ID (e.g. `T-104`), Status pill, large Position in Queue (`# 2 ahead of you`), and remaining minutes countdown.
   - Visual Progress Bar showing percentage of queue elapsed.
   - Assigned/Requested Stylist card and breakdown of selected services.
   - Approaching Turn Alert: When position drops to 1, container flashes soft coral with advice to head into the salon.
   - Full-Screen Overlay `ApproachModal.jsx`: Triggered when status is `CALLED`. Displays: "It's Your Turn! Barber Sameer is waiting at Chair # 1". Plays audio chime and device vibration (`navigator.vibrate`).
   - Self-service "Cancel My Spot" button with double-confirmation modal.
```

### Verification & Testing Criteria
- Open `/join`, select 2 services, choose "Any Barber", and click Join.
- Verify instant redirection to `/status/T-XXX`.
- Try joining again with the same phone number; verify the duplicate guard blocks it and displays the active token link.
- On the status page, test the "Cancel My Spot" modal; verify position resets and token marks as cancelled.

---

## Step 4: Receptionist Tablet Dashboard (Screen 4)

### Goal
Build the high-velocity Receptionist Dashboard (`/reception`) optimized for 10"–12" landscape tablets, featuring a 2-column layout for lobby queue monitoring and a rapid walk-in registration modal.

### Files to Create / Modify
- `src/pages/staff/ReceptionPage.jsx`
- `src/components/reception/LobbyOverviewSidebar.jsx`
- `src/components/reception/LiveQueueTable.jsx`
- `src/components/reception/WalkInModal.jsx`
- `src/components/reception/NoShowTimerBadge.jsx`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Build the Receptionist Tablet Dashboard at `/reception` optimized for landscape 1024px+ viewports:

1. Top Navigation Bar:
   - Header with "GlamourSync RECEPTION DESK", active stylists count pill, language switcher, and a prominent coral button `+ Walk-In Registration`.

2. Left Column (35% width) - `LobbyOverviewSidebar.jsx`:
   - Summary statistics: Total Waiting, Average Wait Time, Completed Today, No-Show Count.
   - Stylist Status Cards: Displays each barber's chair number, current activity (Available / Busy with Token T-XXX / On Break), and elapsed chair minutes.

3. Right Column (65% width) - `LiveQueueTable.jsx`:
   - Filter bar: `All`, `Waiting`, `Called`, `In Service`, plus individual stylist filters.
   - Actionable Queue Cards: Token #, Customer Name, Phone, Selected Services, Barber Assigned, Elapsed Waiting Time.
   - Control buttons per card:
     - `Call Next`: Manually triggers call notification.
     - `Start Service`: Moves token to IN_SERVICE.
     - `Mark No-Show`: Available for CALLED tokens; displays decreasing 10-minute countdown badge (`NoShowTimerBadge.jsx`).
     - `Cancel`: Cancels token with confirmation.
     - `Re-Add`: Displayed on No-Show tokens to re-issue fresh token at queue tail.

4. Rapid Walk-In Modal (`WalkInModal.jsx`):
   - Fast registration flow designed for < 15 seconds front-desk entry:
     - Name field (quick-fill "Walk-in Guest" button).
     - Phone field (optional).
     - One-tap service pills.
     - Preferred barber dropdown.
   - One-tap "Issue Token": Appends token to the end of the line and displays printable/viewable token card.
```

### Verification & Testing Criteria
- Open `/reception` on a wide viewport (`1024px`+).
- Click `+ Walk-In Registration`, enter a walk-in guest, and click Issue Token. Verify it immediately appears at the bottom of the right-hand queue table.
- Click `Call Next` on a waiting token; verify status transitions to `CALLED` and the 10-minute grace timer begins counting down.
- Click `Mark No-Show`; verify token is ejected from active line and can be re-added to the bottom.

---

## Step 5: Barber Station & Waiting Area TV Display (Screens 5 & 6)

### Goal
Implement the touch-friendly Barber Workstation interface (`/barber/:name`) with single-chair concurrency guards and stopwatch timer, along with the full-screen 1080p Waiting Area Wall TV Display (`/display`) with animated call flashes and Web Audio chime.

### Files to Create / Modify
- `src/pages/barber/BarberWorkstationPage.jsx`
- `src/pages/display/TvDisplayPage.jsx`
- `src/components/barber/ActiveChairCard.jsx`
- `src/components/barber/NextCustomerCard.jsx`
- `src/components/display/TvBarberCard.jsx`
- `src/components/display/TvUpcomingQueue.jsx`
- `src/components/display/CallAnnouncementBanner.jsx`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Build the Barber Workstation and Wall TV Display screens:

1. `BarberWorkstationPage.jsx` (`/barber/:name`):
   - Route extracts barber name/id from URL params (e.g. `/barber/sameer-khan`).
   - Header: Barber Name, Chair Number, and `Available / On Break` toggle switch.
   - Active Chair Card (`ActiveChairCard.jsx`):
     - Displays customer currently in chair, services being performed, and a live ticking stopwatch timer.
     - Button: `Complete Service (સેવા પૂર્ણ)`. Transitions token to COMPLETED and clears chair.
   - Next Customer Card (`NextCustomerCard.jsx`):
     - Uses Smart FIFO algorithm to identify the next eligible customer waiting for this barber or "ANY".
     - Button: `Call Next Customer (ગ્રાહકને બોલાવો)`.
     - Concurrency Guard: Button is disabled with an amber warning if the chair currently has an active service in progress.
   - Upcoming Queue Preview: Mini list of customers in line specifically for this barber.

2. `TvDisplayPage.jsx` (`/display`):
   - 1080p landscape non-scrolling full-screen layout designed for wall-mounted TV.
   - Header: Salon branding, live digital clock (HH:MM:SS AM/PM), and rolling announcement ticker in English & Gujarati.
   - Main Grid (Left 60%): 4 large Barber Station Cards (`TvBarberCard.jsx`) showing Chair Number, Barber Photo, Name, Status (AVAILABLE / BUSY / ON BREAK), and current Token ID.
   - Sidebar (Right 40%): `TvUpcomingQueue.jsx` displaying the next 6-8 waiting tokens with Token ID, First Name, and Estimated Wait Time, plus a "Scan QR to Join" card.
   - Real-time Audio-Visual Call Notification:
     - Whenever a token transitions to CALLED:
       - Triggers `playChime()` from `audioChime.js` (2-tone airport chime).
       - The called chair card pulses with a vibrant coral border and animated badge for 8 seconds.
       - A large banner slides down: `NOW SERVING: TOKEN T-102 (Priya S.) → CHAIR 2 (Vikram)`.
```

### Verification & Testing Criteria
- Open `/barber/vikram-solanki` in Tab 1 and `/display` in Tab 2.
- In Tab 1, click "Call Next Customer".
- Verify Tab 2 instantly highlights Chair 2 with an animated coral pulse, shows the announcement banner, and plays the melodic chime.
- In Tab 1, click "Start Service". Verify the stopwatch starts counting and "Call Next" is disabled.
- Click "Complete Service". Verify chair is released and "Call Next" unlocks.

---

## Step 6: Owner Admin Console & Cross-Viewport Sync Engine

### Goal
Implement the Owner Admin Dashboard (`/admin`) for business controls (master queue pause, 30-min auto-cutoff, service catalog CRUD, barber roster management, and daily analytics) and connect a cross-tab synchronization mechanism (BroadcastChannel API + localStorage events).

### Files to Create / Modify
- `src/pages/admin/AdminPage.jsx`
- `src/components/admin/MasterQueueControls.jsx`
- `src/components/admin/ServiceCatalogManager.jsx`
- `src/components/admin/BarberRosterManager.jsx`
- `src/components/admin/DailyAnalyticsCards.jsx`
- `src/utils/syncBroadcast.js`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Build the Owner Admin Console and the Cross-Viewport Real-Time Sync Engine:

1. Cross-Tab Sync Engine (`src/utils/syncBroadcast.js`):
   - Initialize a `BroadcastChannel('glamour_sync_channel')`.
   - Whenever any tab executes a queue state mutation (join, call, start, complete, cancel, break), broadcast a message `{ type: 'QUEUE_UPDATED', timestamp: Date.now() }`.
   - All open tabs listen on the channel and immediately refresh their reactive store state.
   - Fallback: Listen to the `window.addEventListener('storage')` event for cross-browser compatibility.

2. `AdminPage.jsx` (`/admin`):
   - Navigation drawer: Overview, Services Menu, Barber Roster, Daily Reports.
   - Master Queue Switch (`MasterQueueControls.jsx`):
     - Master Toggle: "Queue Open & Accepting Joins" vs "Queue Paused (Emergency Stop)".
     - 30-Minute Auto-Cutoff Toggle: When enabled, prevents joins within 30 minutes of salon closing time (e.g. 8:30 PM).
   - Daily Analytics Cards (`DailyAnalyticsCards.jsx`):
     - Total Customers Served, Average Wait Time, No-Show Rate, Estimated Daily Revenue (₹ sum of completed services).
   - Service Catalog Manager (`ServiceCatalogManager.jsx`):
     - Table of all 8 services with edit duration, edit price in INR, and toggle active/inactive.
     - "Add New Service" modal.
   - Barber Roster Manager (`BarberRosterManager.jsx`):
     - List of barbers with chair re-assignment, edit specialty, and toggle on-duty status.
```

### Verification & Testing Criteria
- Open `/admin` in one browser window and `/` in another.
- Toggle the "Master Queue Switch" to Paused in Admin.
- Verify the Home page in the other window instantly changes its CTA to "Queue Currently Paused" without manual reload.
- Add/Edit a service price in Admin; verify the updated price appears immediately on `/join`.

---

## Step 7: Edge Cases, Lifecycle Guards & 15-Point QA Verification

### Goal
Implement bulletproof edge-case protections, verify the Zero-Barber fallback behavior, perform a complete Gujarati translation audit, and execute the 15-point verification test checklist.

### Files to Create / Modify
- `src/components/common/ZeroBarberNotice.jsx`
- `src/components/common/ErrorBoundary.jsx`
- `src/i18n/translations.js` (Audit and completion)
- `tests/e2eChecklist.md`

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Fortify the application with edge-case guards, finalize Gujarati translations, and audit against the 15-point test checklist:

1. Zero-Barber Fallback Guard:
   - If all barbers are set to `ON_BREAK` or inactive:
     - Replace numerical wait time estimates on customer tracker and TV display with:
       - EN: "Queue Paused (All Stylists on Break)"
       - GU: "કતાર થોભાવેલ છે (તમામ કારીગરો બ્રેક પર છે)"
     - Render ambient warning banner `ZeroBarberNotice.jsx` across `/` and `/join`.
     - Prevent division-by-zero math errors in `waitTimeCalculator.js`.

2. Gujarati Translation Audit:
   - Ensure 100% string coverage in `src/i18n/translations.js` for all buttons, input placeholders, modal dialogs, and error messages.
   - Verify Gujarati typography rendering across mobile and desktop.

3. 10-Minute No-Show Expiration Guard:
   - Ensure the countdown timer on CALLED tokens accurately calculates elapsed minutes from `calledAt`.
   - When the timer reaches 00:00, highlight the card in red with a prompt "Grace Period Expired - Mark No-Show".

4. Run and verify all 15 test cases from `docs/03-flows-rules.md`:
   - Duplicate phone prevention
   - Max 3 services restriction
   - Smart FIFO barber preference matching
   - Concurrency lock on barber workstation
   - Multi-tab synchronization under 1 second
```

### Verification & Testing Criteria
- Put all 4 barbers on break; verify tracker shows "Queue Paused" without crashing.
- Test joining with 4 services selected; verify the 4th is blocked.
- Verify that every button and text element displays appropriate Gujarati script when `GU` is selected.

---

## Step 8: Production Build, Deployment & Documentation

### Goal
Configure production build optimizations, setup clean Vercel/Netlify SPA rewrites, generate project README with architecture diagrams, and verify zero console errors or warnings.

### Files to Create / Modify
- `vercel.json`
- `README.md`
- `vite.config.js` (chunk splitting and build optimizations)

### Exact Copy-Paste Prompt for Coding Agent

```markdown
Finalize the project for production deployment:

1. Create `vercel.json` for single-page application routing rewrite:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Optimize `vite.config.js` for production bundle splitting (separate vendor chunks for Lucide and React).

3. Create comprehensive `README.md`:
   - Project overview, visual styling rationale based on the template photo.
   - Quick Start instructions (`npm install`, `npm run dev`, `npm run build`).
   - Route directory table with target users.
   - Explanation of Smart FIFO dispatch and wait time math.
   - Instructions for running multi-device demo (e.g. opening Customer on phone, Barber on tablet, TV on external screen).

4. Run `npm run build` to verify clean compilation with zero linting or TypeScript errors.
```

### Verification & Testing Criteria
- `npm run build` produces a production `dist/` bundle under 350KB gzip.
- `npx serve dist` allows opening any deep route (e.g. `/status/T-102` or `/barber/sameer-khan`) directly with proper page rendering.
- All documentation in `/docs` is complete and cross-referenced.
