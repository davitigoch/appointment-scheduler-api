# Appointment Scheduler API

A portfolio-ready REST API for appointment scheduling built with Node.js, Express, and MongoDB.

## Features

- **Services Management**: Full CRUD operations for services
- **Time Slots Management**: Create, read, and delete time slots
- **Appointments Management**: Create, read, cancel, and delete appointments
- **Double Booking Prevention**: Atomic updates to prevent conflicts
- **Input Validation**: Using Joi validation library
- **Error Handling**: Centralized error handling middleware
- **RESTful Design**: Proper HTTP status codes and JSON responses

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: Joi
- **Module System**: ES2015 modules (import/export)

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Time Slots
- `GET /api/timeslots` - Get all time slots
- `GET /api/timeslots/:id` - Get time slot by ID
- `POST /api/timeslots` - Create new time slot
- `DELETE /api/timeslots/:id` - Delete time slot

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/appointment_scheduler
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)

## Project Structure

```
src/
├── config/
│   └── database.js
├── models/
│   ├── Service.js
│   ├── TimeSlot.js
│   └── Appointment.js
├── controllers/
│   ├── serviceController.js
│   ├── timeSlotController.js
│   └── appointmentController.js
├── routes/
│   ├── serviceRoutes.js
│   ├── timeSlotRoutes.js
│   └── appointmentRoutes.js
├── middleware/
│   └── errorHandler.js
├── utils/
│   └── validation.js
└── app.js
```

## Response Format

All responses follow a consistent JSON format:

**Success (200/201):**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error (4xx/5xx):**
```json
{
  "message": "Error message"
}
```

## Status Codes

- `200` - Success (read/update operations)
- `201` - Created (create operations)
- `204` - No Content (delete operations)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (double booking)
- `500` - Internal Server Error