# Task Board

A full-stack **task board** app: manage **users**, **projects**, and **tasks** with status columns (To do → In progress → Done). Built with React, Express, and PostgreSQL.

---

## What it does

- **Users** — List, search by name, and create users (used as task assignees).
- **Projects** — List, create, edit, and delete projects (each project has its own task board).
- **Task board** — Pick a project, add tasks (name + assignee), move tasks between columns (todo / in progress / done), and delete tasks.

---

## Technologies used

| Layer    | Tech |
|----------|------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend**  | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (Neon), Drizzle ORM |

---

## How to try it

This project does **not** use a shared database. To run it, you use **your own** database (or a live demo, if available).

- **Live demo:** *(add your Vercel or other deployment URL here when you deploy)*
- **Run locally:** Use a **free [Neon](https://neon.tech) account** (no credit card): sign up → create a project → copy the connection string. Then follow “How to run” below.

---

## How to run

**Prerequisites:** Node.js (v18+), npm, and a PostgreSQL connection string (e.g. free [Neon](https://neon.tech)).

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
PORT=3000
```

Apply migrations (if needed):

```bash
npx drizzle-kit migrate
```

Start the server:

```bash
npm run dev
```

API runs at **http://localhost:3000**.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown (usually **http://localhost:5173**). The frontend proxies `/api` to the backend.

---

## Project structure

```
users-management/
├── backend/     # Express API (users, projects, tasks) + Drizzle + PostgreSQL
│   └── src/
│       ├── controller/   # userController, projectController, taskController
│       ├── routes/       # users, projects, tasks
│       ├── services/     # userService, projectService, taskService
│       └── db/           # schema (users, projects, tasks), migrations
└── frontend/    # React + Vite + Tailwind (Users, Projects, Task board UI)
```

---

*Built for learning and portfolio use.*
