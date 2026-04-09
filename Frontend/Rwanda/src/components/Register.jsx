import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

function Register() {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const isValidPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidPassword) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({
        AdminName: adminName,
        Password: password
      });

      if (response.success) {
        alert('Account created successfully!');
        navigate('/login');
      } else {
        setError(response.errors?.[0] || 'Registration failed');
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.errors?.[0] || err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-800 to-blue-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create Admin Account
        </h1>
        <p className="text-center text-gray-600 mb-6">RDL Management System</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
            
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <div className={hasMinLength ? 'text-green-600' : 'text-gray-400'}>
                {hasMinLength ? '✓' : '○'} At least 8 characters
              </div>
              <div className={hasUppercase ? 'text-green-600' : 'text-gray-400'}>
                {hasUppercase ? '✓' : '○'} One uppercase letter
              </div>
              <div className={hasLowercase ? 'text-green-600' : 'text-gray-400'}>
                {hasLowercase ? '✓' : '○'} One lowercase letter
              </div>
              <div className={hasNumber ? 'text-green-600' : 'text-gray-400'}>
                {hasNumber ? '✓' : '○'} One number
              </div>
              <div className={hasSpecial ? 'text-green-600' : 'text-gray-400'}>
                {hasSpecial ? '✓' : '○'} One special character (!@#$%^&*)
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm password"
              required
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValidPassword || !passwordsMatch}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading || !isValidPassword || !passwordsMatch
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;