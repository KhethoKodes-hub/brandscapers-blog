// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Security middleware
app.use(helmet());

// Body parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200
});
app.use(limiter);

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => res.json({ msg: 'Brandscapers Blog API running 🚀' }));

// PORT from Render
const PORT = process.env.PORT || 5050;

// Connect DB if available
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('DB connection error:', err.message));
}

// Start server (only once!)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
