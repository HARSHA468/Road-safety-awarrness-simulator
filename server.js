const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const quizRoutes = require('./routes/quiz');

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Road Safety API is running 🚦' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/road_safety_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without MongoDB (limited functionality)...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} (no DB)`);
    });
  });

module.exports = app;
