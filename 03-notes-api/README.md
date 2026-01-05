**Here's your professional, concise README:**

---

```markdown
# Notes API

A REST API for managing notes with categories, timestamps, and full validation.

## Features

- ✅ Complete CRUD operations
- ✅ Input validation & sanitization
- ✅ Auto timestamps (createdAt, updatedAt)
- ✅ Categories (work, personal, ideas)
- ✅ Partial updates support
- ✅ Middleware chain (Logger, Error Handler, 404)
- ✅ Environment configuration

## Tech Stack

- Node.js
- Express.js
- dotenv

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/notes` | Get all notes | 200 |
| GET | `/notes/:id` | Get note by ID | 200, 404 |
| POST | `/notes` | Create note | 201, 400 |
| PUT | `/notes/:id` | Update note | 200, 400, 404 |
| DELETE | `/notes/:id` | Delete note | 200, 404 |

## Request Example

```bash
POST /notes
Content-Type: application/json

{
  "title": "Learning Backend",
  "content": "Completed Notes API with validation",
  "category": "work"
}
```

## Validation Rules

- `title`: Required, non-empty after trim
- `content`: Required, non-empty after trim
- `category`: Optional (work, personal, ideas)

## Project Structure

```
├── app.js                 # Application entry
├── routes/
│   └── notes.js          # Note routes
├── middleware/
│   ├── logger.js         # Request logging
│   └── errorHandler.js   # Error handling
├── data/
│   └── notes.js          # Data storage
├── validators.js         # Input validation
└── .env                  # Configuration
```

## Key Learnings

- RESTful API design
- Express middleware architecture
- Input validation & sanitization
- Error handling patterns
- Partial updates with PUT
- Environment-based configuration

---
