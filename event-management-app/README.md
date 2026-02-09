# Event Management System

This is my project for the FWE (Fortgeschrittene Webentwicklung) course. It's a full-stack web app for managing events, participants, and tags. I built it with React, TypeScript, Node.js, and PostgreSQL. The UI uses Chakra UI for styling with dark mode support, and I also added weather integration which I think is pretty cool.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

## What it does

Basically, you can:
- Create, edit, and delete events with all the info you need (title, description, location, date, images, etc.)
- Manage participants separately and assign them to events
- Use tags to categorize events (with colors!)
- Search and filter events by different criteria
- See weather info for event locations (my freestyle feature)
- Everything works on mobile too

The whole thing runs in Docker, so setup is pretty straightforward. It's a single-user app, so no login stuff needed.

### Tech Stack

I used:

**Frontend:**
- React 18.3 with TypeScript
- Vite
- Chakra UI for styling and components 
- React Router for navigation
- Axios for API calls
- Vitest for testing

**Backend:**
- Node.js 20 with TypeScript
- Express.js for the REST API
- Drizzle ORM (tried it for the first time, pretty nice actually)
- PostgreSQL 15
- Zod for validation (really helpful, catches errors early)
- Jest for testing

**Docker:**
- Docker Compose to run everything
- Nginx for serving the frontend in production
- I also set up a dev mode with hot reload so you don't have to rebuild every time

## Getting Started

### What you need

- Docker Desktop (make sure it's running)
- Git (to clone the repo)

### Setup

1. **Clone the repo:**
   
   Replace `<repository-url>` with your actual repo URL:
   ```bash
   git clone <repository-url>
   cd event-management-app
   ```

2. **Set up the weather API (optional but recommended):**
   
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file and replace `your_weather_api_key_here` with your actual API key.
   
   To get a free API key:
   - Go to [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
   - Sign up (it's free)
   - Copy your API key from the dashboard
   - Paste it in the `.env` file
   
   If you don't add this, the weather feature won't work but everything else will be fine. The app will run without it.

3. **Start everything:**
   
   This will start all services in the background:
   ```bash
   docker-compose up -d
   ```
   
   The `-d` flag runs it in detached mode (in the background).

4. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/api
   - Database: localhost:5432 (if you need to connect directly)

The first time you run it, Docker will download images and build everything, so it might take a few minutes. After that it's much faster.

**Note:** On the first startup, the database will be automatically seeded with sample data (events, participants, tags) so you can see how the app works right away. If something goes wrong, check the troubleshooting section below.

## How to Use

### Basic workflow

1. Create some events on the Events page
2. Add participants on the Participants page
3. Assign participants to events (on the event detail page)
4. Create tags to categorize events
5. Use search and filters to find what you're looking for
6. Check out the weather on event detail pages (if you set up the API key)

### Pages

- **Home** (`/home`): Shows some stats and upcoming events
- **Events** (`/events`): All events with search and filters
- **Participants** (`/participants`): Manage participants
- **Tags** (`/tags`): Create and manage tags

### Features

**Events:**
You can create events with all the usual stuff - title, description, location, date, image, max participants. You can edit and delete them too. On the detail page you see all participants and tags assigned to the event, plus weather if available.

**Participants:**
Create participants with their info (name, email, phone, study program, notes). You can see all events a participant is registered for, and it shows which are past and which are upcoming.

**Tags:**
Create tags with custom colors. You can assign multiple tags to events and click on a tag to see all events with that tag.

**Search & Filter:**
You can search by text (title, location, description), filter by date (all/upcoming/past), filter by location, and filter by tags. All filters work together.

## Development

### Hot Reload Mode

If you want to develop and see changes immediately without rebuilding, first stop the production frontend, then start the dev one:

```bash
docker-compose stop frontend
docker-compose --profile dev up -d frontend-dev
```

The `--profile dev` flag is needed because the dev service uses Docker profiles.

Now when you edit files in `frontend/src/`, changes show up in the browser automatically (usually within a second or two). Much better than rebuilding every time! I added this because I got tired of waiting for rebuilds during development.

More details in [DOCKER-DEV.md](./DOCKER-DEV.md).

### Running Locally (without Docker)

If you prefer to run it locally (without Docker):

**Backend:**
First install dependencies, then start the dev server:
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
Same thing for the frontend:
```bash
cd frontend
npm install
npm run dev
```

**Database:**  
You need PostgreSQL running (local or remote). In `backend/` create a `.env` with either:
- `DATABASE_URL=postgresql://user:password@host:port/database`  
or the separate vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.  
Then run `npm run db:push` in `backend/` to create tables (or apply migrations).

## Testing

### Backend Tests

To run tests, go to the backend directory first:
```bash
cd backend
npm test              # Run all tests once
npm run test:watch    # Keep running tests when files change
npm run test:coverage # See how much of the code is tested
```

I have tests for:
- Event controller (`test/event.controller.spec.ts`)
- Participant controller (`test/participant.controller.spec.ts`)
- Tag controller (`test/tag.controller.spec.ts`)
- Health check (`test/health.controller.spec.ts`)

### Frontend Tests

Same thing for frontend:
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode (re-runs on file changes)
```

Tests are in:
- `src/pages/__tests__/` - Page tests
- `src/components/__tests__/` - Component tests

### Postman Collection

There's a Postman collection at `backend/docs/Event-Management-API.postman_collection.json` if you want to test the API manually. Just import it into Postman.

## API Documentation

The API runs on `http://localhost:5000/api`

### Endpoints

#### Health Check
- `GET /health` - Check API health status
- `GET /db-test` - Test database connection

#### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

**Create Event Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event description",
  "location": "Berlin, Germany",
  "date": "2025-12-25T10:00:00Z",
  "image_url": "https://example.com/image.jpg",
  "max_participants": 50
}
```

#### Participants
- `GET /participants` - Get all participants
- `GET /participants/:id` - Get participant by ID
- `POST /participants` - Create new participant
- `PUT /participants/:id` - Update participant
- `DELETE /participants/:id` - Delete participant
- `POST /participants/add-to-event` - Add participant to event
- `DELETE /participants/:participantId/events/:eventId` - Remove participant from event

**Create Participant Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+49 123 456789",
  "study_program": "Computer Science",
  "notes": "Additional notes"
}
```

#### Tags
- `GET /tags` - Get all tags
- `GET /tags/:id` - Get tag by ID (includes all events with this tag)
- `POST /tags` - Create new tag
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag
- `POST /tags/add-to-event` - Add tag to event
- `DELETE /tags/:tagId/events/:eventId` - Remove tag from event

**Create Tag Request Body:**
```json
{
  "name": "Workshop",
  "color": "#EB5E28"
}
```

#### Weather
- `GET /weather?location=Berlin&date=2025-12-25` - Get weather for location

**Response Format:**
```json
{
  "success": true,
  "data": {
    "location": "Berlin",
    "country": "Germany",
    "temperature": 15,
    "feelsLike": 14,
    "description": "Partly cloudy",
    "humidity": 65,
    "windSpeed": 12,
    "icon": "https://cdn.weatherapi.com/weather/64x64/day/116.png"
  }
}
```

### Response Format

All responses look like this:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation failed)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

## Database Schema

### Events
- `id` - primary key
- `title` - required
- `description` - optional
- `location` - optional
- `date` - required (timestamp)
- `image_url` - optional
- `max_participants` - default 50
- `created_at`, `updated_at` - timestamps

### Participants
- `id` - primary key
- `first_name`, `last_name` - required
- `email` - required, unique
- `phone` - optional
- `study_program` - optional
- `notes` - optional
- `created_at`, `updated_at` - timestamps

### Tags
- `id` - primary key
- `name` - required, unique
- `color` - hex color code (like #EB5E28)
- `created_at` - timestamp

### Junction Tables
- `event_participants` - links events and participants (many-to-many)
- `event_tags` - links events and tags (many-to-many)

## Freestyle Feature: Weather Integration

I added weather information for event locations using WeatherAPI.com. I thought it would be useful to see the weather when planning events.

### How it works

When you view an event detail page, it automatically fetches the weather for that event's location. The backend extracts the city name from the location string (so it works even if you put in a full address), then calls the WeatherAPI and displays the info.

On the frontend, there's a weather card that shows:
- Current temperature
- "Feels like" temperature
- Weather description (in German)
- Humidity
- Wind speed
- Weather icon

If the weather API isn't available or the location is invalid, it just doesn't show the weather card - doesn't break anything. I made sure the app still works fine without it.

### Setup

1. Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/signup.aspx) (free tier gives you 1 million calls/month, which is plenty)
2. Add it to your `.env` file:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```
3. Restart the backend so it picks up the new environment variable:
   ```bash
   docker-compose restart backend
   ```

That's it! The weather will start showing up on event detail pages. Pretty simple setup.

More details in [WEATHER_API_SETUP.md](./WEATHER_API_SETUP.md) if you need them, but the above should be enough to get it working.

## Project Structure

```
event-management-app/
├── backend/                  # Express API (events, participants, tags, weather)
│   └── src/
│       ├── controller/      # eventController, participantController, tagController, health, weather
│       ├── routes/          # events, participants, tags, health, weather (one file per resource)
│       ├── services/        # eventService, participantService, tagService
│       ├── middleware/      # logger
│       ├── validators/      # Zod schemas (event, participant, tag)
│       ├── db/              # schema.ts (single schema file)
│       ├── db.ts            # Drizzle + pg Pool
│       ├── server.ts        # Entry point
│       ├── utils/           # transform, validation helpers
│       └── scripts/         # seed.ts
│   ├── drizzle/             # Migrations / db:push
│   ├── test/                # Jest tests
│   └── docs/                # Postman collection
├── frontend/
│   └── src/
│       ├── pages/           # Page components
│       ├── components/     # Modals, reusable UI
│       ├── layout/         # BaseLayout
│       ├── adapter/api/    # API client (useApiClient)
│       ├── types/          # TypeScript types
│       └── theme/          # Chakra UI theme
├── docker-compose.yml
├── .env
└── README.md
```

## Scripts

### Backend

Most common commands you'll use:
```bash
npm run dev          # Start dev server (auto-reload on changes)
npm run build        # Build for production
npm start            # Run production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code style
npm run db:generate  # Generate migrations
npm run db:push      # Sync schema to database (or use db:migrate if you use migrations)
npm run db:seed      # Manually seed data (optional; backend auto-seeds empty DB on startup)
```

### Frontend

Same idea here:
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview the production build locally
npm test             # Run tests
npm run lint         # Check code style
```

## Docker Commands

Here are the commands I use most often:

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# Stop everything and remove containers
docker-compose down

# Rebuild images and start (useful after changing Dockerfiles)
docker-compose up -d --build

# Watch logs in real-time (Ctrl+C to exit)
docker-compose logs -f

# Stop just one service
docker-compose stop frontend

# Start dev mode with hot reload
docker-compose --profile dev up -d frontend-dev
```

You can also check what's running with `docker-compose ps` or view logs for a specific service like `docker-compose logs backend`.

## Environment Variables

After cloning, copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Root `.env` (for Docker)

The `.env.example` file shows what you can configure. The only one you really need is the weather API key (and that's optional):

```env
WEATHER_API_KEY=your_api_key_here
POSTGRES_USER=eventuser
POSTGRES_PASSWORD=eventpass123
POSTGRES_DB=eventmanagement
```

The database credentials have defaults in `docker-compose.yml`, so you only need to set them if you want different values.

### Backend `.env` (for local dev)
Create `backend/.env` with:
```env
DATABASE_URL=postgresql://user:password@host:port/database
# Or: DB_HOST=localhost DB_PORT=5432 DB_USER=eventuser DB_PASSWORD=... DB_NAME=eventmanagement
PORT=5000
WEATHER_API_KEY=your_api_key_here
```
Then run `npm run db:push` in `backend/` to sync the schema.

## Troubleshooting

**Frontend not loading?**
```bash
# Check if containers are actually running
docker-compose ps

# See what errors the frontend is throwing
docker-compose logs frontend

# Sometimes a rebuild fixes weird issues
docker-compose build frontend && docker-compose up -d frontend
```

**Backend API errors?**
```bash
# Check backend logs for errors
docker-compose logs backend

# Make sure the database is running too
docker-compose logs postgres

# Also double-check your .env file has all the right values
```

**Weather not showing?**
```bash
# First, make sure the API key is actually in your .env file
# Then restart the backend so it picks it up
docker-compose restart backend

# Check if there are any API errors in the logs
docker-compose logs backend | grep -i weather
```

**Database issues?**
```bash
# Check if postgres is running
docker-compose ps

# See database logs
docker-compose logs postgres

# Make sure the credentials in docker-compose.yml match what you're using
```

## License

This is a university project for the course "Fortgeschrittene Webentwicklung" (FWE) at Hochschule Darmstadt, Wintersemester 2025-2026.

## Author

Mohammad Sarhan

Repository: https://code.fbi.h-da.de/mohammad.sarhan/fwe

## Thanks

- Weather data from [WeatherAPI.com](https://www.weatherapi.com/)
- UI components from [Chakra UI](https://chakra-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Note:** This is a single-user app - no login, authentication, or user management needed (as per assignment requirements). Just start it up and use it!
