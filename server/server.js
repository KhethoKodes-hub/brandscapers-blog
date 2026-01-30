// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// Security middleware
app.use(helmet());

// Body parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS - in development allow all, change in production
app.use(cors());

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200
});
app.use(limiter);

// Routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));


// basic root
app.get('/', (req, res) => res.json({ msg: 'Brandscapers Blog API running' }));

// Connect DB and start
// Connect DB and start (development-friendly: start even if DB fails)
const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => {
    console.error('DB connection error:', err && err.message ? err.message : err);
    console.warn('Continuing to start server without DB connection (dev only).');
    // Start the server anyway so you can test endpoints that don't require DB
    app.listen(PORT, () => console.log('Server running on port', PORT, '(without DB)'));
  });

