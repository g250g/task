import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: '', text: 'Dashboard' },
    { path: '/candidates', label: '', text: 'Candidates' },
    { path: '/grades', label: '', text: 'Grades' },
    { path: '/reports', label: '', text: 'Reports' },
  ];

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/10 backdrop-blur-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <h1 className="text-white font-bold text-lg">RDL</h1>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                location.pathname === item.path ? 'bg-white/20 text-white' : 'text-gray-300'
              }`}
            >
              <span className="text-xl">{item.label}</span>
              <span className="text-white">{item.text}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-300"
          >
            <span></span>
            <span>Logout</span>
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] lg:min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white/10 backdrop-blur-md border-r border-white/20 shrink-0">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <div>
                <h1 className="font-bold text-white">Rwanda DL</h1>
                <p className="text-xs text-gray-300">Management System</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.label}</span>
                <span>{item.text}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <span></span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;