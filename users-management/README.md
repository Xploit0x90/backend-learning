# Users Management

A simple full-stack web app to **list**, **search**, and **create** users. Built as a learning project to demonstrate a React frontend talking to an Express API with a PostgreSQL database.

---

## What it does

- **List users** — Load and display all users from the database  
- **Search by name** — Find users by name  
- **Create user** — Add a new user (name + age)

---

## Technologies used

| Layer    | Tech |
|----------|------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Backend**  | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (Neon), Drizzle ORM |

---

## How to run

**Prerequisites:** Node.js (v18+), npm, and a PostgreSQL database (e.g. [Neon](https://neon.tech) free tier).

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
PORT=3000
```

Then start the server:

```bash
npm run dev
```

The API runs at **http://localhost:3000**.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (usually **http://localhost:5173**). The frontend proxies `/api` requests to the backend.

---

## Project structure

```
users-management/
├── backend/     # Express API + Drizzle + PostgreSQL
└── frontend/    # React + Vite + Tailwind
```

---

*Built for learning and portfolio use.*
