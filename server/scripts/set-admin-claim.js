// server/scripts/set-admin-claim.js
const admin = require('firebase-admin');

// ensure your firebase admin is initialized like in server/middleware/firebaseAuth.js
const serviceAccount = require('../firebase-service-account.json'); // adjust path if different

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const uid = process.argv[2]; // pass uid as first arg

if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.js <firebase-uid>');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log('Custom claim set for', uid);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error setting claim:', err);
    process.exit(1);
  });
