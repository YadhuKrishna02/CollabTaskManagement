import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/tasks.js';
import dashboardRoutes from './routes/dashboard.js';
import notificationRoutes from './routes/notifications.js';
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: '*'
}));

// Create the HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO and pass the httpServer so they both use the same port
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.set('io', io);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Start the server and have both Express and Socket.IO listen on the same port
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server connected to DB & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  });
