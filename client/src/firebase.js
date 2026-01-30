import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZyvwt8p0GL1_Gy0xo0Aq8viZKoOqAdws",
  authDomain: "brandscapers-blog.firebaseapp.com",
  projectId: "brandscapers-blog",
  storageBucket: "brandscapers-blog.firebasestorage.app",
  messagingSenderId: "53098718036",
  appId: "1:53098718036:web:c53b8b5d2e92f0f07cdec1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
