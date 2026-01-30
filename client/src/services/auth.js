// client/src/services/auth.js
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Signup user
export const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user; // do NOT get token here
};

// Login user
export const logIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user; // token fetched in frontend
};

// Logout user
export const logOut = async () => {
  await signOut(auth);
};
