# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Donors** — individuals who want to donate items or money to verified NGOs in their area, earn rewards for their contributions, and track their impact.

**Organizations** — NGOs and charitable organizations that need to receive, manage, and acknowledge donations from community members, and issue certificates to donors.

The platform serves both user types as equally important audiences.

## Product Purpose

Donatio connects generous donors with impactful organizations in their local area. Every donation earns rewards (points, badges) and produces a verifiable impact record including certificates. The product makes charitable giving visible, rewarding, and locally relevant.

## Positioning

Donatio differentiates through **local community focus combined with gamified rewards**. Unlike large-scale donation platforms, Donatio emphasizes proximity — donors discover organizations near them — and the reward system (points, badges, leaderboards) creates ongoing engagement rather than one-off transactions.

## Operating Context

- Donors browse organizations by category, search, and location proximity, then submit donation requests (items or monetary) with delivery method and scheduling.
- Organizations accept or reject incoming donation requests, mark them complete, and award reward points that trigger certificate generation.
- Both flows are authenticated: donors via email/password, organizations via a separate portal.
- Interactions happen entirely through the web app (responsive, desktop-first with mobile support).

## Capabilities and Constraints

**Confirmed capabilities:**
- Donor registration and login (email/password with optional email verification)
- Organization registration and login (separate portal, email verification)
- Browse/search/filter organizations by category and location
- Organization detail pages with description, mission, gallery, contact, donation needs
- Donation request form (type, quantity, delivery method, scheduling, notes)
- Donation status tracking (pending → accepted → completed, or rejected)
- Points, badges (bronze/silver/gold/platinum), and leaderboard
- Donation history and certificate download
- Organization profile management (editable fields, image uploads)
- Organization dashboard with stats and incoming donation management

**Constraints:**
- Frontend-only changes; backend (Supabase) must not be modified
- No backend API or database schema changes permitted

## Brand Commitments

- **Name:** Donatio
- **Logo:** SVG logo at `/logo.svg`
- **Typography:** DM Sans (400, 500, 600, 700 weights)
- **Primary color:** Purple (HSL 262° 80% 55%)
- **Voice:** Warm, encouraging, community-oriented
- **Tagline:** "Connect, Donate, Transform Lives"

## Evidence on Hand

- No real user data, testimonials, or case studies exist
- No pricing, licensing, or deployment information
- All organization data comes from the Supabase backend
- Certificate generation is client-side HTML export

## Product Principles

1. **Trust through transparency** — Every donation is trackable through its status lifecycle, and every certificate is downloadable proof of impact.
2. **Local first** — Proximity between donors and organizations is the primary connection mechanism; location is central to discovery.
3. **Reward participation** — Gamification (points, badges, leaderboards) exists to sustain engagement, not as a vanity layer; it must feel earned.
4. **Two-sided clarity** — Donors and organizations have distinct needs and distinct interfaces; the design must never conflate them.
5. **Content over decoration** — Real information (descriptions, needs, contact, impact stats) drives decisions; visual treatment supports comprehension, not distraction.

## Accessibility & Inclusion

No product-specific accessibility requirements have been established beyond the implicit WCAG baseline that the shadcn/ui component library provides.
