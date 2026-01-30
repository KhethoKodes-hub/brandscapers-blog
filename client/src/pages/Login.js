import { useState } from 'react';
import { auth } from '../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const auth = getAuth();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();

      localStorage.setItem('token', token);
      localStorage.setItem('userName', userCred.user.displayName);
      localStorage.setItem('userId', userCred.user.uid);

      alert('Logged in successfully!');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email}
        onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password}
        onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
