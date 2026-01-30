// server/middleware/adminKey.js
module.exports = function (req, res, next) {
  const key = req.body.key || req.headers['x-admin-key'];
  if (!key) return res.status(403).json({ msg: 'No admin key provided' });
  if (key !== process.env.ADMIN_SECRET_KEY) return res.status(403).json({ msg: 'Invalid admin key' });
  next();
};
