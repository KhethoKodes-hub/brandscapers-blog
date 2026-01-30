// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// 🔑 ADMIN TOKEN GENERATION ROUTE
router.get('/adminKey', (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: 'admin-1',
        username: 'admin',
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    console.error('Error creating admin token', err);
    res.status(500).json({ msg: 'Server error creating admin token' });
  }
});

module.exports = router;
  