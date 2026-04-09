import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Candidates from './components/Candidates';
import Grades from './components/Grades';
import Reports from './components/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
        <Route path="/grades" element={<Layout><Grades /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;