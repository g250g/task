import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    passed: 0,
    failed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Candidates', value: stats.totalCandidates, color: 'blue', icon: '' },
    { title: 'Passed (≥12)', value: stats.passed, color: 'green', icon: '' },
    { title: 'Failed (<12)', value: stats.failed, color: 'red', icon: '' },
    { title: 'Pending', value: stats.pending, color: 'yellow', icon: '' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? '...' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white/95 rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">1. Add Candidates</h4>
            <p className="text-blue-600">Register new candidates with their details and exam dates.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">2. Record Grades</h4>
            <p className="text-green-600">Enter exam marks (0-20). System auto-calculates Pass/Fail.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">3. View Reports</h4>
            <p className="text-purple-600">Generate Pass/Fail reports for all exam results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;