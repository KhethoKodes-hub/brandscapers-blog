// server/middleware/verifyUser.js
const admin = require('../firebase'); // your firebase admin instance

async function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You must be logged in' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // attach user info to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User'),
      role: 'user', // standard user
    };

    next();
  } catch (err) {
    console.error('Firebase verifyUser error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyUser;
