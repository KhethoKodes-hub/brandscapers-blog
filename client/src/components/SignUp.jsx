// client/src/components/SignUp.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Email and password required');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // get token
      const token = await user.getIdToken();

      // store token
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);

      alert('Signup successful!');
      navigate('/'); // redirect to home page or dashboard
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#667eea', color: 'white', border: 'none' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
