# Event Management System

Full-stack app to manage **events**, **participants**, and **tags**. Create events, assign participants, categorize with tags, and optionally show weather for event locations.

---

## What it does

- **Events** — Create, edit, delete; title, description, location, date, image, max participants.
- **Participants** — Manage people and assign them to events.
- **Tags** — Label events with colored tags; filter by tag.
- **Weather** — Optional: show weather for event location (needs [WeatherAPI](https://www.weatherapi.com/) key).

Single-user app (no login). Works with Docker or run backend + frontend locally.

---

## Tech stack

| Layer     | Tech |
|----------|------|
| Frontend | React, TypeScript, Vite, Chakra UI, React Router, Axios |
| Backend  | Node.js, Express, TypeScript, Drizzle ORM, Zod |
| Database | PostgreSQL |

---

## How to run

### Option 1: Docker

```bash
cp .env.example .env   # optional: set WEATHER_API_KEY for weather feature
docker-compose up -d
```

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:5000/api**

DB is seeded with sample data on first run.

### Option 2: Local (no Docker)

**1. Database** — PostgreSQL running (local or e.g. [Neon](https://neon.tech)).

**2. Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
WEATHER_API_KEY=your_key_here   # optional
```

```bash
npm run db:push    # create tables
npm run dev        # http://localhost:5000
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev        # e.g. http://localhost:5173
```

Set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env` if the API is on another port.

---

## Project structure

```
event-management-app/
├── backend/           # Express API
│   └── src/
│       ├── controller/   # event, participant, tag, health, weather
│       ├── routes/       # one file per resource
│       ├── services/     # eventService, participantService, tagService
│       ├── db/           # schema.ts
│       ├── validators/   # Zod schemas
│       └── server.ts     # entry
├── frontend/          # React + Vite + Chakra UI
│   └── src/
│       ├── pages/       # Events, Participants, Tags, etc.
│       ├── components/  # modals, layout
│       └── adapter/api/ # API client
└── docker-compose.yml
```

---

## API (summary)

- `GET/POST/PUT/DELETE` **/api/events**, **/api/participants**, **/api/tags**
- `POST /api/participants/add-to-event` — add participant to event
- `POST /api/tags/add-to-event` — add tag to event
- `GET /api/weather?location=Berlin` — weather (optional)
- `GET /api/health`, `GET /api/db-test` — health checks

Postman collection: `backend/docs/Event-Management-API.postman_collection.json`

---

## Deploy on Vercel (frontend only)

1. **Deploy the backend elsewhere** (e.g. [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io)) so it’s always running. Set `DATABASE_URL` and optional `WEATHER_API_KEY` there.

2. **Deploy this project to Vercel** (from the `event-management-app` folder or repo):
   - Connect the repo; Vercel will use the existing `vercel.json` (builds `frontend`, outputs `frontend/dist`).
   - In **Project → Settings → Environment Variables** add:
     - `VITE_API_URL` = your backend API base URL, e.g. `https://your-app.railway.app/api`
   - Redeploy so the frontend is built with that URL.

3. **CORS:** On the backend host, set env `CORS_ORIGIN=https://your-project.vercel.app` (or comma-separated list). If unset, all origins are allowed.

**Note:** Vercel hosts the React app only. It does not run the Express backend; that must be deployed on a Node-friendly platform.

**If you see a Vercel error (e.g. a code like `fra1::xwl2v-...`):** That’s a deployment ID, not the real error.
- In the Vercel dashboard open the failed **Deployment** → **Building** tab and check the **build logs** for the actual message (e.g. “No such file or directory”, “npm run build exited with 1”).
- **Repo is `backend-learning`?** In the project **Settings → General** set **Root Directory** to `event-management-app` so the build can find the `frontend` folder. Leave “Include source files outside of the Root Directory” unchecked.
- If the build fails on `tsc` or `vite build`, fix the reported TypeScript or build error locally with `cd frontend && npm run build`.

---

## Scripts

**Backend:** `npm run dev` | `npm run build` | `npm run db:push` | `npm run db:seed` | `npm test`  
**Frontend:** `npm run dev` | `npm run build` | `npm test`

---

FWE course project (Fortgeschrittene Webentwicklung) — Mohammad Sarhan
