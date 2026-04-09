import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Reports() {
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, [filter]);

  const loadReport = async () => {
    setLoading(true);
    try {
      let result;
      if (filter === 'pass') result = await api.getPassReport();
      else if (filter === 'fail') result = await api.getFailReport();
      else result = await api.getAllReports();
      setData(result);
    } catch (err) {
      console.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const passedCount = data.filter(d => d.ObtainedMarks >= 12).length;
  const failedCount = data.filter(d => d.ObtainedMarks < 12).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Exam Results Report</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Results</h3>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow border border-green-200">
          <h3 className="text-green-700 text-sm">Passed (≥12)</h3>
          <p className="text-2xl font-bold text-green-700">{passedCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow border border-red-200">
          <h3 className="text-red-700 text-sm">Failed (&lt;12)</h3>
          <p className="text-2xl font-bold text-red-700">{failedCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Results', color: 'blue' },
          { key: 'pass', label: 'Passed Only', color: 'green' },
          { key: 'fail', label: 'Failed Only', color: 'red' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === btn.key
                ? `bg-${btn.color}-600 text-white`
                : `bg-${btn.color}-100 text-${btn.color}-700`
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm">Candidate</th>
                  <th className="text-left p-3 text-sm">National ID</th>
                  <th className="text-left p-3 text-sm">Category</th>
                  <th className="text-center p-3 text-sm">Marks</th>
                  <th className="text-center p-3 text-sm">Decision</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3 text-sm">{d.FirstName} {d.LastName}</td>
                    <td className="p-3 text-sm">{d.CandidateNationalId}</td>
                    <td className="p-3 text-sm">Category {d.LicenseExamCategory}</td>
                    <td className="p-3 text-center font-bold">{d.ObtainedMarks}/20</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        d.ObtainedMarks >= 12 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {d.ObtainedMarks >= 12 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;