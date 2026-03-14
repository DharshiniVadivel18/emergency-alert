const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency-alert', {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Server running without database. Some features may not work.');
    console.log('🔄 Will retry database connection in 60 seconds...');
    setTimeout(connectDB, 60000);
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Emergency Alert System API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      alerts: '/api/alerts',
      emergency: '/api/emergency',
      reports: '/api/reports',
      admin: '/api/admin'
    },
    documentation: 'See DEVELOPMENT-GUIDE.md for API usage'
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/emergency', require('./routes/emergencyAlerts'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/community', require('./routes/communityAlerts'));
app.use('/api/tracking', require('./routes/liveTracking'));
app.use('/api/safezones', require('./routes/safeZones'));
app.use('/api/oauth', require('./routes/oauth'));

// Socket.io for real-time alerts with validation
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    // Basic validation to prevent unauthorized room access
    if (userId && typeof userId === 'string' && userId.length > 0) {
      socket.join(userId);
      console.log(`User ${socket.id} joined room: ${userId}`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);
const { sendEmergencyAlertEmail } = require('./utils/emailService');
app.set('emailService', { sendEmergencyAlertEmail });

// Start server first, then connect to database
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access the API at: http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  connectDB(); // Connect to DB after server starts
});