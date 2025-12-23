Appointment Scheduler API

A portfolio-ready REST API for appointment scheduling built with Node.js, Express, and MongoDB.

Features

- Services Management: Full CRUD operations for services
- Time Slots Management: Create, read, update, and delete time slots
- Appointments Management: Create, read, update status, and delete appointments
- Double Booking Prevention: Atomic updates to prevent conflicts
- Input Validation: `express-validator`
- Error Handling: Centralized error handling middleware
- RESTful Design: Proper HTTP status codes and JSON responses
Tech Stack

- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Validation: express-validator
- Module System: ES2015 modules (import/export)

API Endpoints

Services
- GET /api/services - Get all services
- GET /api/services/:id - Get service by ID
- POST /api/services - Create new service
- PUT /api/services/:id - Update service
- DELETE /api/services/:id - Delete service

Time Slots
- GET /api/timeslots - Get all time slots
- GET /api/timeslots/:id - Get time slot by ID
- POST /api/timeslots - Create new time slot
- PUT /api/timeslots/:id - Update time slot
- DELETE /api/timeslots/:id - Delete time slot

Appointments
- GET /api/appointments - Get all appointments
- GET /api/appointments/:id - Get appointment by ID
- POST /api/appointments - Create new appointment
- PUT /api/appointments/:id/status - Update appointment status
- DELETE /api/appointments/:id - Delete appointment

Quick Start

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a .env file (sample):

```
MONGO_URI=mongodb://localhost:27017/appointment_scheduler
PORT=3000
```

3) Run the API

```bash
npm run dev
```

4) Run the frontend (static client)

```bash
npm run client
# Then open http://localhost:5173 and set the API base to http://localhost:3000/api
```

Frontend

- Location: client/
- Entry: client/index.html (served by npm run client)
- Configurable API base URL via the UI; uses fetch to call the backend routes.

Project Structure (key files)

```
src/
   app.js
   server.js
   config/db.js
   controllers/
   middleware/
   models/
   routes/
   utils/
client/
   index.html
   styles.css
   app.js
```

Response Format

Success (200/201):
```json
{
   "message": "Success message",
   "data": { }
}
```

Error (4xx/5xx):
```json
{
   "message": "Error message"
}
```

Status Codes

- 200 - Success (read/update operations)
- 201 - Created (create operations)
- 204 - No Content (delete operations)
- 400 - Bad Request (validation errors)
- 404 - Not Found
- 409 - Conflict (double booking)
- 500 - Internal Server Error