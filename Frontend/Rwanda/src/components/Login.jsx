
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({ AdminName: '', Password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

   try {
  const response = await api.login({
    AdminName: formData.AdminName,
    Password: formData.Password,
  });

  // ✅ Check if login was successful
  if (response.success) {
    alert(response.message);  // ✅ Use response not result
    navigate('/dashboard');
  } else {
    setErrors([response.errors?.[0] || 'Login failed']);
  }
} catch (err) {
  if (err.errors) {
    setErrors(err.errors);
  } else {
    setErrors(['Login failed. Please try again.']);
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rwanda Driving License</h1>
          <p className="text-gray-500 mt-2">RDL Management System</p>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <ul className="list-disc list-inside text-red-600 text-sm">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
            <input
              type="text"
              value={formData.AdminName}
              onChange={(e) => setFormData({...formData, AdminName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter admin name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.Password}
              onChange={(e) => setFormData({...formData, Password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">Register here</a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Rwanda Driving License. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;