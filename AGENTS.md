# AGENTS.md — Agent & Developer Operational Manual
## Make Over Unisex Salon (GlamourSync Real-Time Queue Management System)

> **Document Purpose**: This file serves as the definitive architecture reference, engineering guide, and operational instructions for AI agents and human engineers contributing to the **Make Over Unisex Salon** queue management system.

---

## 1. Project Overview & Core Mission

**Make Over Unisex Salon** (codebase: *GlamourSync*) is a real-time queue orchestration and salon floor management web application engineered for modern unisex salons, luxury ateliers, and beauty studios. It bridges physical salon operations with remote customer devices without requiring SMS gateways or complex server infrastructure.

- **Primary URL Structure**: Single Page Application (SPA) with client-side routing.
- **Hosting Environment**: Optimized for Vercel, Netlify, or any static cloud hosting.
- **Key Tenets**:
  - Zero SMS fees (bookmarkable web tokens: `/status/:id`).
  - High-end Haute Couture / MÈCHE luxury editorial visual design.
  - Sub-second local state synchronization via `BroadcastChannel` and local storage.
  - Complete English and Gujarati bilingual parity (242 dictionary keys).
  - Deterministic Smart FIFO routing with barber affinity.

---

## 2. Repository Structure

```
salon-queue/
├── AGENTS.md                   # This instruction and architecture document
├── docs/                       # Comprehensive specifications
│   ├── 01-brief.md             # Product Requirements Document & Project Brief
│   ├── 02-screens.md           # Detailed UI/UX screen specifications
│   ├── 03-flows-rules.md       # Queue algorithms, guards & state transition rules
│   └── 04-build-plan.md        # Technical execution plan & checklist
├── public/                     # Static assets & optimized images
│   ├── images/
│   │   ├── artists/            # Stylist headshots (Chris McMillan, Jen Atkin, Rita Hazan, Christopher Pierce)
│   │   └── atelier/            # Visit The Atelier showcase imagery
│   ├── lotus.svg               # Brand favicon
│   └── sounds/                 # Audio chime alert presets (Atelier, Celestial, Marimba, Zen Gong)
├── src/
│   ├── components/             # Reusable modular UI components
│   │   ├── admin/              # MasterQueueControls, BarberRosterManager, ServiceCatalogManager, Analytics
│   │   ├── barber/             # ActiveChairCard, NextCustomerCard
│   │   ├── common/             # Header, ZeroBarberNotice, ErrorBoundary
│   │   ├── customer/           # BarberRadioGroup, ServiceSelector, ApproachModal
│   │   ├── display/            # CallAnnouncementBanner, TvBarberCard, TvUpcomingQueue, TvAudioSettingsModal
│   │   └── reception/          # LiveQueueTable, LobbyOverviewSidebar, WalkInModal, NoShowTimerBadge
│   ├── context/
│   │   └── LanguageContext.jsx # Bilingual state provider (English <-> Gujarati)
│   ├── data/
│   │   └── seedData.js         # Production seed data (barbers, services, sample tokens)
│   ├── i18n/
│   │   └── translations.js     # 242-key bilingual dictionary (EN & GU)
│   ├── pages/                  # Route views
│   │   ├── admin/AdminPage.jsx                      # Owner Console (`/admin`)
│   │   ├── barber/BarberWorkstationPage.jsx         # Stylist Dashboard (`/barber/:name`)
│   │   ├── customer/HomePage.jsx                    # Editorial Landing Page (`/`)
│   │   ├── customer/JoinQueuePage.jsx               # Remote Queue Join (`/join`)
│   │   ├── customer/StatusTrackerPage.jsx           # Live Token Tracking (`/status/:id`)
│   │   ├── display/TvDisplayPage.jsx                # 1080p Wall TV Screen (`/display`)
│   │   └── staff/ReceptionPage.jsx                  # Receptionist Desk (`/reception`)
│   ├── store/
│   │   └── useQueueStore.js    # Central Zustand reactive state, localStorage persistence & broadcast
│   ├── utils/
│   │   ├── audioChime.js       # Web Audio API sound synthesis & TTS voice announcements
│   │   ├── syncBroadcast.js    # Cross-tab real-time event broadcaster
│   │   └── waitTimeCalculator.js # Mathematical wait time formula
│   ├── App.jsx                 # Routes & layout shell
│   ├── index.css               # Tailwind CSS & typography utilities
│   └── main.jsx                # React root mount
├── test/
│   └── rules.test.js           # 12 automated verification integration test suites
├── index.html                  # HTML5 entry shell & Google Fonts imports
├── package.json                # Project scripts & dependencies
└── vite.config.js              # Vite build configuration
```

---

## 3. Technology Stack & Dependencies

- **Framework**: React 18 (`react`, `react-dom`)
- **Routing**: React Router DOM 6 (`react-router-dom`)
- **Build Tool**: Vite 5 (`vite`, `@vitejs/plugin-react`)
- **State Management**: Zustand 4 (`zustand`)
- **Styling**: Tailwind CSS 3 (`tailwindcss`, `postcss`, `autoprefixer`)
- **Icons**: Lucide React (`lucide-react`)
- **Audio & Speech**: HTML5 Web Audio API synthesizer + Web Speech API (`speechSynthesis`)
- **Testing**: Node.js built-in assertion runner (`node test/rules.test.js`)

---

## 4. Key Business Rules & Queue Algorithms

Agents must adhere strictly to these operational rules when modifying logic:

### 4.1 Smart FIFO with Barber Affinity
1. If a patron selects a **Specific Stylist** (e.g. `barber-1`), only that stylist may call them, or the receptionist can manually reassign them.
2. If a patron selects **"Any Stylist (First Available)"**, they are automatically eligible for the next free station chair that completes its service.
3. Stylists calling "Next" always prioritize:
   - Specific requests for their chair in strict chronological (FIFO) order.
   - If no specific requests exist, the earliest waiting patron with `"ANY"` preference is chosen.

### 4.2 Concurrency & Chair Protection
- **Strict Single-Customer Guard**: At no point may a chair serve more than one customer simultaneously.
- A stylist must mark their current patron as **Completed** (`IN_SERVICE` -> `COMPLETED`) before calling the next token.

### 4.3 Zero-Barber Break Fallback Guard
- When all stylists are on scheduled breaks (`status === 'ON_BREAK'`), mathematical division-by-zero is prevented.
- The UI displays the `ZeroBarberNotice` banner, wait time displays `"--"`, and remote joins are gracefully queued.

### 4.4 Dynamic Wait Time Formula
Estimated wait time for patron `T` is computed mathematically:
$$\text{Wait Time} = \frac{\sum \text{Durations of Preceding Eligible Patrons}}{\text{Active Available Stylists}}$$
- If a client arrives when an eligible chair is open (`AVAILABLE` with no ongoing service), wait time is immediately `0 mins` (**"Ready Now"**).

### 4.5 Active Duplicate Phone Number Guard
- A mobile phone number may only hold **one active token** at a time (`WAITING`, `APPROACHING`, `CALLED`, `IN_SERVICE`).
- If an existing active token is detected, the submission is rejected with a link to resume tracking their existing ticket.

### 4.6 10-Minute No-Show Grace Period & Tail Insertion
- When a called customer fails to arrive within the 10-minute grace period, reception can flag them as `NO_SHOW`.
- If the customer subsequently arrives, clicking "Re-add to Queue" strictly inserts them at the **tail** (end) of the current queue with a fresh sequential token ID.

### 4.7 30-Minute Auto-Cutoff Rule
- The salon automatically halts new queue registrations 30 minutes prior to closing time or when backlog duration exceeds operating hours, displaying the `queuePausedNotice`.

---

## 5. Bilingual Localization Guidelines

The application maintains a synchronized dictionary in [`src/i18n/translations.js`](file:///c:/Users/siyag/OneDrive/Desktop/salon-queue-system/src/i18n/translations.js).

- Every key in `translations.en` **must exist** in `translations.gu`.
- Never hardcode user-facing strings; always consume via `t('keyName')` from `useLanguage()`.
- Run `node test/rules.test.js` (Test 1) to verify dictionary parity across all 242 keys.

---

## 6. Verification & Build Commands

Always run the test suite and verify the production build before finishing any task:

```bash
# 1. Run all 12 integration and rule test suites
node test/rules.test.js

# 2. Compile production bundle
npm run build
```

> [!IMPORTANT]
> **Git Commit Policy**: Never run `git commit` or `git push` autonomously unless explicitly instructed by the user. Keep working tree modifications staged or uncommitted until authorized.
