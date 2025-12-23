import express from 'express';
import cors from 'cors';
import serviceRoutes from './routes/service.routes.js';
import timeSlotRoutes from './routes/timeslot.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/services', serviceRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(errorMiddleware);

export default app;