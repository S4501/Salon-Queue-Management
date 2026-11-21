# UI/UX Screen Specifications & Visual Design System
## Real-Time Salon Queue Management System

- **Document Version**: 1.0.0
- **Design Philosophy**: Warm Organic Wellness & High-Precision Floor Orchestration
- **Visual Aesthetic Source**: Extracted directly from luxury salon reference template (`Beautyrel`)
- **Key Design Attributes**: Soft warm blush/peach canvas, crisp white elevation cards, authoritative midnight navy typography and buttons, vibrant coral-terracotta action accents, and delicate hairline borders.

---

## 1. Visual Design System & Theme Specification

The visual language is extracted directly from the attached reference template photo (`Beautyrel BEAUTY SALON`), creating an elevated, tranquil, and luxurious salon environment while maintaining high-contrast clarity for fast operational decisions.

```
       [ Warm Canvas: #FDF4F1 / #FFF1ED ]
  ┌───────────────────────────────────────────────┐
  │  [ Pure White Card #FFFFFF / rounded-2xl ]    │
  │                                               │
  │   Midnight Navy #12183A (Headings & Buttons)  │
  │   Terracotta Coral #EE7A68 (Accents & CTAs)   │
  │   Subtle Hairline Borders #F3E8E2             │
  │   Soft Diffused Drop Shadows                  │
  └───────────────────────────────────────────────┘
```

### 1.1 Exact Color Palette Tokens

| Token Name | Hex Code | Tailwind Equivalent / Utility | Application in Interface |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | `#12183A` | `bg-[#12183A]`, `text-[#12183A]` | Primary headings, brand wordmark, primary action buttons, high-contrast badges. |
| **Primary Navy Hover** | `#1E2548` | `hover:bg-[#1E2548]` | Hover state for primary buttons. |
| **Secondary Coral/Peach** | `#EE7A68` | `bg-[#EE7A68]`, `text-[#EE7A68]` | Highlight CTAs, active tab indicators, "It's Your Turn!" alerts, live progress bars. |
| **Coral Accent Hover** | `#E26956` | `hover:bg-[#E26956]` | Hover state for coral CTA buttons. |
| **Warm Canvas (Blush)** | `#FDF4F1` | `bg-[#FDF4F1]` | Global background canvas for customer mobile screens and TV display backdrop. |
| **Warm Canvas Light** | `#FFF1ED` | `bg-[#FFF1ED]` | Light tinted container background, approach alert hero card. |
| **Surface Pure White** | `#FFFFFF` | `bg-white` | Elevated surface cards, modals, table rows, form input fields. |
| **Border Hairline Soft** | `#F3E8E2` | `border-[#F3E8E2]` | Card borders, input container borders, subtle dividers. |
| **Border Slate Neutral** | `#E2E8F0` | `border-slate-200` | Secondary borders, table column headers. |
| **Text Charcoal Dark** | `#12183A` | `text-[#12183A]` | Main headings, token numbers, primary titles. |
| **Text Slate Muted** | `#595F72` | `text-[#595F72]` | Subtitles, body descriptions, service durations, timestamps. |
| **Text Subtle Gray** | `#94A3B8` | `text-slate-400` | Placeholders, inactive captions, table footers. |
| **Status: Available / Ready** | `#10B981` | `bg-emerald-500`, `text-emerald-700`, `bg-emerald-50` | Stylist "Available" badge, completed checkmarks. |
| **Status: Busy / In Chair** | `#F59E0B` | `bg-amber-500`, `text-amber-700`, `bg-amber-50` | Active chair indicator, in-progress countdown. |
| **Status: Calling / Approaching**| `#EE7A68` | `bg-[#EE7A68]`, `text-[#EE7A68]`, `bg-rose-50` | Flash notifications, token called alert. |
| **Status: On Break / Offline** | `#EF4444` | `bg-rose-500`, `text-rose-700`, `bg-rose-50` | Stylist "On Break" badge, queue paused warning. |

### 1.2 Typography Hierarchy

- **Primary Heading Font**: `Plus Jakarta Sans`, sans-serif (Geometric humanist sans offering warmth and modern elegance).
- **Body & Numerical Font**: `Inter`, sans-serif (Tabular numbers for precise timers, token badges, and data tables).
- **Gujarati Typography Support**: Universal native fallback `system-ui`, `Shruti`, `Gujarati Sangam MN`, `Noto Sans Gujarati`.

| Level | Size (px / rem) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1 (TV / Hero)** | 48px / 3.0rem | Bold (700) | 1.15 | -0.02em | TV Display Token Calling, Hero headlines |
| **Heading 1 (H1)** | 32px / 2.0rem | Bold (700) | 1.25 | -0.015em | Screen titles, Status tracker primary token |
| **Heading 2 (H2)** | 24px / 1.5rem | SemiBold (600) | 1.3 | -0.01em | Card section headers, Modal titles |
| **Heading 3 (H3)** | 18px / 1.125rem | SemiBold (600) | 1.4 | 0 | Barber station names, Service titles |
| **Body Large** | 16px / 1.0rem | Regular (400) / Med (500) | 1.5 | 0 | Lead paragraphs, input field labels |
| **Body Regular** | 14px / 0.875rem | Regular (400) | 1.5 | 0 | Queue row metadata, instructions |
| **Caption / Small** | 12px / 0.75rem | Medium (500) | 1.4 | +0.02em | Timestamps, status pills, table headers |
| **Token Monospace** | 28px / 1.75rem | Bold (800) | 1.0 | +0.05em | Token IDs (`T-104`, `T-105`) |

### 1.3 Component Styling & Design Tokens

- **Border Radii**:
  - Container & Canvas Cards: `rounded-2xl` (16px) or `rounded-3xl` (24px).
  - Form Fields & Buttons: `rounded-xl` (12px).
  - Chips, Tags & Status Pills: `rounded-full` (9999px).
- **Borders & Dividers**:
  - Cards: `border border-[#F3E8E2]` (Hairline warm border).
  - Form Inputs: `border border-[#F3E8E2] focus:border-[#EE7A68] focus:ring-2 focus:ring-[#EE7A68]/20 outline-none`.
- **Elevation & Shadow System**:
  - `shadow-sm`: `0 1px 2px 0 rgba(18, 24, 58, 0.04)` (List items, filter chips).
  - `shadow-md`: `0 4px 20px -2px rgba(18, 24, 58, 0.06)` (Cards, form surfaces).
  - `shadow-xl`: `0 12px 36px -4px rgba(18, 24, 58, 0.10)` (Modals, alert banners, floating headers).
- **Button Anatomy**:
  - **Primary Navy**: `bg-[#12183A] text-white hover:bg-[#1E2548] active:scale-[0.98] transition-all duration-200 rounded-xl px-6 py-3 font-semibold shadow-sm`.
  - **Accent Coral**: `bg-[#EE7A68] text-white hover:bg-[#E26956] shadow-md shadow-[#EE7A68]/25 active:scale-[0.98] transition-all rounded-xl px-6 py-3 font-semibold`.
  - **White Card Button**: `bg-white text-[#12183A] border border-[#F3E8E2] hover:bg-slate-50 shadow-sm active:scale-[0.98] transition-all rounded-xl px-5 py-2.5 font-medium`.
  - **Ghost / Destructive**: `text-rose-600 hover:bg-rose-50 active:scale-[0.98] rounded-xl px-4 py-2 text-sm font-medium transition-all`.

---

## 2. Comprehensive Specifications for the 7 Required Screens

---

### Screen 1: Customer Mobile Home (`/`)

#### Layout & Hierarchy
- **Target Device**: Mobile-first portrait (`375px` to `430px`), responsive up to desktop.
- **Background**: Soft warm blush canvas (`bg-[#FDF4F1]`).
- **Structure**:
  1. **Top Navigation Bar**: Floating rounded header (`bg-white/90 backdrop-blur-md rounded-2xl mx-4 mt-3 px-4 py-3 border border-[#F3E8E2] shadow-sm flex items-center justify-between`).
     - Left: Stylized Lotus Icon in coral tone + Brand wordmark "GlamourSync" in midnight navy (`#12183A`).
     - Right: Bilingual Toggle Button (`EN | ગુજ`) with active pill indicator.
  2. **Hero Status Banner**:
     - Visual badge: Green pulsing dot with text "Salon is Open & Accepting Queue".
     - Main Headline: "Effortless Grooming, Zero Waiting."
     - Subtitle: "Join our live queue remotely. Arrive just in time for your chair."
  3. **Live Salon Quick-Stats Cards (3-Column Grid)**:
     - Card 1: `Currently Waiting` (e.g., `4 People`).
     - Card 2: `Est. Wait Time` (e.g., `~25 Mins`).
     - Card 3: `Active Stylists` (e.g., `3 On Duty`).
  4. **Primary Action Center**:
     - Large Accent Coral CTA: `Join Live Queue` (links to `/join`).
     - Secondary White Button: `Track Existing Token` (opens modal or links to `/status/:id`).
  5. **Quick Directory & Opening Hours**:
     - Salon Address: "102, Heritage Plaza, Ring Road, Ahmedabad, Gujarat 380015".
     - Phone: "+91 98765 43210".
     - Working Hours: "Tuesday – Sunday: 9:00 AM – 9:00 PM (Monday Closed)".
  6. **Staff & Admin Shortcut**: Subtle footer link: "Staff & Management Portal →" (links to `/reception`).

#### Component Breakdown & State Handling
- **Master Queue Closed State**: If the Salon Owner pauses the queue from `/admin`, the coral "Join Live Queue" button turns into a disabled slate button with label "Queue Currently Paused / સંપૂર્ણ કતાર થોભાવેલ છે", and a warning alert explains that no new entries are being accepted.
- **Existing Token Detection**: If customer has previously joined in the current browser session, an ambient alert banner sits at the top: "You have an active queue ticket (T-103). [View Live Status →]".

---

### Screen 2: Remote Join Queue (`/join`)

#### Layout & Hierarchy
- **Target Device**: Mobile portrait (`375px`–`480px`).
- **Container**: Elevated white card (`bg-white rounded-3xl p-6 border border-[#F3E8E2] shadow-md mx-4 my-4`).
- **Step-by-Step Single Form Layout**:

```
┌────────────────────────────────────────────────────────┐
│  ← Back to Home                      [ EN | ગુજ ]      │
│  Join Salon Queue / કતારમાં જોડાઓ                      │
│                                                        │
│  1. Your Details                                       │
│  [ Full Name: Aarav Patel                     ]        │
│  [ Mobile: +91 98250 12345                    ]        │
│                                                        │
│  2. Select Services (Max 3)                            │
│  ┌─────────────────────────┐  ┌─────────────────────┐  │
│  │ ✓ Classic Haircut       │  │ Beard Styling       │  │
│  │   30 mins • ₹250        │  │ 20 mins • ₹150      │  │
│  └─────────────────────────┘  └─────────────────────┘  │
│  Total: 1 Service | 30 mins | ₹250                     │
│                                                        │
│  3. Preferred Stylist                                  │
│  (●) Any Barber (Fastest)                              │
│  ( ) Sameer Khan (Busy - 2 ahead)                      │
│  ( ) Vikram Solanki (Available)                        │
│                                                        │
│  [ Est. Wait: ~15 mins ]                               │
│  [       Confirm & Join Queue (કતારમાં જોડાઓ)         ]│
└────────────────────────────────────────────────────────┘
```

#### Field Specifications & Validation Rules
1. **Full Name**:
   - Type: Text, required, min 3 characters, max 40 characters.
   - Validation: Trimmed, alphabets and spaces only.
2. **Mobile Number**:
   - Type: Tel, required, exactly 10 digits (`^[6-9]\d{9}$`).
   - Duplicate Phone Guard: Verified against all active tokens (`WAITING`, `CALLED`, `IN_SERVICE`). If duplicate detected, an inline alert triggers: *"An active queue token (T-102) is already registered with this phone number. [Click here to view your live token]."*
3. **Service Selection (Multi-select, Max 3)**:
   - Interactive checkbox cards displaying Service Name (EN + GU), Duration (minutes), and Price (INR).
   - Selection Counter: `Selected: 2/3`. When 3 are selected, other cards become disabled with a tooltip *"Maximum 3 services per check-in"*.
   - Dynamic Summary Strip: Automatically sums up Total Duration (e.g. 50 mins) and Total Estimated Cost (e.g. ₹550).
4. **Barber Preference Selection**:
   - Radio card group.
   - Option A (Default): **Any Barber (Fastest Available) / કોઈ પણ ઉપલબ્ધ કારીગર**. Includes lightning icon and label *"Recommended for minimum wait time"*.
   - Option B..E: Specific Barbers with thumbnail avatar, specialty tag, and live queue count (e.g. *"Sameer Khan - 2 ahead (~35m)"*).
5. **Real-time Estimated Wait Preview**:
   - Dynamic box updating instantly whenever services or barber preference changes.

#### Button States
- **Default**: Navy or Coral button with label "Confirm & Join Queue".
- **Disabled**: Greyed out if Name is empty, phone is not 10 digits, or 0 services selected.
- **Loading**: Spinner icon with label "Securing your spot...".

---

### Screen 3: Live My Status Tracker (`/status/:id`)

#### Layout & Hierarchy
- **Target Device**: Mobile portrait (`375px`–`480px`).
- **Container**: Full-height responsive layout with persistent header and dynamic background tinting according to queue state.

```
┌────────────────────────────────────────────────────────┐
│  GlamourSync                           [ EN | ગુજ ]    │
│  Token Tracker / ટોકન સ્થિતિ                           │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Token ID: T-104               Status: IN QUEUE   │
│  │                                                  │
│  │             YOUR QUEUE POSITION                  │
│  │                     # 2                          │
│  │                2 people ahead                    │
│  │                                                  │
│  │  Est. Wait Time: ~18 mins                        │
│  │  [==========================........] 65%        │
│  │                                                  │
│  │  Assigned Stylist: Any Barber (Fastest)          │
│  │  Services: Haircut + Beard Trim (45m)            │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [ i ] Please arrive at the salon when 1 person is     │
│        ahead of you to ensure you don't lose your spot.│
│                                                        │
│  [ Share Token Link ]        [ Cancel My Spot ]        │
└────────────────────────────────────────────────────────┘
```

#### Dynamic Status Stages & Visual Cues
1. **`WAITING` (Normal Waiting)**:
   - Header badge: Soft Slate/Navy.
   - Large Position Number: `# 3`, `# 2`.
   - Dynamic Progress Bar: Computes progress based on initial position versus current position.
2. **`APPROACHING` (1 Person Ahead)**:
   - Accent Card Color: Turns soft coral `#FFF1ED` with vibrant border `#EE7A68`.
   - Alert Pill: "You are next in line! Please be present in the salon lobby."
   - Sound Alert: Plays single soft notification chime; triggers gentle vibration (`navigator.vibrate(200)`).
3. **`CALLED` (Stylist is Ready for You)**:
   - Full-Screen Overlay Modal: High-impact modal slides up with coral accent background.
   - Message: **"It's Your Turn! Sameer Khan is waiting for you at Chair # 2."**
   - Audio Chime: Continuous melodic Web Audio ping until customer taps "I'm Here / Arrived".
   - 10-Minute Grace Period Timer: Visual countdown clock showing time remaining before forfeiture (`09:59` counting down).
4. **`IN_SERVICE` (In Chair)**:
   - Badge turns Amber: "Service in Progress / સેવા ચાલુ છે".
   - Displays real-time elapsed timer stopwatch since service began.
5. **`COMPLETED`**:
   - Celebratory checkmark banner: "Service Finished. Thank you for visiting GlamourSync!"
   - Displays receipt summary (Services received, Total bill amount in ₹).

#### Self-Service Cancellation Dialogue
- Triggered by clicking "Cancel My Spot".
- Modal requires explicit confirmation: *"Are you sure you want to cancel your queue token T-104? You will lose your current spot in line."*
- Actions: `Yes, Cancel My Spot` (Destructive Red) vs `Keep My Spot` (Navy).
- On confirmation: Token transitions to `CANCELLED`, queue recalculates dynamically, and user is redirected to `/` with feedback toast.

---

### Screen 4: Receptionist Tablet Dashboard (`/reception`)

#### Layout & Hierarchy
- **Target Device**: 10"–12" Tablet in landscape mode (`1024px`–`1280px`), responsive on desktop.
- **2-Column Split Structure**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  GlamourSync RECEPTION DESK     [+ Walk-In Registration]   [Active Barbers: 3/4] [ EN | ગુજ ]│
├──────────────────────────────────────┬───────────────────────────────────────────────────────┤
│  LOBBY OVERVIEW (Left 35%)           │  LIVE QUEUE DISPATCH (Right 65%)                      │
│                                      │  Filter: [ All (5) ] [ Sameer ] [ Vikram ] [ Rahul ]  │
│  Total Waiting: 5 Customers          │                                                       │
│  Avg Wait Time: 22 Mins              │  [ T-101 ] Ramesh Patel         Wait: 18m  [Called]   │
│  Today's Completed: 28               │    Services: Classic Haircut (30m) • Stylist: Vikram  │
│  Active Barbers:                     │    Actions: [ Start Service ]  [ No-Show ]  [ Cancel ]│
│  ┌────────────────────────────────┐  │                                                       │
│  │ Sameer Khan (Chair 1)          │  │  [ T-102 ] Priya Shah           Wait: 12m  [Waiting]  │
│  │ Status: Busy (T-99, 14m left)  │  │    Services: Hair Spa + Blowdry • Stylist: Any        │
│  ├────────────────────────────────┤  │    Actions: [ Call Next ]  [ Reorder ]  [ Cancel ]    │
│  │ Vikram Solanki (Chair 2)       │  │                                                       │
│  │ Status: Available (Ready)      │  │  [ T-103 ] Devendra Dave        Wait: 5m   [Waiting]  │
│  ├────────────────────────────────┤  │    Services: Shave • Stylist: Sameer                  │
│  │ Rahul Trivedi (Chair 3)        │  │    Actions: [ Call Next ]  [ Reorder ]  [ Cancel ]    │
│  │ Status: On Break (10m left)    │  │                                                       │
│  └────────────────────────────────┘  │  [ T-104 ] Harshil Joshi        Wait: 2m   [Waiting]  │
└──────────────────────────────────────┴───────────────────────────────────────────────────────┘
```

#### Walk-In Customer Modal
- Opened via the prominent coral button `+ Walk-In Registration` in the header.
- Rapid input fields:
  - Phone Number (optional for walk-ins if customer prefers not to give, defaults to "Walk-in").
  - Customer Name (e.g. "Walk-in Guest 1" or real name).
  - Quick-tap Service buttons (Instant pill selection).
  - Stylist selection dropdown.
- One-click `Issue Token & Append to Queue`:
  - Token is generated with the next sequential ID.
  - Appended strictly to the tail end of the FIFO queue.
  - Generates printable/displayable token slip preview.

#### Reception Operational Controls
1. **Manual Call**: Receptionist can override or assist barber by calling the next customer.
2. **Mark No-Show**: If customer fails to appear within 10 minutes of being called, clicking `Mark No-Show` ejects the customer to `NO_SHOW` state, freeing the barber.
3. **Re-add to Bottom of Queue**: If a no-show customer subsequently arrives, receptionist can click `Re-Add Customer`, which generates a brand-new token and appends them to the end of the line.
4. **Filter Bar**: Quick toggle buttons filter the queue view by Stylist or Queue Status (`Waiting`, `Called`, `In Service`).

---

### Screen 5: Barber Workstation View (`/barber/:name`)

#### Layout & Hierarchy
- **Target Device**: Dedicated Smartphone or 8" Tablet mounted on the barber station mirror (`375px` to `768px`).
- **Focus**: High legibility from 1 meter away, oversized touch targets for wet/gloved fingers.

```
┌────────────────────────────────────────────────────────┐
│  Chair # 1 • Sameer Khan              [ EN | ગુજ ]     │
│  Status: [ (●) On Duty / Available ]   [ ( ) On Break ]│
├────────────────────────────────────────────────────────┤
│  CURRENT CHAIR STATUS                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ TOKEN: T-101        Ramesh Patel                 │  │
│  │ SERVICES: Classic Haircut + Beard Sculpt         │  │
│  │ ELAPSED TIME:                                    │  │
│  │                18:42                             │  │
│  │             [ PROGRESS: 62% ]                    │  │
│  │                                                  │  │
│  │    [ ✓ COMPLETE SERVICE (સેવા પૂર્ણ) ]           │  │
│  └──────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│  NEXT ELIGIBLE CUSTOMER (Smart FIFO)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ TOKEN: T-103        Devendra Dave                │  │
│  │ Preference: Requested Sameer Khan (Explicit)     │  │
│  │ Services: Luxury Shave (20m)                     │  │
│  │ Waiting Since: 14 mins                           │  │
│  │                                                  │  │
│  │    [ 🔔 CALL THIS CUSTOMER (ગ્રાહકને બોલાવો) ]   │  │
│  └──────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│  MY QUEUE PREVIEW (2 Customers in line for you)        │
│  • T-105: Ankit Mehta (Haircut) - Waiting 8m           │
│  • T-108: Jayesh Rawal (Color) - Waiting 2m            │
└────────────────────────────────────────────────────────┘
```

#### Workstation Controls & Concurrency Guards
1. **Single-Chair Concurrency Guard**:
   - If a customer is currently in the chair (`IN_SERVICE`), the "Call This Customer" button is **disabled and locked**.
   - The button tooltip states: *"Finish current service before calling next customer"*.
2. **Service Lifecycle Workflow**:
   - Step 1: Customer arrives at chair. Barber clicks `Start Service`.
   - Step 2: System transitions token to `IN_SERVICE`. Stopwatch timer starts ticking upward from `00:00`.
   - Step 3: When haircut is finished, barber clicks `✓ Complete Service`.
   - Step 4: Token transitions to `COMPLETED`. Chair becomes `Available`.
   - Step 5: Next eligible customer button unlocks.
3. **Break Mode Toggle**:
   - When switching to `On Break`, the barber is instantly removed from the active algorithm pool ($N_{\text{active}}$ decrements by 1).
   - "Call Next" is disabled while on break.

---

### Screen 6: Waiting Area Wall TV Display (`/display`)

#### Layout & Hierarchy
- **Target Device**: 43" to 65" Wall-Mounted Television (1080p Full HD: `1920x1080` Landscape).
- **Format**: Zero scrolling, high-contrast, optimized for reading from 15 to 25 feet away.
- **Header Strip**:
  - Left: Salon Brand Logo ("GlamourSync Luxury Salon").
  - Center: Rolling announcements ticker: *"Welcome! Please watch your token number. Download our app to track on your phone."* / *"આપનું સ્વાગત છે! કૃપા કરીને આપના ટોકન નંબર પર ધ્યાન આપો."*
  - Right: High-precision Digital Clock (`03:45:12 PM`) & Date.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  GLAMOURSYNC LUXURY SALON           [ Rolling Announcement Ticker ]             03:45 PM     │
├──────────────────────────────────────────────────────────────┬───────────────────────────────┤
│  STATION CHAIRS (NOW SERVING)                                │  UPCOMING QUEUE               │
│                                                              │                               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐    │  [ TOKEN ]  [ NAME ]  [ WAIT ]│
│  │ CHAIR 1: SAMEER KHAN    │  │ CHAIR 2: VIKRAM SOLANKI │    │  T-102      Priya S.    12m   │
│  │ [Avatar]   [ BUSY ]     │  │ [Avatar]   [ AVAILABLE ]│    │  T-103      Devendra    18m   │
│  │ TOKEN: T-101            │  │ TOKEN: ---              │    │  T-104      Harshil J.  25m   │
│  │ Ramesh Patel            │  │ Ready for Next Customer │    │  T-105      Ankit M.    32m   │
│  │ Haircut • 18m in chair  │  │                         │    │  T-106      Jayesh R.   40m   │
│  └─────────────────────────┘  └─────────────────────────┘    │  T-107      Chirag P.   48m   │
│                                                              │  T-108      Kunal B.    55m   │
│  ┌─────────────────────────┐  ┌─────────────────────────┐    │                               │
│  │ CHAIR 3: RAHUL TRIVEDI  │  │ CHAIR 4: MANOJ PARMAR   │    │  [ SCAN QR CODE TO JOIN ]     │
│  │ [Avatar]   [ ON BREAK ] │  │ [Avatar]   [ BUSY ]     │    │  ┌────────┐                   │
│  │ Resumes at: 04:00 PM    │  │ TOKEN: T-99             │    │  │ [QR]   │ Join queue from   │
│  │                         │  │ Amit Shah • 22m elapsed │    │  │  CODE  │ your phone now!   │
│  └─────────────────────────┘  └─────────────────────────┘    │  └────────┘                   │
└──────────────────────────────────────────────────────────────┴───────────────────────────────┘
```

#### Audio & Visual Call Notification Behavior
- **Trigger**: When any barber or receptionist triggers the `CALLED` state for a token.
- **Visual Alert**:
  - The corresponding Chair Card flashes in vibrant coral terracotta (`#EE7A68`) with a high-contrast pulsating border for 8 seconds.
  - A prominent overlay toast appears across the top: **"TOKEN T-102 (Priya S.) → CHAIR 2 (Vikram Solanki)"**.
- **Audible Chime**:
  - Uses the native HTML5 **Web Audio API** (Oscillator Node).
  - Synthesizes a soothing 2-tone luxury airport/salon chime (Tone 1: 523.25Hz `C5` for 250ms, Tone 2: 659.25Hz `E5` for 400ms).
  - Zero external `.mp3` dependencies; immune to broken network audio links.

---

### Screen 7: Owner Settings & Analytics (`/admin`)

#### Layout & Hierarchy
- **Target Device**: Desktop / Laptop browser (`1280px`+).
- **Structure**: Modern admin console with left navigation drawer and main content workspace.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  GlamourSync ADMIN CONSOLE              [ Salon Status: OPEN ]              [ EN | ગુજ ]     │
├───────────────┬──────────────────────────────────────────────────────────────────────────────┤
│  [=] Overview │  OPERATIONAL CONTROLS & LIVE METRICS                                         │
│               │                                                                              │
│  [+] Services │  ┌───────────────────────────────────┐  ┌──────────────────────────────────┐ │
│               │  │ MASTER QUEUE SWITCH               │  │ 30-MINUTE AUTO-CUTOFF            │ │
│  [o] Barbers  │  │ [ (●) Queue Accepting Joins ]     │  │ [ (●) Auto-close enabled ]       │ │
│               │  │ Emergency pause stops new checkins│  │ Closes queue at 08:30 PM (Close:9)│ │
│  [%] Reports  │  └───────────────────────────────────┘  └──────────────────────────────────┘ │
│               │                                                                              │
│  [*] Settings │  TODAY'S LIVE METRICS                                                        │
│               │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐│
│               │  │ Total Served  │ │ Avg Wait Time │ │ No-Show Rate  │ │ Est. Revenue      ││
│               │  │ 34 Customers  │ │ 16.4 Minutes  │ │ 2 (5.8%)      │ │ ₹ 12,450          ││
│               │  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────────┘│
│               │                                                                              │
│               │  SERVICE CATALOG MANAGEMENT                                 [ + Add Service] │
│               │  • Classic Haircut | 30 mins | ₹ 250 | [ Edit ] [ Delete ]                   │
│               │  • Beard Trim & Sculpt | 20 mins | ₹ 150 | [ Edit ] [ Delete ]               │
│               │  • Luxury Shave | 20 mins | ₹ 200 | [ Edit ] [ Delete ]                      │
│               │                                                                              │
│               │  BARBER ROSTER & CHAIR MANAGEMENT                            [ + Add Barber] │
│               │  • Sameer Khan (Chair 1) | Active | [ Edit ] [ Toggle Break ]                │
│               │  • Vikram Solanki (Chair 2) | Active | [ Edit ] [ Toggle Break ]             │
└───────────────┴──────────────────────────────────────────────────────────────────────────────┘
```

#### Administrative Capabilities
1. **Master Queue Toggle**: Instantly pauses new queue entries salon-wide. Active customers already in line remain unaffected.
2. **30-Minute Auto-Cutoff Rule**: Automatically blocks new remote and walk-in check-ins when remaining queue service minutes exceed remaining salon operating hours or within 30 minutes of closing time (e.g., 8:30 PM).
3. **Service Catalog CRUD**: Create, edit, and disable salon services with English and Gujarati titles, duration in minutes, and price in ₹ INR.
4. **Barber Roster Management**: Add new stylists, assign chair numbers, upload photo URLs, and set shift schedules.
5. **Real-time Analytics Visualizer**: Visual bar chart of hourly queue volume, stylist chair utilization percentage, and no-show metrics.

---

## 3. Production Dummy Data Sets

### 3.1 Barbers / Stylists Roster

```json
[
  {
    "id": "barber-1",
    "name": "Sameer Khan",
    "gujaratiName": "સમીર ખાન",
    "chair": 1,
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    "specialty": "Fade Specialist & Beard Styling",
    "status": "BUSY",
    "currentServiceToken": "T-101",
    "serviceStartedAt": "2026-11-20T15:30:00.000Z"
  },
  {
    "id": "barber-2",
    "name": "Vikram Solanki",
    "gujaratiName": "વિક્રમ સોલંકી",
    "chair": 2,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    "specialty": "Classic Cuts & Head Massage",
    "status": "AVAILABLE",
    "currentServiceToken": null,
    "serviceStartedAt": null
  },
  {
    "id": "barber-3",
    "name": "Rahul Trivedi",
    "gujaratiName": "રાહુલ ત્રિવેદી",
    "chair": 3,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    "specialty": "Hair Color & Texturizing",
    "status": "ON_BREAK",
    "currentServiceToken": null,
    "serviceStartedAt": null
  },
  {
    "id": "barber-4",
    "name": "Manoj Parmar",
    "gujaratiName": "મનોજ પરમાર",
    "chair": 4,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    "specialty": "Luxury Shave & Facial Grooming",
    "status": "BUSY",
    "currentServiceToken": "T-99",
    "serviceStartedAt": "2026-11-20T15:25:00.000Z"
  }
]
```

### 3.2 Salon Services Menu (8 Comprehensive Services)

| ID | Service Name (English) | Service Name (Gujarati) | Duration | Price (INR) | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `srv-1` | Classic Haircut & Styling | ક્લાસિક હેરકટ અને સ્ટાઇલિંગ | 30 Mins | ₹ 250 | Hair |
| `srv-2` | Beard Trim & Shape | દાઢી ટ્રીમ અને શેપિંગ | 20 Mins | ₹ 150 | Beard |
| `srv-3` | Luxury Hot Towel Shave | લક્ઝરી હોટ ટોવેલ શેવ | 25 Mins | ₹ 200 | Shaving |
| `srv-4` | Nourishing Hair Spa | નરિશિંગ હેર સ્પા | 45 Mins | ₹ 600 | Treatment |
| `srv-5` | Relaxing Head Massage | રિલેક્સિંગ હેડ મસાજ | 20 Mins | ₹ 200 | Massage |
| `srv-6` | De-Tan & Glow Facial | ડી-ટેન અને ગ્લો ફેશિયલ | 35 Mins | ₹ 500 | Skincare |
| `srv-7` | Premium Hair Color | પ્રીમિયમ હેર કલર | 45 Mins | ₹ 750 | Hair |
| `srv-8` | Royal Grooming Combo | રોયલ ગ્રૂમિંગ કોમ્બો | 60 Mins | ₹ 900 | Combo |

### 3.3 Active Sample Queue Tokens

```json
[
  {
    "id": "T-101",
    "customerName": "Ramesh Patel",
    "phone": "9825011111",
    "services": ["srv-1", "srv-2"],
    "totalDuration": 50,
    "totalPrice": 400,
    "preferredBarberId": "barber-1",
    "assignedBarberId": "barber-1",
    "status": "IN_SERVICE",
    "joinedAt": "2026-11-20T15:05:00.000Z",
    "calledAt": "2026-11-20T15:28:00.000Z",
    "serviceStartedAt": "2026-11-20T15:30:00.000Z",
    "source": "WALK_IN"
  },
  {
    "id": "T-102",
    "customerName": "Priya Shah",
    "phone": "9825022222",
    "services": ["srv-4", "srv-5"],
    "totalDuration": 65,
    "totalPrice": 800,
    "preferredBarberId": "ANY",
    "assignedBarberId": "barber-2",
    "status": "CALLED",
    "joinedAt": "2026-11-20T15:10:00.000Z",
    "calledAt": "2026-11-20T15:45:00.000Z",
    "serviceStartedAt": null,
    "source": "REMOTE"
  },
  {
    "id": "T-103",
    "customerName": "Devendra Dave",
    "phone": "9825033333",
    "services": ["srv-3"],
    "totalDuration": 25,
    "totalPrice": 200,
    "preferredBarberId": "barber-1",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:15:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "REMOTE"
  },
  {
    "id": "T-104",
    "customerName": "Harshil Joshi",
    "phone": "9825044444",
    "services": ["srv-1"],
    "totalDuration": 30,
    "totalPrice": 250,
    "preferredBarberId": "ANY",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:20:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "WALK_IN"
  },
  {
    "id": "T-105",
    "customerName": "Ankit Mehta",
    "phone": "9825055555",
    "services": ["srv-1", "srv-2"],
    "totalDuration": 50,
    "totalPrice": 400,
    "preferredBarberId": "barber-2",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:25:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "REMOTE"
  },
  {
    "id": "T-106",
    "customerName": "Jayesh Rawal",
    "phone": "9825066666",
    "services": ["srv-7"],
    "totalDuration": 45,
    "totalPrice": 750,
    "preferredBarberId": "ANY",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:30:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "REMOTE"
  },
  {
    "id": "T-107",
    "customerName": "Chirag Patel",
    "phone": "9825077777",
    "services": ["srv-8"],
    "totalDuration": 60,
    "totalPrice": 900,
    "preferredBarberId": "barber-4",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:35:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "WALK_IN"
  },
  {
    "id": "T-108",
    "customerName": "Kunal Bhatt",
    "phone": "9825088888",
    "services": ["srv-5", "srv-6"],
    "totalDuration": 55,
    "totalPrice": 700,
    "preferredBarberId": "ANY",
    "assignedBarberId": null,
    "status": "WAITING",
    "joinedAt": "2026-11-20T15:40:00.000Z",
    "calledAt": null,
    "serviceStartedAt": null,
    "source": "REMOTE"
  }
]
```
