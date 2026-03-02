# Shipment Verification System & Admin Command Center

A Next.js (App Router) and Supabase project providing a robust, state-driven shipment verification funnel and an administrative dashboard for managing client verification flows.

## Features Built So Far

1. **Client Verification Funnel**
   - Step-by-step verification process handling logistics constraints.
   - States logically enforced by PostgreSQL backend: `INVITED` ➔ `LINK_CLICKED` ➔ `ADDRESS_CONFIRMED` ➔ `PAYMENT_SUBMITTED` ➔ `GATE_1_APPROVED` ➔ `OTP_SUBMITTED` ➔ `GATE_2_APPROVED` ➔ `REJECTED`.
   - Premium split-screen layout tracking user progress with dynamic "Shipment Summary" sidebars.
   - Secure data collection gates for address and payment payloads utilizing dynamic trust indicators.
   - OTP Protection Model for secure, final-stage verification.

2. **Admin Command Center**
   - Real-time client tracking table powered by Supabase Realtime subscriptions.
   - Admin Gate actions: Approve/Reject workflows for Gate 1 (Payment) and Gate 2 (OTP).
   - Client management: Edit client details, manage state manually, or delete records directly from the expandable dashboard.
   - Multi-language support configuration (English, Arabic, French, Spanish, Albanian, Dutch).

3. **External Integrations**
   - DHL-Branded Email Notification workflows via Resend (SMTP).
   - Real-time Telegram Bot webhook notifications for monitoring active verification sessions.

4. **Database Architecture & Security**
   - Secure Supabase PostgreSQL schema utilizing Row Level Security (RLS) policies for isolated admin data access.
   - Strict state machine enforcement using PL/pgSQL functions.

> **Note:** For a detailed step-by-step history of this project's development milestones, please read the [Project Overview](PROJECT_OVERVIEW.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack
- Frontend: [Next.js](https://nextjs.org) (React), Tailwind CSS v4.
- Backend, Database, Auth: [Supabase](https://supabase.com).
- Icons: Lucide React.
