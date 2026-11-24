# Salon Queue Management System
# **Live demo:** https://salon-queue-sagarchikhaliya.vercel.app
# **Admin Id:** admin
# **Password:** makeover2026
# **Hosted on:** Vercel

# GlamourSync — Real-Time Salon Queue & Floor Management

> Dedicated real-time queue orchestration and floor management web application engineered for modern unisex salons, barbershops, and beauty studios.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌸 Visual Aesthetic & Design System

The visual language is inspired by organic wellness and luxury salon aesthetics:
- **Warm Blush Canvas**: `#FDF4F1` & `#FFF1ED`
- **Authoritative Midnight Navy**: `#12183A`
- **Vibrant Terracotta Coral**: `#EE7A68`
- **Soft Hairline Borders**: `#F3E8E2`
- **100% Bilingual**: English and Gujarati (ગુજરાતી) toggleable across every view.

---

## 🚀 The 7 Core Screen Routes

| Route | View Name | Target User | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `/` | **Customer Home** | Remote Patron | Live salon stats, open/closed status, "Join Queue" CTA, token lookup modal |
| `/join` | **Remote Join Queue** | Remote Patron | Full Name, 10-digit mobile, max 3 services, "Any Barber (Fastest)" or specific stylist, duplicate phone guard |
| `/status/:id` | **Live Token Tracker** | Remote Patron | Dynamic queue position (`# 2 ahead`), remaining wait minutes, approaching alert, full-screen turn modal with Web Audio chime, self-cancellation |
| `/reception` | **Receptionist Desk** | Floor Staff | 10"–12" tablet layout: Lobby sidebar stats, barber velocity, live dispatch table, `+ Walk-In Registration` modal, 10-min no-show grace timer |
| `/barber/:name` | **Barber Workstation** | Stylist / Barber | Station mirror view: `Available / On Break` toggle, active chair customer card with stopwatch timer, Smart FIFO next customer call, concurrency lock |
| `/display` | **Waiting Area Wall TV** | Lobby Waiting Area | 1080p full-height split screen: 4 Station Chairs with live status, Upcoming Queue list, digital clock, rolling ticker, animated coral flash & Web Audio chime on call |
| `/admin` | **Owner Admin Console** | Salon Owner | Master Queue pause/resume toggle, 30-min auto-cutoff, service catalog CRUD, barber roster CRUD, daily revenue & wait analytics |

---

## ⚡ Core Business Logic & Architectural Guards

1. **Smart FIFO Queue Dispatch**:
   - Evaluates queue sequentially.
   - Matches customers who explicitly requested that barber, or chose **"Any Barber (Fastest)"**.
   - Skips tokens waiting specifically for other stylists without losing their place.
2. **Dynamic Mathematical Wait Time**:
   $$W_k = \frac{\sum_{i=1}^{k-1} D_i + \sum_{b=1}^{N_{\text{active}}} R_b}{N_{\text{active}}}$$
   - Restricts to specific barber when requested.
   - **Zero-Barber Fallback**: Gracefully renders *"Queue Paused (All Stylists on Break)"* if all barbers are on break, avoiding division-by-zero.
3. **Chair Concurrency Guard**:
   - Workstation restricts calling a new customer if a customer is currently `IN_SERVICE`.
4. **Duplicate Active Phone Guard**:
   - Prevents duplicate entries with the same 10-digit mobile number while an active token (`WAITING`, `CALLED`, `IN_SERVICE`) exists.
5. **No-Show Grace Period & Strict Tail Insertion**:
   - 10-minute timer started upon `CALLED` transition.
   - If late, re-adding issues a brand-new token appended strictly at the tail of the line (never jumps forward).
6. **Cross-Tab & Cross-Device Real-Time Synchronization**:
   - Powered by `BroadcastChannel` with `storage` event fallback.
   - Sub-second (< 1s) propagation across tabs and windows.
7. **Native Web Audio API Chimes**:
   - Dual-tone chime (523Hz `C5` -> 659Hz `E5`).
   - Zero external audio file dependencies.

---

## 🛠️ Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 📱 Multi-Device / Multi-Tab Demo Guide

To experience the full real-time synchronization:
1. Open **Tab 1**: Customer Tracker (`/status/T-102` or `/join`)
2. Open **Tab 2**: Receptionist Desk (`/reception`)
3. Open **Tab 3**: Barber Workstation (`/barber/vikram-solanki`)
4. Open **Tab 4**: Wall TV Display (`/display`)
5. In **Tab 3**, click **"Call This Customer"**:
   - Notice Tab 4 immediately flashes Chair #2 in vibrant coral and sounds the chime.
   - Notice Tab 1 immediately pops open the full-screen *"It's Your Turn!"* modal with countdown timer.
   - Notice Tab 2 marks the token as `Called` and starts the 10-minute countdown badge.
