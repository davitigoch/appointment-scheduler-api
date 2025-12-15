import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import serviceRoutes from './routes/serviceRoutes.js';
import timeSlotRoutes from './routes/timeSlotRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Appointment Scheduler API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString()
    }
  });
});

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/appointments', appointmentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

// TODO: Add global error handling middleware here
// app.use(globalErrorHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;