// server/middleware/verifyAdmin.js
const admin = require('../firebase'); // your firebase admin instance

// ✅ Replace these with actual admin emails
const ADMINS = [
  'khetho.m@brandscapersafrica.com',
  'kmngomezulu82@gmail.com',
  'mv@test.com',
  'macdonald.k@brandscapersafrica.com',
  'test@test.com'
  
];

async function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'You must be logged in' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email || !ADMINS.includes(decoded.email)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0],
      role: 'admin',
    };

    next();
  } catch (err) {
    console.error('Firebase verifyAdmin error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyAdmin;
