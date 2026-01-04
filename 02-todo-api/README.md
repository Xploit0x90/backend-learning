# Todo REST API

A production-ready RESTful API built with Node.js and Express, featuring clean architecture, comprehensive middleware, and proper error handling.

## Features

- ✅ Full CRUD operations
- ✅ Input validation & sanitization
- ✅ Centralized error handling
- ✅ Request logging & performance monitoring
- ✅ Environment-based configuration
- ✅ Modular code structure

## Tech Stack

- Node.js
- Express.js
- dotenv

## Quick Start
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start server
npm start
```

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/todos` | Get all todos | 200 |
| GET | `/todos/:id` | Get todo by ID | 200, 404 |
| POST | `/todos` | Create new todo | 201, 400 |
| PUT | `/todos/:id` | Update todo | 200, 404, 400 |
| DELETE | `/todos/:id` | Delete todo | 200, 404 |

## Request Examples

**Create Todo**
```bash
POST /todos
Content-Type: application/json

{
  "title": "Learn Node.js"
}
```

**Update Todo**
```bash
PUT /todos/1
Content-Type: application/json

{
  "title": "Master Node.js",
  "completed": true
}
```

## Project Structure
```
├── app.js                 # Application entry point
├── routes/
│   └── todos.js          # Todo routes
├── middleware/
│   ├── logger.js         # Request logging
│   ├── timer.js          # Performance monitoring
│   └── errorHandler.js   # Error handling
├── data/
│   └── todos.js          # Data layer
└── validators.js         # Input validation
```

## Key Learnings

- RESTful API design principles
- Express middleware architecture
- Modular code organization
- Environment configuration
- Error handling strategies
- HTTP status code best practices

---

**Part of my backend development learning journey** • [View other projects](https://github.com/Xploit0x90)