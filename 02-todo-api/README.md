# Day 2: TODO API with Clean Architecture

Complete CRUD API with validation, proper HTTP status codes, and organized code structure.

## What I Learned:
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ PUT requests (partial updates)
- ✅ DELETE requests
- ✅ Input validation with separate validator functions
- ✅ HTTP status codes (200, 201, 400, 404)
- ✅ Data sanitization (trim)
- ✅ Code organization (routes, data, validators in separate files)
- ✅ Express Router
- ✅ Module exports/imports

## Project Structure:
```
day-02-todo-api/
├── app.js              # Server setup
├── routes/
│   └── todos.js        # All todo routes
├── data/
│   └── todos.js        # Todo data
├── validators.js       # Validation functions
└── package.json
```

## Routes:
- `GET /todos` - Get all todos (200)
- `GET /todos/:id` - Get one todo (200/404)
- `POST /todos` - Create todo (201/400)
- `PUT /todos/:id` - Update todo (200/404)
- `DELETE /todos/:id` - Delete todo (200/404)

## Tech Stack:
Node.js, Express

## Run:
```bash
npm install
node app.js
# or
npx nodemon app.js
```