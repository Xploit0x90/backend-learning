# Event Management System

A full-stack web application for managing events, participants, and tags. Create and edit events, assign participants, categorize with tags, and view optional weather for event locations. The app is available in **English** and **German** and includes a responsive UI with dark/light mode.

---

## Live demo

**[Open the app →](https://zoological-fascination-production.up.railway.app/home)**

*Deployed on [Railway](https://railway.app). Frontend and backend run together; the database is hosted in the cloud.*

---

## Overview

Full-stack CRUD application for events, participants, and tags with many-to-many relationships. Includes a REST API (Node.js, Express, TypeScript), React frontend with TypeScript, form validation (Zod), and a single deployment on Railway (app, API, and PostgreSQL). No authentication — the live demo can be used directly.

---

## Features

- **Events** — Create, edit, delete; title, description, location, date, image URL, max participants.
- **Participants** — Add participants and assign them to events; view participant details and their events.
- **Tags** — Colored tags for events; filter events by tag; tag management (create, edit, delete).
- **Weather** — Optional weather for event location (requires [WeatherAPI](https://www.weatherapi.com/) key in backend).
- **UI** — Responsive layout, dark/light theme toggle, English/German language switch.

Single-user app (no authentication). Runs locally with Docker or with a local PostgreSQL instance.

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, TypeScript, Vite, Chakra UI, React Router, Axios, i18next (EN/DE) |
| **Backend** | Node.js, Express, TypeScript, Drizzle ORM, Zod (validation) |
| **Database** | PostgreSQL |

---

## How to run locally

### Option 1: Docker

```bash
cp .env.example .env   # optional: add WEATHER_API_KEY for weather
docker-compose up -d
```

- **App:** http://localhost:3000  
- **API:** http://localhost:5000/api  

Sample data is seeded on first run.

### Option 2: Local (backend + frontend + your own DB)

**1. Database** — PostgreSQL (local or e.g. [Neon](https://neon.tech) free tier).

**2. Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3001
CORS_ORIGIN=http://localhost:3000
WEATHER_API_KEY=your_key   # optional
```

```bash
npm run db:push
npm run dev
```

**3. Frontend**

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

Open **http://localhost:3000**. The dev server proxies `/api` to the backend so CORS is not an issue.

---

## Project structure

```
event-management-app/
├── backend/
│   └── src/
│       ├── controller/   # event, participant, tag, health, weather
│       ├── routes/       # REST routes per resource
│       ├── services/     # business logic
│       ├── db/           # Drizzle schema
│       ├── validators/   # Zod schemas
│       └── server.ts
├── frontend/
│   └── src/
│       ├── pages/        # Events, Participants, Tags, detail pages
│       ├── components/   # modals, layout
│       ├── adapter/api/  # API client (axios)
│       └── locales/      # en.json, de.json
└── docker-compose.yml
```

---

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET / POST | `/api/events` | List, create |
| GET / PUT / DELETE | `/api/events/:id` | Get, update, delete event |
| GET / POST | `/api/participants` | List, create |
| GET / PUT / DELETE | `/api/participants/:id` | Get, update, delete participant |
| POST | `/api/participants/add-to-event` | Assign participant to event |
| DELETE | `/api/participants/:id/events/:eventId` | Remove from event |
| GET / POST | `/api/tags` | List, create |
| GET / PUT / DELETE | `/api/tags/:id` | Get, update, delete tag |
| POST | `/api/tags/add-to-event` | Assign tag to event |
| GET | `/api/weather?location=...` | Weather (optional) |
| GET | `/api/health` | Health check |

Postman collection: `backend/docs/Event-Management-API.postman_collection.json` (if present).

---

## Deployment (Railway)

This project is deployed on **Railway** (full stack: app + API + PostgreSQL).

- **Backend:** Deploy `backend` with `DATABASE_URL`, `PORT`, `CORS_ORIGIN` (your frontend URL), and optional `WEATHER_API_KEY`. Run `npm run db:push` once after first deploy.
- **Frontend:** Build uses `VITE_API_URL` pointing to the backend URL (no `/api` suffix). Static build can be served by the same Railway service or a separate one.
- **CORS:** Set `CORS_ORIGIN` to the exact frontend origin (e.g. `https://zoological-fascination-production.up.railway.app`) so the browser allows API requests.

---

## Scripts

| Where | Command | Purpose |
|-------|---------|---------|
| Backend | `npm run dev` | Start dev server |
| Backend | `npm run build` | Production build |
| Backend | `npm run db:push` | Apply schema to DB |
| Backend | `npm run db:seed` | Seed sample data |
| Frontend | `npm run dev` | Start Vite dev server |
| Frontend | `npm run build` | Production build |

---


