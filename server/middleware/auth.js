// server/middleware/verifyAdmin.js
const admin = require('../firebase');

async function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Optional: you can restrict to specific email addresses
    const allowedAdmins = ['admin@example.com']; // replace with your admin emails
    if (!allowedAdmins.includes(decodedToken.email)) {
      return res.status(403).json({ message: 'Forbidden: not an admin' });
    }

    req.user = decodedToken; // attach user info to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyAdmin;
