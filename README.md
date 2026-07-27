# Donatio — Donation Connect Platform

Donatio is a full-stack web platform that connects donors with verified non-profit organizations. Donors can browse organizations, submit donations, track their impact through a points and badge system, and earn certificates. Organizations can manage their profile, post donation needs, and process incoming donations.

The platform supports two roles:
- **Donors** — discover verified organizations, create donations, track statuses, view certificates, and check leaderboard ranking
- **Organizations** — manage profile and donation needs, review incoming donations, accept or reject requests, complete donations, and award points

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Local Development (without Docker)](#local-development-without-docker)
  - [Local Development (with Docker)](#local-development-with-docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Reference](#api-reference)
- [Frontend Routes](#frontend-routes)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Reward System](#reward-system)
- [Testing](#testing)

---

## Features

### Donors
- Register and log in with email and password
- Browse all verified organizations with filtering by location
- View organization details, mission, and active donation needs
- Submit donations with item type, quantity, category, and delivery method
- Choose between pickup or drop-off delivery
- Track donation status (pending → accepted → completed)
- Earn reward points and badges upon donation completion
- Download donation certificates
- View a live leaderboard ranked by points

### Organizations
- Register and log in through a separate portal
- Complete and manage their public profile
- Post donation needs with urgency levels
- View and manage incoming donations
- Accept or reject donations
- Mark donations as completed and trigger certificate/points generation
- View detailed donation history and stats

### Platform
- Dual authentication flows — separate portals for donors and organizations
- Role-based access control enforced on both client and server
- Supabase Row-Level Security (RLS) on all database tables
- Automated stats updates via PostgreSQL database triggers
- Responsive UI with dark/light mode support

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state management and caching |
| Tailwind CSS | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component library |
| Supabase JS Client | Auth and direct database access |
| Axios | HTTP client for backend API calls |
| Sonner | Toast notifications |
| next-themes | Dark/light mode theming |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Supabase JS Client | Database queries and auth token validation |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |

### Infrastructure & Database
| Technology | Purpose |
|---|---|
| Supabase (PostgreSQL) | Database, authentication, and storage |
| Docker + Docker Compose | Containerized local and production deployment |
| Jenkins | CI/CD pipeline |
| Docker Hub | Container image registry |

---

## Project Structure

```
donatio/
├── frontend/                    # React + TypeScript application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/          # Navbar, Logo, Cards, Badges, Layout
│   │   │   └── ui/              # shadcn/ui component library
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Global auth state (donors + orgs)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/
│   │   │   ├── supabase.ts      # Supabase client initialization
│   │   │   └── utils.ts         # Utility helpers
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Signup, ForgotPassword, ResetPassword
│   │   │   ├── user/            # Dashboard, Profile, Donate, Leaderboard, OrgDetails
│   │   │   └── org/             # OrgLogin, OrgSignup, OrgDashboard, OrgProfile, etc.
│   │   ├── services/            # API service modules
│   │   │   ├── donationService.ts
│   │   │   ├── orgBackendService.ts
│   │   │   ├── orgService.ts
│   │   │   ├── userBackendService.ts
│   │   │   └── userService.ts
│   │   ├── App.tsx              # Root component and router configuration
│   │   └── main.tsx             # Application entry point
│   ├── .env                     # Frontend environment variables
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js      # Supabase client (regular + admin)
│   │   ├── middlewares/
│   │   │   ├── auth.js          # JWT authentication + role guards
│   │   │   └── errorHandler.js  # Global error handler
│   │   ├── routes/
│   │   │   ├── userRoutes.js    # /api/users/*
│   │   │   ├── orgRoutes.js     # /api/organizations/*
│   │   │   └── publicRoutes.js  # /api/public/*
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server entry point
│   ├── .env                     # Backend environment variables
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # Multi-container orchestration
├── Jenkinsfile                  # CI/CD pipeline definition
└── README.md
```

---

## Prerequisites

- **Node.js** v20 or later
- **npm** v9 or later
- **Docker** and **Docker Compose** (for containerized deployment)
- A **Supabase** project with the schema applied (see [Database Schema](#database-schema))

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key   # Optional, bypasses RLS for admin ops
CORS_ORIGIN=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

> **Never commit `.env` files to version control.** Both are included in their respective `.gitignore` files.

---

## Getting Started

### Local Development (without Docker)

**1. Clone the repository**

```bash
git clone https://github.com/your-username/donatio.git
cd donatio
```

**2. Set up the backend**

```bash
cd backend
cp .env.example .env      # Fill in your Supabase credentials
npm install
npm run dev               # Starts on http://localhost:5000
```

**3. Set up the frontend**

```bash
cd frontend
cp .env.example .env      # Fill in your Supabase credentials and API URL
npm install
npm run dev               # Starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

### Local Development (with Docker)

Make sure both `frontend/.env` and `backend/.env` are populated, then run:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

To stop:

```bash
docker compose down
```

---

## CI/CD Pipeline

The project uses a Jenkins pipeline defined in `Jenkinsfile`. It runs on Windows agents.

### Pipeline Stages

1. **Build Frontend Image** — Runs `docker build` inside the `frontend/` directory, tagging as `harshalsl0209/donatio-frontend`
2. **Build Backend Image** — Runs `docker build` inside the `backend/` directory, tagging as `harshalsl0209/donatio-backend`
3. **Push Images to Docker Hub** — Authenticates using the `dockerhub-creds` Jenkins credential and pushes both images
4. **Create Environment Files** — Injects secrets from Jenkins credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) into `.env` files
5. **Deploy Containers** — Runs `docker compose down` then `docker compose up -d --build` to redeploy

### Required Jenkins Credentials

| Credential ID | Type | Purpose |
|---|---|---|
| `dockerhub-creds` | Username/Password | Docker Hub login |
| `SUPABASE_URL` | Secret Text | Supabase project URL |
| `SUPABASE_ANON_KEY` | Secret Text | Supabase anon key |

---

## API Reference

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <supabase_jwt_token>
```

---

### Public Endpoints — `/api/public`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/public/organizations` | None | List all verified organizations. Supports `?location=` filter |
| `GET` | `/api/public/organizations/:id` | None | Get a single organization by ID |
| `GET` | `/api/public/leaderboard` | None | Top 50 donors by points. Supports `?location=` filter |

---

### User (Donor) Endpoints — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/signup` | None | Register a new donor |
| `POST` | `/api/users/login` | None | Login and receive JWT |
| `GET` | `/api/users/profile` | Donor | Get current donor's profile |
| `PUT` | `/api/users/profile` | Donor | Update donor profile |
| `GET` | `/api/users/dashboard` | Donor | Get dashboard data (stats, recent donations) |
| `POST` | `/api/users/donations` | Donor | Create a new donation |
| `GET` | `/api/users/donations` | Donor | List all donations made by the donor |
| `GET` | `/api/users/donations/:id` | Donor | Get a single donation by ID |
| `GET` | `/api/users/organizations/:id` | Donor | Get organization details |
| `GET` | `/api/users/organizations/:id/needs` | Donor | Get active donation needs for an org |
| `GET` | `/api/users/certificates` | Donor | List all earned certificates |
| `GET` | `/api/users/leaderboard` | Donor | View the donor leaderboard |

---

### Organization Endpoints — `/api/organizations`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/organizations/signup` | None | Register a new organization |
| `POST` | `/api/organizations/login` | None | Login and receive JWT |
| `GET` | `/api/organizations/profile` | Org | Get organization's own profile |
| `PUT` | `/api/organizations/profile` | Org | Update organization profile |
| `GET` | `/api/organizations/dashboard` | Org | Get dashboard stats and overview |
| `GET` | `/api/organizations/donations` | Org | List all incoming donations |
| `GET` | `/api/organizations/donations/:id` | Org | Get a single donation detail |
| `PUT` | `/api/organizations/donations/:id/accept` | Org | Accept a pending donation |
| `PUT` | `/api/organizations/donations/:id/reject` | Org | Reject a pending donation |
| `POST` | `/api/organizations/donations/:id/complete` | Org | Mark donation complete + issue certificate |
| `GET` | `/api/organizations/needs` | Org | List own donation needs |
| `POST` | `/api/organizations/needs` | Org | Create a new donation need |
| `PUT` | `/api/organizations/needs/:id` | Org | Update a donation need |
| `DELETE` | `/api/organizations/needs/:id` | Org | Delete a donation need |

---

## Frontend Routes

### Public

| Route | Component | Description |
|---|---|---|
| `/` | `Index` | Landing page |
| `/login` | `Login` | Donor login |
| `/signup` | `Signup` | Donor registration |
| `/forgot-password` | `ForgotPassword` | Donor password reset request |
| `/reset-password` | `ResetPassword` | Donor password reset confirm |
| `/org/login` | `OrgLogin` | Organization login |
| `/org/signup` | `OrgSignup` | Organization registration |
| `/org/verify-email` | `VerifyEmail` | Email verification landing |
| `/org/forgot-password` | `OrgForgotPassword` | Org password reset request |
| `/org/reset-password` | `OrgResetPassword` | Org password reset confirm |

### Protected — Donors

| Route | Component | Description |
|---|---|---|
| `/dashboard` | `Dashboard` | Donor home with stats and recent activity |
| `/profile` | `Profile` | Donor profile management |
| `/org/:orgId` | `OrganizationDetails` | Organization public profile and needs |
| `/donate/:orgId` | `Donate` | Submit a donation to an organization |
| `/leaderboard` | `Leaderboard` | Points leaderboard |

### Protected — Organizations

| Route | Component | Description |
|---|---|---|
| `/org/dashboard` | `OrgDashboard` | Org home with donation stats |
| `/org/donations/:donationId` | `OrgDonationDetail` | Single donation detail and actions |
| `/org/profile` | `OrgProfile` | Organization profile management |

---

## Database Schema

The database is hosted on Supabase (PostgreSQL). Row-Level Security is enabled on all tables.

### Tables

#### `user_profiles`
Extends Supabase Auth users for donors.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | References `auth.users.id` |
| `user_type` | enum | Always `donor` for this table |
| `name` | TEXT | Full name |
| `phone` | TEXT | Phone number |
| `location` | TEXT | Location string |
| `points` | INTEGER | Accumulated reward points |
| `total_donated` | DECIMAL | Total value of completed donations |
| `donation_count` | INTEGER | Number of completed donations |
| `achievements` | TEXT[] | Array of earned achievement slugs |
| `badge` | enum | `bronze`, `silver`, `gold`, or `platinum` |
| `avatar_url` | TEXT | Profile picture URL |

#### `organization_profiles`
Extends Supabase Auth users for organizations.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | References `auth.users.id` |
| `name` | TEXT | Organization name |
| `description` | TEXT | About description |
| `mission` | TEXT | Mission statement |
| `category` | TEXT | e.g. Food, Clothing, Education |
| `location` | TEXT | City or region |
| `address` | TEXT | Physical address |
| `registration_number` | TEXT | Tax/charity registration ID |
| `verification_status` | enum | `pending`, `verified`, or `rejected` |
| `total_received` | DECIMAL | Total donations received |
| `donor_count` | INTEGER | Unique donor count |
| `active_requests` | INTEGER | Current open donation needs |
| `logo_url` | TEXT | Logo image URL |
| `banner_url` | TEXT | Banner image URL |

#### `donations`
Core transaction record between donor and organization.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `donor_id` | UUID | References `user_profiles.id` |
| `organization_id` | UUID | References `organization_profiles.id` |
| `donation_need_id` | UUID | Optional — references `donation_needs.id` |
| `type` | TEXT | e.g. Food, Clothing, Books |
| `quantity` | TEXT | e.g. "10 kg", "5 items" |
| `category` | TEXT | Donation category |
| `delivery_method` | enum | `pickup` or `dropoff` |
| `preferred_date` | DATE | Preferred handoff date |
| `preferred_time` | TEXT | Preferred time window |
| `notes` | TEXT | Additional notes |
| `status` | enum | `pending`, `accepted`, `rejected`, `completed`, `cancelled` |
| `reward_points` | INTEGER | Points awarded on completion |
| `certificate_url` | TEXT | Certificate file URL |

#### `donation_needs`
Donation requests posted by organizations.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `organization_id` | UUID | References `organization_profiles.id` |
| `title` | TEXT | Need title |
| `description` | TEXT | Detailed description |
| `category` | TEXT | Category |
| `urgency` | enum | `low`, `medium`, or `high` |
| `target_quantity` | TEXT | Goal quantity |
| `current_quantity` | TEXT | Current progress |
| `is_active` | BOOLEAN | Whether the need is open |

#### `certificates`
Certificates issued to donors on donation completion.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `donation_id` | UUID | References `donations.id` |
| `user_id` | UUID | References `user_profiles.id` |
| `certificate_url` | TEXT | Hosted certificate URL |
| `issued_at` | TIMESTAMPTZ | Issue timestamp |

### Entity Relationships

```
auth.users
    ├── user_profiles (donor)
    │       └── donations (as donor)
    │               └── certificates
    │
    └── organization_profiles
            ├── donation_needs
            └── donations (as recipient)
```

### Database Triggers

| Trigger | Event | Effect |
|---|---|---|
| `on_auth_user_created` | New Supabase auth user | Auto-creates `user_profile` or `organization_profile` based on `user_type` metadata |
| `donation_completed_trigger` | Donation marked completed | Updates donor stats (`points`, `total_donated`, `donation_count`) and org stats (`total_received`, `donor_count`) |
| `update_*_updated_at` | Any row update | Automatically sets `updated_at` to current timestamp |

---

## Authentication

Authentication is handled entirely by **Supabase Auth** (email + password).

- On signup, `user_type` is stored in Supabase user metadata (`donor` or `organization`)
- A database trigger automatically creates the corresponding profile record
- The backend validates JWTs by calling `supabase.auth.getUser(token)`
- Role guards (`isDonor`, `isOrganization`) check `user_metadata.user_type` on protected routes
- The frontend `AuthContext` exposes separate state, methods, and guards for each user type

### Auth Context API

```tsx
const {
  user,               // Donor profile object (or null)
  organization,       // Organization profile object (or null)
  isAuthenticated,    // true if a donor is logged in
  isOrgAuthenticated, // true if an organization is logged in
  loading,            // true during initial session check
  loginUser,          // (email, password) => Promise
  logoutUser,         // () => void
  signupUser,         // (fields) => Promise
  loginOrg,           // (email, password) => Promise
  logoutOrg,          // () => void
  signupOrg,          // (fields) => Promise
  updateUser,         // (fields) => Promise
  updateOrg,          // (fields) => Promise
} = useAuth();
```

---

## Reward System

Donors accumulate points each time a donation is completed by an organization. Points determine badge tier:

| Badge | Points Required |
|---|---|
| Bronze | 0 – 100 |
| Silver | 101 – 500 |
| Gold | 501 – 1,000 |
| Platinum | 1,000+ |

Badge upgrades and leaderboard positions are computed automatically via database triggers and reflected instantly in the donor's profile and the public leaderboard.

---

## Testing

### Backend Manual Testing

Ensure the backend is running:

```bash
cd backend
node src/server.js
```

Obtain JWT tokens for a donor and organization account, then run the end-to-end flow test:

```bash
node test-complete-flow.js
```

This script exercises the full donation lifecycle:
1. Donor creates a donation
2. Organization accepts the donation
3. Organization marks it as completed
4. Certificate is generated and points are awarded
5. Leaderboard is updated

For direct database-level testing (bypasses the API layer):

```bash
node test-db-flow.js
```

Refer to `backend/TESTING_GUIDE.md` for full instructions including token acquisition, expected output, SQL verification queries, and cleanup scripts.

### Frontend Development

```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` and use the donor and organization portals to manually verify flows.

### Linting

```bash
cd frontend
npm run lint
```
