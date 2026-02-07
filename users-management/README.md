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

## How to try it

This project does **not** use a shared database. To run it, you use **your own** database (or a live demo, if available).

- **Live demo (easiest):** If a demo is deployed, the link will be here: *(add your Vercel/Render etc. URL when you deploy)*
- **Run locally:** You need your own PostgreSQL instance. The easiest is a **free [Neon](https://neon.tech) account** (no credit card): sign up → create a project → copy the connection string. Then follow “How to run” below. The app will use your DB, so you can create and list your own test users.

---

## How to run

**Prerequisites:** Node.js (v18+), npm, and a PostgreSQL connection string (e.g. free [Neon](https://neon.tech) account — you get your own DB in under 2 minutes).

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with **your own** database URL (e.g. from Neon):

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
