const admin = require('../firebase'); // same firebase admin instance you already use

async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'You must be logged in' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // attach minimal user info
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
      role: decodedToken.role || 'user', // default role
    };

    next();
  } catch (err) {
    console.error('verifyUser error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyUser;
