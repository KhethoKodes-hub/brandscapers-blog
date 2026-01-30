// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PostPage from './components/PostPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import NavBar from './components/NavBar';
import Login from './components/Login'; // <-- add this
import Register from './pages/Register'; // <-- add this

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/login" element={<Login />} />           {/* Login route */}
        <Route path="/register" element={<Register />} />     {/* Register route */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
